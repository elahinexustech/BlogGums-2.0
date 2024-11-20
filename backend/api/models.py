from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission
from django.utils import timezone

class CustomUser(AbstractUser):
    # Define your custom fields here
    # phone_number = PhoneNumberField(null=True, blank=True, unique=True)
    profile_image_url = models.URLField(max_length=200, blank=True, null=True)
    date_of_birth = models.DateField(auto_now=True, null=True)

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