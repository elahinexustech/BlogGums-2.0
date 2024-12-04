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
from supabase import create_client
import os


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
            'dob': user.date_of_birth,
            'profile_image_url': user.profile_image_url
        }
        return JsonResponse(user_data)


class UpdateUser(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        data = json.loads(req.body)

        try:
            UserModel.objects.filter(username=req.user).update(
                username=data['username'], first_name=data['first_name'], last_name=data[
                    'last_name'], email=data['email'], date_of_birth=data['dob']
            )
            return JsonResponse({"msg": "update successfully!", "status": status.HTTP_200_OK})
        except Exception as e:
            return JsonResponse({"error": e, "status": status.HTTP_500_INTERNAL_SERVER_ERROR})




class UpdateUserImage(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    # Add your Supabase URL and KEY here
    URL = 'https://yfcnkjxsrwvycucsebnl.supabase.co'
    KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlmY25ranhzcnd2eWN1Y3NlYm5sIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk3OTE2MzEsImV4cCI6MjA0NTM2NzYzMX0.ZZ3Kb-X29KDahOx2H_P0aQLbPSC4Cp54q0Z6IwzBObQ'
    CLIENT = create_client(URL, KEY)

    def post(self, request):
        """
        Handles profile picture upload or update.
        """
        # Access the uploaded file from request.FILES
        image_file = request.FILES.get('image')

        if not image_file:
            return JsonResponse({"error": "No image file uploaded"}, status=400)

        user = request.user  # Use the username as folder name

        # try:
            # Decide whether to upload or update based on profile_image_url
        if not user.profile_image_url:
            success, resp, url = self.upload_image(user.username, image_file)
        else:
            success, resp, url = self.update_image(user.username, image_file)

        if success:
            # Optionally update the user's profile image URL in the database
            user.profile_image_url = url
            user.save()

            return JsonResponse({
                "message": "Profile picture uploaded successfully!",
                "url": url
            })
        else:
            return JsonResponse({"error": "Failed to upload image"}, status=500)

        # except Exception as e:
        #     print("Unexpected Error:", e)
        #     return JsonResponse({"error": "An unexpected error occurred"}, status=500)

    def upload_image(self, user, img):
        """
        Uploads a new image to the storage.
        """
        # try:
        file_extension = img.name.split('.')[-1]
        file_name = f'{user}/profile-picture.{file_extension}'

        file_content = img.read()

        resp = UpdateUserImage.CLIENT.storage.from_('users').upload(file_name, file_content)
        url = UpdateUserImage.CLIENT.storage.from_('users').get_public_url(file_name)

        return True, resp, url

        # except Exception as e:
        #     print("Upload Error:", e)
        #     return False, None, None

    def update_image(self, user, img):
        """
        Updates an existing image in the storage.
        """
        # try:
            # Define the file name with the correct extension
        file_extension = img.name.split('.')[-1]
        file_name = f'{user}/profile-picture.{file_extension}'

        # Remove the old file
        # try:
        UpdateUserImage.CLIENT.storage.from_('users').remove([file_name])
        # except Exception as delete_error:
        #     print("Delete Error:", delete_error)

        # Upload the new file
        file_content = img.read()

        resp = UpdateUserImage.CLIENT.storage.from_('users').upload(file_name, file_content)
        url = UpdateUserImage.CLIENT.storage.from_('users').get_public_url(file_name)

        return True, resp, url

        # except Exception as e:
        #     print("Update Error:", e)
        #     return False, None, None



urlpatterns = [
    path('', run),
    path('get/', UserDetail.as_view()),
    path('user/update', UpdateUser.as_view()),
    path('user/update_profile_pic', UpdateUserImage.as_view()),
]
