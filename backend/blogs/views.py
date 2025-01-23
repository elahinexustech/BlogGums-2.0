from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from django.utils import timezone
from supabase import create_client
from .serializers import BlogSerializer, PostSerializer, CommentsSerializer, AuthorSerializer
from rest_framework.permissions import IsAuthenticated
from .models import BlogPost, Likes, Comments, Views
from django.http import JsonResponse
import json

User = get_user_model()

# Create your views here.


class PostPagination(PageNumberPagination):
    page_size = 5  # Fetch 5 posts at a time
    page_size_query_param = 'page_size'
    max_page_size = 100


class PostListView(generics.ListAPIView):

    def get_queryset(self):
        # Ensure queryset is consistently ordered
        return BlogPost.objects.annotate(total_likes=Count('likes')).order_by('-published_at', '-id')

    def get(self, request, *args, **kwargs):
        user = request.user
        queryset = self.get_queryset()
        comments = Comments.objects.filter(post__in=queryset)
        paginator = PostPagination()
        page = paginator.paginate_queryset(queryset, request)
        
        response_data = []
        for post in page:
            author_data = AuthorSerializer(post.author).data  # Serialize author data
            user_has_liked = post.likes.filter(like_by=user).exists()
            response_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': author_data,
                'total_likes': post.like_count(),
                'comment_count': post.comment_count(),
                'updated_at': post.updated_at,
                'published_at': post.published_at,
                'has_liked': user_has_liked,
                'comments': CommentsSerializer(comments.filter(post=post), many=True).data
            })
        
        return JsonResponse({
            "data": response_data,
            "next": paginator.get_next_link(),
            "previous": paginator.get_previous_link(),
            "count": paginator.page.paginator.count
        })


class PostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req, id):
        # Get the BlogPost object or return a 404 if not found
        post = get_object_or_404(BlogPost, id=id)

        # Serialize the blog post
        serialized_post = PostSerializer(post)

        # Get all comments related to this post and serialize them
        comments = post.comments.all().order_by('-created_at')
        serialized_comments = CommentsSerializer(comments, many=True)

        # Get all likes related to this post
        likes = post.likes.all()
        total_likes = likes.count()

        # Prepare response data with total counts and serialized data
        response_data = {
            "post": serialized_post.data,
            "comments": serialized_comments.data,
            "total_comments": comments.count(),
            "total_likes": total_likes,
            "liked_by_this_user":  Likes.objects.filter(like_by=req.user).exists()
        }

        return JsonResponse(response_data, safe=False, status=status.HTTP_200_OK)


class CreatePostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        data = json.loads(req.body)
        try:
            BlogPost.objects.create(
                title=data['title'],
                content=data['content'],
                author=req.user,
                updated_at=timezone.now(),
                published_at=timezone.now()
            )

            return JsonResponse({"status": status.HTTP_200_OK})
        except Exception as e:
            print("ERROR ", e)
            return JsonResponse({"status": status.HTTP_500_INTERNAL_SERVER_ERROR})


class DeletePostView(generics.CreateAPIView):
    def post(self, req):
        
        data = json.loads(req.body)
        
        if not data.get('post_id'):
            return JsonResponse({"msg": "Missing post_id parameter."}, status=400)
        else:
            post_id = data['post_id']
            try:
                post = BlogPost.objects.get(id=post_id)
                try:
                    Comments.objects.filter(post=post).delete()
                except Exception as e:
                    print(f"Error deleting comments: {e}")

                try:
                    Likes.objects.filter(post_liked=post).delete()
                except Exception as e:
                    print(f"Error deleting likes: {e}")

                try:
                    Views.objects.filter(post=post).delete()
                except Exception as e:
                    print(f"Error deleting views: {e}")
                post.delete()
            except BlogPost.DoesNotExist:
                return JsonResponse({"msg": "Post not found.", "status": 404}, status=404)
            except Exception as e:
                print(f"Error: {e}")
                return JsonResponse({"msg": "Error deleting post.", "status": 500}, status=500)
        
        return JsonResponse({"msg": "Post deleted", "status": 200})

class AddLikeView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        data = json.loads(req.body)
        post_id = data['post_id']
        try:
            post = BlogPost.objects.filter(id=post_id).first()
        except:
            return JsonResponse({"Error": "Error Finding BlogPost"})

        try:
            existing_like = Likes.objects.filter(like_by=req.user, post_liked=post_id).first()
        except:
            existing_like = False
            
        if existing_like:
            existing_like.delete()
            return JsonResponse({"message": "Like removed", "status":status.HTTP_200_OK, "like_count": post.like_count()})
        else:
            now = timezone.now()
            Likes.objects.create(like_by=req.user, post_liked=post, created_at=now)
            
            return JsonResponse({"message": "Like added successfully", "status":status.HTTP_200_OK, "like_count": post.like_count()})


class GetUserPost(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = BlogSerializer

    def post(self, req):
        data = json.loads(req.body)
        user = User.objects.filter(username=data['username']).first()
        posts = BlogPost.objects.filter(author=user)
        serialized_posts = BlogSerializer(posts, many=True)

        return JsonResponse({"post": serialized_posts.data, "status":status.HTTP_200_OK})
    


class PostComment(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        data = json.loads(req.body)

        try:
            # Get the BlogPost instance or return a 404
            post = get_object_or_404(BlogPost, id=data['postId'])

            # Create a new comment
            Comments.objects.create(
                comment=data['comment_field'],
                post=post,
                user=req.user
            )

            # Retrieve all comments for this post
            comments = post.comments.all()
            serialized_comments = CommentsSerializer(comments, many=True)

        except BlogPost.DoesNotExist:
            return JsonResponse({"error": "Post not found", "status": status.HTTP_404_NOT_FOUND})
        except Exception as e:
            print(e)
            return JsonResponse({"error": "Can't upload to server", "status": status.HTTP_500_INTERNAL_SERVER_ERROR})

        # Prepare and return the response
        return JsonResponse(
            {
                "msg": "Comment uploaded successfully!",
                "comments": serialized_comments.data,
                "total_comments": comments.count(),
                "blog_id": post.id,
                "status": status.HTTP_200_OK
            },
            safe=False
        )


class GetMorePost(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        data = json.loads(request.body)
        
        current_post_id = data.get('current_post', None)  # Get current post ID from request
        
        if not current_post_id:
            return JsonResponse({"msg": "Missing current_post parameter."}, status=400)

        try:
            # Fetch the current post by ID
            current_post = BlogPost.objects.get(id=current_post_id)
            
            # Get the author of the current post
            author = current_post.author
            
            # Fetch all posts by this author, ordered by ID, and exclude the current post
            posts_by_author = BlogPost.objects.filter(author=author).exclude(id=current_post_id).order_by('id')

            # Serialize the filtered posts
            blogs = BlogSerializer(posts_by_author, many=True)

            # Return the serialized data in the response
            return JsonResponse({"posts": blogs.data}, status=200)

        except BlogPost.DoesNotExist:
            return JsonResponse({"msg": "Post not found."}, status=404)
        except Exception as e:
            print(f"Error: {e}")
            return JsonResponse({"msg": "Error fetching posts."}, status=500)



class UploadMedia(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    # Supabase configuration
    SUPABASE_URL = 'https://yfcnkjxsrwvycucsebnl.supabase.co'
    SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmY25ranhzcnd2eWN1Y3NlYm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3OTE2MzEsImV4cCI6MjA0NTM2NzYzMX0.ZZ3Kb-X29KDahOx2H_P0aQLbPSC4Cp54q0Z6IwzBObQ'
    CLIENT = create_client(SUPABASE_URL, SUPABASE_KEY)

    def post(self, request):
        """
        Handles media file uploads to Supabase.
        """
        # Access uploaded files from request.FILES
        media_files = request.FILES.getlist('media')

        if not media_files:
            return JsonResponse({"error": "No media files uploaded"}, status=400)

        user = request.user  # Use the username as a folder name

        uploaded_files = []
        try:
            for media_file in media_files:
                success, url = self.upload_media(user.username, media_file)
                if success:
                    uploaded_files.append(url)
                else:
                    return JsonResponse(
                        {"error": f"Failed to upload file: {media_file.name}"}, 
                        status=500
                    )

            return JsonResponse({
                "message": "Media files uploaded successfully!",
                "uploaded_files": uploaded_files,
                "status": 200
            })

        except Exception as e:
            return JsonResponse(
                {"error": f"An unexpected error occurred: {str(e)}"}, 
                status=500
            )

    def upload_media(self, username, media_file):
        """
        Uploads a media file to the Supabase storage.
        """
        try:
            # Generate a unique file path for the uploaded file
            file_extension = media_file.name.split('.')[-1]
            file_name = f'{username}/{media_file.name}'

            # Read file content
            file_content = media_file.read()

            # Upload the file to Supabase storage
            response = UploadMedia.CLIENT.storage.from_('users').upload(
                file_name, file_content, {"content-type": media_file.content_type}
            )

            # Handle Supabase response
            if hasattr(response, "error") and response.error:
                raise Exception(response.error.message)

            # Get the public URL of the uploaded file
            public_url = UploadMedia.CLIENT.storage.from_('users').get_public_url(file_name)
            return True, public_url

        except Exception as e:
            print(f"Upload failed: {str(e)}")
            return False, None

        
        
        
        
class GetMedia(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    SUPABASE_URL = 'https://yfcnkjxsrwvycucsebnl.supabase.co'  # Replace with your URL
    SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmY25ranhzcnd2eWN1Y3NlYm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3OTE2MzEsImV4cCI6MjA0NTM2NzYzMX0.ZZ3Kb-X29KDahOx2H_P0aQLbPSC4Cp54q0Z6IwzBObQ'  # Replace with your API key
    CLIENT = create_client(SUPABASE_URL, SUPABASE_KEY)

    def post(self, request):
        username = request.user.username  # Ensure this returns the username

        try: response = GetMedia.CLIENT.storage.from_('users').list(f'{request.user}')
        except Exception as e: return JsonResponse({"msg": e}, status=500)
        
        imgs = []
        
        for data in response:
            imgs.append({'name': data['name'], 'url': GetMedia.CLIENT.storage.from_(f'users/{username}').get_public_url(data['name'])})

        return JsonResponse({"data": imgs})