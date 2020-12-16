from django.urls import path
from .views import(TeamList, TeamCreate,
                   CategoryCreate, ChangeCategory,
                   TaskCreate, ListEverything,
                   TaskDeleteView)

urlpatterns = [
    path('teams/', TeamList.as_view()),
    path('createteam/', TeamCreate.as_view()),
    path('createcategory/', CategoryCreate.as_view()),
    path('createtask/', TaskCreate.as_view()),
    path('listall/', ListEverything.as_view()),
    path('changecategory/<int:pk>/', ChangeCategory.as_view()),
    path('deletetask/<int:pk>/', TaskDeleteView.as_view())
]
