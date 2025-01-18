# from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


def run(req):
    return HttpResponse("HELLO")


urlpatterns = [
    path('', run),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("user/register/", views.CreateUserView.as_view(), name="register"),
    path("user/check-auth/", views.CheckAuth.as_view(), name="register"),
    path('get/', views.UserDetail.as_view()),
    path('user/update', views.UpdateUser.as_view()),
    path('user/update_profile_pic', views.UpdateUserImage.as_view()),
    path('user/check_password', views.CheckPassword.as_view()),
    path('sendcode', views.SendCode.as_view()),
    path('verifycode', views.VerifyCode.as_view()),
    path('reset', views.Reset.as_view()),
]
