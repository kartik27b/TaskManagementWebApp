from django.http.request import HttpRequest
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .serializers import SingleChatThreadSerializer


# {{url}}/chat/threads?size=1&&page=1 it paginates messages not threads
class GetChatThreadsListView(ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = SingleChatThreadSerializer

    def get_queryset(self):
        user = self.request.user
        return user.my_threads.all()  # type: ignore


def index(request: HttpRequest):
    return render(request, 'chat/index.html')


def room(request, room_name):
    return render(request, 'chat/room.html', {
        'room_name': room_name
    })
