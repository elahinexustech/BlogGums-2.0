# from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

def run(req):
    return HttpResponse("HELLO")




UserModel = get_user_model()

class UserDetail(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        username = request.GET.get('username')
        if not username:
            return JsonResponse({'error': 'Username is required'}, status=400)

        user = get_object_or_404(UserModel, username=username)
        user_data = {
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
        }
        return JsonResponse(user_data)


urlpatterns = [
    path('', run),
    path('get/', UserDetail.as_view())
]