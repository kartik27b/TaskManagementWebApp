from django.db import models
from django.contrib.auth.models import User


def profile_path(instance, filename):
    return "profile/{}/{}".format(instance.user.id, filename)


class Profile(models.Model):
    user = models.OneToOneField(
        User, related_name='profile', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    image = models.ImageField(upload_to=profile_path)
    designation = models.CharField(max_length=200)

    def __str__(self):
        return "Profile of id: {}".format(self.user.id)
