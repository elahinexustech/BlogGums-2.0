from django.db import models
from django.conf import settings

# BlogPost model
class BlogPost(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
    ]
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=100)
    content = models.TextField(max_length=50000, default="Let's share your daily routine...")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default="")
    updated_at = models.DateTimeField(auto_now=True, null=True)
    published_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')

    def __str__(self):
        return self.title
    
    def like_count(self):
        return self.likes.count()  # Changed to related_name "likes" for clarity

    def comment_count(self):
        return self.comments.count()  # Changed to related_name "comments" for clarity

    class Meta:
        ordering = ['-published_at']


# Likes model
class Likes(models.Model):
    id = models.AutoField(primary_key=True)
    like_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)
    post_liked = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='likes', null=True)  # Added related_name
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.like_by.username} likes {self.post_liked.title} at {self.created_at}"


# Comments model
class Comments(models.Model):
    id = models.AutoField(primary_key=True)
    comment = models.TextField(max_length=500, default="Love your post")
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name='comments', null=True)  # Changed post_id to post
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)  # Changed user_id to user
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.comment


# Views model
class Views(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True)  # Changed user_id to user
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, null=True)  # Changed post_id to post
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='views_as_author',
        default=""
    )
    view_time = models.DateTimeField(auto_now=True)
