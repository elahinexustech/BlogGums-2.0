from django.http import JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password
from rest_framework import generics
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from .models import OTPModel, TEMP_USER, TEMP_OTP_MODEL
from django.db.models import Q
from .funcs import send_email
from supabase import create_client
from django.db import IntegrityError
import json
from django.contrib.auth.hashers import check_password

UserModel = get_user_model()


class CreateUserView(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, req):
        data = json.loads(req.body)

        # Check for duplicate username or email in `UserModel`
        if UserModel.objects.filter(username=data.get('username')).exists():
            return JsonResponse({"msg": "User with this username already exists!"}, status=400)

        if UserModel.objects.filter(email=data.get('email')).exists():
            return JsonResponse({"msg": "User with this email already exists!"}, status=400)

        try:
            # Check if the user exists in TEMP_USER for reactivation
            user = TEMP_USER.objects.filter(
                Q(username=data.get('username')) | Q(email=data.get('email'))
            ).first()
            
            if user:
                user.username = data.get('username')
                user.email = data.get('email')
                user.first_name = data.get('first_name')
                user.last_name = data.get('last_name')
                user.password = data.get('password') 
                user.save()
                message = "Your account has been reactivated. Please proceed to verify."
                
            else:
                user = TEMP_USER.objects.create(
                    username=data.get('username'),
                    email=data.get('email'),
                    password=data.get('password'),
                    first_name=data.get('first_name'),
                    last_name=data.get('last_name'),
                )
            
            # Handle OTP generation
            otp, created = TEMP_OTP_MODEL.objects.get_or_create(user=user)
            if not created:
                # If OTP already exists, delete the old one and create a new OTP
                otp.delete()
                otp = TEMP_OTP_MODEL.objects.create(user=user)

            otp.generate_otp()  # Generate a new OTP
            otp.save()

            # Send OTP email
            send_email(
                reciever=user.email,
                title="OTP Verification Code",
                msg=f'''<h1>Hello {user.username}
                    </h1><br><h2>{otp.otp_code}</h2>''',
            )

            return JsonResponse({"msg": "message"}, status=200)

        except IntegrityError as e:
            # Handle integrity errors
            print(e)
            return JsonResponse({"msg": "An error occurred while processing your request. Please try again."}, status=500)

        except Exception as e:
            return JsonResponse({"msg": "Something went wrong. Please contact support."}, status=500)


class CheckAuth(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, req):
        user = req.user
        serialized_data = UserSerializer(user)
        return JsonResponse({"user": serialized_data.data})


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
    URL = 'https://zgwzboicmlnyrqyrzlel.supabase.co'
    KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpnd3pib2ljbWxueXJxeXJ6bGVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4MTcwMjYsImV4cCI6MjA1MzM5MzAyNn0.7K7eUR_tK1868vgAZeDX6E0VnQcTgXFM9GakRpbSI9I'
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

        try:
        # Decide whether to upload or update based on profile_image_url
            if not user.profile_image_url:
                success, resp, url = self.upload_image(user.username, image_file)
            else:
                success, resp, url = self.update_image(user.username, image_file)

            print(success, resp, url)

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

        except Exception as e:
            return JsonResponse({"error": "An unexpected error occurred"}, status=500)

    def upload_image(self, user, img):
        """
        Uploads a new image to the storage.
        """
        try:
            file_extension = img.name.split('.')[-1]
            file_name = f'{user}/profile-picture.{file_extension}'

            file_content = img.read()

            resp = UpdateUserImage.CLIENT.storage.from_('users').upload(file_name, file_content)
            url = UpdateUserImage.CLIENT.storage.from_('users').get_public_url(file_name)

            return True, resp, url

        except Exception as e:
            print(e)
            return False, None, None

    def update_image(self, user, img):
        """
        Updates an existing image in the storage.
        """
        # try:
        # Define the file name with the correct extension
        file_extension = img.name.split('.')[-1]
        file_name = f'{user}/profile-picture.{file_extension}'

        # Remove the old file
        try:
            UpdateUserImage.CLIENT.storage.from_('users').remove([file_name])
        except Exception as delete_error:
            return JsonResponse({"msg": delete_error}, status=500)

        # Upload the new file
        file_content = img.read()

        resp = UpdateUserImage.CLIENT.storage.from_(
            'users').upload(file_name, file_content)
        url = UpdateUserImage.CLIENT.storage.from_(
            'users').get_public_url(file_name)

        return True, resp, url



class CheckPassword(generics.CreateAPIView):
    def post(self, req):
        # Parse the request body to get the username and password
        data = json.loads(req.body)
        user = req.user
        password = data.get('password')

        # Check if the password is provided
        if not password:
            return JsonResponse({"msg": "Password is required"}, status=400)


        # Check if the provided password matches the stored password
        if check_password(password, user.password):
            return JsonResponse({"msg": "Password is correct", "status": 200})
        else:
            return JsonResponse({"msg": "Password is incorrect"}, status=400)


class SendCode(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, req):
        data = json.loads(req.body)
        email = data['email']

        user = get_object_or_404(UserModel, email=email)
        otp = OTPModel.objects.filter(user=user)
        if otp.exists():
            otp.delete()  # Delete old OTPs
        otp = OTPModel(user=user)
        otp.generate_otp()
        otp.save()

        # Send OTP via email
        send_email(reciever=email, title="OTP Verification Code",
                   msg=f'''<h1>Hello {user}</h1><br><h2>{otp}</h2>''')

        return JsonResponse({"msg": "SendCode"})


class VerifyCode(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, req):
        data = json.loads(req.body)
        email = data['email']
        otp_entered = data['code']
        otp_type = data['type']

        # Determine the appropriate user and OTP models
        if otp_type == 'TEMP':
            user_model = TEMP_USER
            otp_model = TEMP_OTP_MODEL
        elif otp_type == 'PERMENANT':
            user_model = UserModel
            otp_model = OTPModel
        else:
            return JsonResponse({"msg": "Invalid OTP type"}, status=400)

        # Get user and associated OTP
        user = get_object_or_404(user_model, email=email)
        otp_record = otp_model.objects.filter(user=user).first()

        if not otp_record or otp_entered != otp_record.otp_code:
            return JsonResponse({"msg": "Code Not Verified"}, status=400)

        if otp_type == 'TEMP':
            # Transfer TEMP_USER to UserModel
            permanent_user = UserModel.objects.create(
                username=user.username,
                email=user.email,
                password=make_password(user.password),
                first_name=user.first_name,
                last_name=user.last_name,
            )

            # Transfer OTP
            OTPModel.objects.create(user=permanent_user, otp_code=otp_record.otp_code)

            # Clean up TEMP_USER and TEMP_OTP_MODEL records
            user.delete()
            otp_record.delete()

            return JsonResponse({"msg": "User transferred successfully and code verified"}, status=200)

        return JsonResponse({"msg": "Code Verified"}, status=200)


class Reset(generics.CreateAPIView):
    permission_classes = [AllowAny]

    def post(self, req):
        data = json.loads(req.body)
        user = get_object_or_404(UserModel, email=data['email'])
        user.set_password(data['newPassword'])
        user.save()
        return JsonResponse({"msg": "Reset"})
