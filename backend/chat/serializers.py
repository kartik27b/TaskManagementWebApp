from typing import List
from rest_framework import serializers
from .models import SingleChatThread, Message
from users.serializers import UserWithProfileSerializer  # type:ignore
from django.core.paginator import Page, Paginator, EmptyPage, PageNotAnInteger


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ('id', 'thread', 'author', 'content')


# {{url}}/chat/threads?size=1&&page=1 it paginates messages not threads
class SingleChatThreadSerializer(serializers.ModelSerializer):
    messages = serializers.SerializerMethodField()
    users = UserWithProfileSerializer(many=True, read_only=True)

    class Meta:
        model = SingleChatThread
        fields = ('id', 'users', 'messages')

    def get_messages(self, obj):
        objects: List[Message] = obj.messages.all()
        serializer = MessageSerializer(objects, many=True, read_only=True)

        page_size = self.context['request'].query_params.get('size') or 10
        paginator = Paginator(objects, page_size)
        page = self.context['request'].query_params.get('page') or 1

        try:
            paginated_messages = paginator.page(page)
        except PageNotAnInteger:
            paginated_messages = paginator.page(1)
        except EmptyPage:
            paginated_messages = paginator.page(paginator.num_pages)

        serializer = MessageSerializer(
            paginated_messages, many=True, read_only=True)

        return serializer.data
