from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics
from rest_framework import status
from django.utils import timezone
from .serializers import BlogSerializer, PostSerializer, CommentsSerializer, AuthorSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
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
    queryset = BlogPost.objects.annotate(total_likes=Count('likes')).all()
    serializer_class = BlogSerializer
    pagination_class = PostPagination

    def get(self, request, *args, **kwargs):
        # Get the queryset and annotate likes
        queryset = self.get_queryset()

        # Prepare a custom JSON response
        response_data = []
        
        for post in queryset:
            author_data = AuthorSerializer(post.author).data  # Serialize author data
            response_data.append({
                'id': post.id,
                'title': post.title,
                'content': post.content,
                'author': author_data,  # Include the serialized author data
                'total_likes': post.like_count(),  # Call like_count method for total likes
                'comment_count': post.comment_count(),
                'updated_at': post.updated_at,
                'published_at': post.published_at,
            })

        return JsonResponse({"data": response_data})



class PostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req, id):
        # Get the BlogPost object or return a 404 if not found
        post = get_object_or_404(BlogPost, id=id)

        # Serialize the blog post
        serialized_post = PostSerializer(post)

        # Get all comments related to this post and serialize them
        comments = post.comments.all()
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
        print("hey")
        data = json.loads(req.body)
        try:
            BlogPost.objects.create(
                title=data['title'],
                content=data['content'],
                author=req.user,
                updated_at=timezone.now(),
                published_at=timezone.now()
            )
            print("DONE")

            return JsonResponse({"status": status.HTTP_200_OK})
        except Exception as e:
            print("ERROR ", e)
            return JsonResponse({"status": status.HTTP_500_INTERNAL_SERVER_ERROR})


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