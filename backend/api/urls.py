# from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import get_user_model
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
import json


UserModel = get_user_model()


def run(req):
    return HttpResponse("HELLO")


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
            'dob':user.date_of_birth
        }
        return JsonResponse(user_data)


class UpdateUser(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        data = json.loads(req.body)
        print(data)

        try:
            UserModel.objects.filter(username=req.user).update(
                username=data['username'], first_name=data['first_name'], last_name=data['last_name'], email=data['email'], date_of_birth=data['dob']
            )
            return JsonResponse({"msg": "update successfully!", "status": status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({"error":e, "status": status.HTTP_500_INTERNAL_SERVER_ERROR})


urlpatterns = [
    path('', run),
    path('get/', UserDetail.as_view()),
    path('user/update', UpdateUser.as_view()),
]
