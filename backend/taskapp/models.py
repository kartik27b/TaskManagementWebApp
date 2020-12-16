from django.db.models import Model
from django.db import models
from django.contrib.auth.models import User


class Team(Model):
    users = models.ManyToManyField(User, related_name='teams')
    name = models.CharField(max_length=200, null=False,
                            blank=False, unique=True)

    def __str__(self):
        return "Team: {}, id: {}".format(self.name, self.id)


class Category(Model):
    team = models.ForeignKey(
        Team, related_name='team_categories', on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return "{}, id: {}".format(self.name, self.id)


class Task(Model):
    team = models.ForeignKey(
        Team, related_name='team_tasks', on_delete=models.CASCADE)
    creator = models.ForeignKey(
        User, related_name='user_tasks', on_delete=models.CASCADE)
    category = models.ForeignKey(
        Category, related_name='category_tasks', on_delete=models.CASCADE)
    task_name = models.CharField(max_length=200, null=False, blank=False)
    description = models.CharField(max_length=200, null=False, blank=False)

    def __str__(self):
        return self.task_name
