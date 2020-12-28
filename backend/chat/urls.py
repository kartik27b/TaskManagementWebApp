# chat/urls.py
from django.urls import path

from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('threads/', views.GetChatThreadsListView.as_view()),
    # path('<str:room_name>/', views.room, name='room'),

]
