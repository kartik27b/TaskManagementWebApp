# Generated by Django 3.1.3 on 2020-12-22 16:32

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('chat', '0004_message'),
    ]

    operations = [
        migrations.AddField(
            model_name='thread',
            name='users',
            field=models.ManyToManyField(related_name='my_threads', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterUniqueTogether(
            name='thread',
            unique_together=set(),
        ),
        migrations.RemoveField(
            model_name='thread',
            name='me',
        ),
        migrations.RemoveField(
            model_name='thread',
            name='to',
        ),
    ]
