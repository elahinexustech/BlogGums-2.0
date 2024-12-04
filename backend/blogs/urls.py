from django.urls import path, include
from . import views

urlpatterns = [
    path("get/", views.PostListView.as_view()),
    path("post/<int:id>", views.PostView.as_view()),
    path("post/create", views.CreatePostView.as_view()),
    path("addlike", views.AddLikeView.as_view()),
    path("getuserposts", views.GetUserPost.as_view()),
    path("more_post", views.GetMorePost.as_view()),
    path("post_comment", views.PostComment.as_view()),
]