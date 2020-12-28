import json
from channels.generic.websocket import AsyncWebsocketConsumer  # type: ignore
from channels.db import database_sync_to_async  # type: ignore
from django.contrib.auth.models import User
from django.contrib.auth.models import AnonymousUser
from .models import Message, SingleChatThread

from .serializers import MessageSerializer

# ill send data with a property of command
# learn authentication
# learn database connectivity


def get_room_group(id: str) -> str:
    return f'chat_{id}'


class ChatConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def create_message(self, thread_id, author, content):
        thread = SingleChatThread.objects.get(id=thread_id)
        message = Message.objects.create(
            thread=thread, author=author, content=content)
        return message

    @database_sync_to_async
    def get_chat_groups(self):
        threads = self.user.my_threads.all()
        chat_groups = [get_room_group(str(thread.id)) for thread in threads]

        return chat_groups

    async def fetch_messages(self, data):
        pass

    async def new_message(self, data):
        # Send message to room group
        message = await self.create_message(thread_id=data['thread_id'], author=self.user, content=data['message'])
        serializer = MessageSerializer(message)

        message_data = serializer.data
        message_data['type'] = 'chat_message'
        await self.channel_layer.group_send(
            get_room_group(str(data['thread_id'])),
            message_data
        )

        # await self.channel_layer.group_send(
        #     self.room_group_name,
        #     {
        #         'type': 'chat_message',
        #         'message': data['message']
        #     }
        # )

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
    }

    async def connect(self):
        self.user = self.scope["user"]

        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_groups = await self.get_chat_groups()

        # Join room group
        # await self.channel_layer.group_add(
        #     self.room_group_name,
        #     self.channel_name
        # )
        # print(self.room_groups)
        for group in self.room_groups:
            await self.channel_layer.group_add(
                group,
                self.channel_name,
            )
        print(self.room_groups)

        await self.accept()

    async def disconnect(self, close_code):
        for group in self.room_groups:
            await self.channel_layer.group_discard(
                group,
                self.channel_name,
            )
        # await self.channel_layer.group_discard(
        #     self.room_group_name,
        #     self.channel_name
        # )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)

        await self.commands[data['command']](self, data)

    # Receive message from room group
    async def chat_message(self, event):
        message_data = event
        message_data['command'] = 'new_message'
        await self.send(text_data=json.dumps(message_data))
