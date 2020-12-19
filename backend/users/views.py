from django.shortcuts import render
from rest_framework.generics import ListCreateAPIView
from rest_framework.views import APIView
from django.contrib.auth.models import User
from .serializers import UserSerializer
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from .models import Profile
from rest_framework.permissions import IsAuthenticated
from .serializers import UserWithProfileSerializer
from rest_framework import serializers


@receiver(post_save, sender=User)
def createProfileandToken(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)
        Profile.objects.create(user=instance)


class CustomAuthToken(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        token, created = Token.objects.get_or_create(user=user)
        userData = UserWithProfileSerializer(User.objects.get(id=user.id)).data

        return Response({
            'token': token.key,
            'user': userData
        })


class UserListAndCreate(ListCreateAPIView):
    model = User
    serializer_class = UserSerializer
    queryset = User.objects.all()


class GetUser(APIView):
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        serializer = UserWithProfileSerializer(
            request.user, context={'request': request})

        return Response({
            'user': serializer.data
        })
