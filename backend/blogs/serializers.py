from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import BlogPost, Comments, Likes, Views

User = get_user_model()

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email', 'profile_image_url']

class BlogSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()

    class Meta:
        model = BlogPost
        fields = "__all__"

class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()

    class Meta:
        model = BlogPost
        fields = "__all__"

class CommentsSerializer(serializers.ModelSerializer):
    user = AuthorSerializer(source='user')  # Correct field name is 'user'

    class Meta:
        model = Comments
        fields = "__all__"

class LikesSerializer(serializers.ModelSerializer):
    like_by = AuthorSerializer(source='like_by')

    class Meta:
        model = Likes
        fields = "__all__"

class ViewsSerializer(serializers.ModelSerializer):
    user = AuthorSerializer(source='user')  # Correct field name is 'user'
    author = AuthorSerializer(source='author')  # Correct field name is 'author'

    class Meta:
        model = Views
        fields = "__all__"
