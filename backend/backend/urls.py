from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, CheckAuth
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def index(req):
    return JsonResponse({"msg": "hey, user!"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/user/check-auth/", CheckAuth.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("blogs/", include("blogs.urls")),
    path('', index)
]