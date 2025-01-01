# from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from . import views


def run(req):
    return HttpResponse("HELLO")


urlpatterns = [
    path('', run),
    path('get/', views.UserDetail.as_view()),
    path('user/update', views.UpdateUser.as_view()),
    path('user/update_profile_pic', views.UpdateUserImage.as_view()),
    path('user/check_password', views.CheckPassword.as_view()),
    path('sendcode', views.SendCode.as_view()),
    path('verifycode', views.VerifyCode.as_view()),
    path('reset', views.Reset.as_view()),
]
