# from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
# from api.views import CreateUserView
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

def run(req):
    return HttpResponse("HELLO")

urlpatterns = [
    path('', run)
]