import json
from channels.generic.websocket import AsyncWebsocketConsumer  # type: ignore
from channels.db import database_sync_to_async  # type: ignore
from django.contrib.auth.models import User

# ill send data with a property of command
# learn authentication
# learn database connectivity


class ChatConsumer(AsyncWebsocketConsumer):

    async def fetch_messages(self, data):
        pass

    async def new_message(self, data):
        # Send message to room group
        print("Got message"+data['message'])
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': data['message']
            }
        )

    commands = {
        'fetch_messages': fetch_messages,
        'new_message': new_message,
    }

    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(data)

        await self.commands[data['command']](self, data)

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'command': 'new_message'
        }))
