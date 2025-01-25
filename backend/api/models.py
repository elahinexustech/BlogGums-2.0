from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone
import random

class CustomUser(AbstractUser):
    # Define your custom fields here
    # phone_number = PhoneNumberField(null=True, blank=True, unique=True)
    profile_image_url = models.URLField(max_length=200, blank=True, null=True)
    date_of_birth = models.DateField(null=True, blank=True)

    groups = models.ManyToManyField(
        Group,
        related_name='customuser_set',  # Change this to avoid conflict
        blank=True,
        help_text='The groups this user belongs to.',
        related_query_name='customuser',
    )
    user_permissions = models.ManyToManyField(
        Permission,
        related_name='customuser_set',  # Change this to avoid conflict
        blank=True,
        help_text='Specific permissions for this user.',
        related_query_name='customuser',
    )
    
class OTPModel(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.save()

    def __str__(self):
        return f'{self.user.username} - {self.otp_code}'



class TEMP_USER(models.Model):
    id = models.BigAutoField(primary_key=True)  # int8 primary key
    password = models.CharField(max_length=128)  # varchar
    last_login = models.DateTimeField(null=True, blank=True)  # timestamp
    is_superuser = models.BooleanField(default=False)  # bool
    username = models.CharField(max_length=150, unique=True)  # varchar
    first_name = models.CharField(max_length=150, blank=True)  # varchar
    last_name = models.CharField(max_length=150, blank=True)  # varchar
    email = models.EmailField(unique=True)  # varchar
    is_staff = models.BooleanField(default=False)  # bool
    is_active = models.BooleanField(default=True)  # bool
    date_joined = models.DateTimeField(auto_now_add=True)  # timestamp
    profile_image = models.CharField(max_length=255, blank=True, null=True)  # varchar
    date_of_birth = models.DateField(null=True, blank=True)  # date

    def __str__(self):
        return self.username

class TEMP_OTP_MODEL(models.Model):
    user = models.ForeignKey(TEMP_USER, on_delete=models.CASCADE)
    otp_code = models.CharField(max_length=6, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    def generate_otp(self):
        self.otp_code = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        self.save()

    def __str__(self):
        return f'{self.user.username} - {self.otp_code}'
