from django.shortcuts import render
from rest_framework.generics import DestroyAPIView, ListCreateAPIView, CreateAPIView, ListAPIView
from rest_framework.views import APIView
from .models import Team
from .serializers import (TeamSerializer, TeamCreateSerializer,
                          CategorySerializer, TaskSerializer,
                          TeamListSerializer, ChangeCategorySerializer)
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404
from .models import *
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework import status


# get all teams of authenticated user
class TeamList(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TeamSerializer

    def get_queryset(self):
        user = self.request.user
        return user.teams.all()


# create a team with post request as {
#     name: name,
#     users: [id1, id2, ...]
# }
class TeamCreate(CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TeamCreateSerializer

    def perform_create(self, serializer):
        return serializer.save()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = self.perform_create(serializer)
        new_serializer = TeamListSerializer(instance=instance)
        headers = self.get_success_headers(new_serializer.data)
        return Response(new_serializer.data, status=status.HTTP_201_CREATED, headers=headers)


# create category but make sure that the authenticated user is
# a part of the team for which he is creating a categroy
# create a category with post requst as {
#     "name": "category 1 in team 1",
#     "team": 4
# }
class CategoryCreate(CreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        user = self.request.user
        user_teams = user.teams.all()
        team = serializer.validated_data['team']

        if team not in user_teams:
            raise PermissionDenied("You are not a part of the team")

        serializer.save()


# creator should be part of Team
# category should be part of Team
# create a task with post request as {
#     task_name: name,
#     team: id of Team,
#     category: id of category,
#     description: any,
# }
class TaskCreate(CreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = (IsAuthenticated,)

    def perform_create(self, serializer):
        user = self.request.user
        team = serializer.validated_data['team']
        category = serializer.validated_data['category']

        if not ((team.team_categories.filter(id=category.id).exists()) and (user.teams.filter(id=team.id).exists())):
            raise PermissionDenied(
                "User or Category is not a part of the Team")

        serializer.save(creator=user)


# i want data as {
#     teams:
#         [
#             {
#                 name: team1,
#                 categorires: [
#                     {
#                         name: category#
#                         tasks: [
#                             {
#                                 name: task#
#                             }
#                         ]
#                     }
#                 ]
#             }
#         ]
# }
class ListEverything(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = TeamListSerializer

    def get_queryset(self):
        user = self.request.user

        return user.teams.all()


# change category of the task
# expects data as post request with / <id > {
#     category: id of Category,
#     team: id of team,
# }
class ChangeCategory(APIView):
    permission_classes = (IsAuthenticated, )

    def post(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        user = request.user

        serializer = ChangeCategorySerializer(data=request.data)
        if serializer.is_valid():
            try:
                category = Category.objects.get(
                    id=serializer.validated_data['category'])
                team = Team.objects.get(id=serializer.validated_data['team'])

                if not ((team.team_categories.filter(id=category.id).exists()) and (user.teams.filter(id=team.id).exists())):
                    raise PermissionDenied(
                        "User or Category is not a part of the Team")

                task.category = category
                task.save()
                return Response("category changed")
            except:
                raise NotFound("Category or Team not found")
        else:
            return Response(serializer.errors)


# further enhancement the user who wants to delete the
# task should be the owner of the task or the admin
class TaskDeleteView(APIView):
    permission_classes = (IsAuthenticated, )

    def get(self, request, pk):
        task = get_object_or_404(Task, pk=pk)
        user = request.user

        if user == task.creator or user.is_superuser:
            task.delete()
            return Response("Delete successful")

        raise PermissionDenied('You are not the owner of the task')
