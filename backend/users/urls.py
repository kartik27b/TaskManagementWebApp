
from django.urls import path
from .views import UserListAndCreate, CustomAuthToken, GetUser
from rest_framework.authtoken import views

urlpatterns = [
    path('signup/', UserListAndCreate.as_view()),
    path('login/', CustomAuthToken.as_view()),
    path('user/', GetUser.as_view())

]
