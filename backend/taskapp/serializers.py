from rest_framework import serializers
from .models import *
from users.serializers import UserSerializer
from django.contrib.auth.models import User
from users.models import Profile
from users.serializers import UserWithProfileSerializer, ProfileSerializer


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ['creator']


class CategorySerializer(serializers.ModelSerializer):
    category_tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ('id', 'name', 'team', 'category_tasks')


class TeamSerializer(serializers.ModelSerializer):
    users = UserWithProfileSerializer(many=True)

    class Meta:
        model = Team
        fields = '__all__'


class TeamCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Team
        fields = '__all__'


class CategoryListSerializer(serializers.ModelSerializer):
    category_tasks = TaskSerializer(many=True)

    class Meta:
        model = Category
        fields = '__all__'


class TeamListSerializer(serializers.ModelSerializer):
    team_categories = CategoryListSerializer(many=True)
    users = UserWithProfileSerializer(many=True)

    class Meta:
        model = Team
        fields = ['id', 'name', 'users', 'team_categories']


class ChangeCategorySerializer(serializers.Serializer):
    category = serializers.IntegerField()
    team = serializers.IntegerField()
