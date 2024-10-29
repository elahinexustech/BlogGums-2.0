from django.http import JsonResponse
from django.contrib.auth import get_user_model
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import logout

User = get_user_model()


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class CheckAuth(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        user = req.user
        serialized_data = UserSerializer(user)
        return JsonResponse({"user": serialized_data.data})
