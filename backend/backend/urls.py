from django.http import JsonResponse
from django.contrib import admin
from django.urls import path, include

def index(req):
    return JsonResponse({"msg": "hey, user!"})

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path("blogs/", include("blogs.urls")),
    path('', index)
]