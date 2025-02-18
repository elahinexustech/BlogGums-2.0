from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from rest_framework.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import AccessToken

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'password', 'profile_image_url', 'date_of_birth']
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def create(self, validated_data):
        user = CustomUser.objects.create(
            email=validated_data['email'],
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            profile_image_url="",
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
   
   
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        if self.user.is_banned:  # Assuming 'is_banned' field exists
            return {"error":"banned", "msg": "Your account has been banned. Contact support.", "status": 403}

        return data

class CustomTokenRefreshSerializer(TokenRefreshSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh_token = attrs["refresh"]
        access_token = AccessToken(refresh_token)
        user_id = access_token["user_id"]

        user = CustomUser.objects.filter(id=user_id).first()
        if user and user.is_banned:
            return {"error":"banned", "msg": "Your account has been banned. Contact support.", "status": 403}

        return data