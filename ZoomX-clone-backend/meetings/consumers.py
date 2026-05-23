import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import Meeting, Participant, ChatMessage

class MeetingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.meeting_id = self.scope['url_route']['kwargs']['meeting_id']
        self.room_group_name = f'meeting_{self.meeting_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

        # Send this client their own channel name (used as WebRTC peer ID)
        await self.send(text_data=json.dumps({
            'type': 'connected',
            'channel_name': self.channel_name
        }))

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)
        action = data.get('action')

        if action == 'announce':
            # Broadcast to all peers that this channel is available with this display_name
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'peer_announced',
                    'display_name': data.get('display_name'),
                    'channel_name': self.channel_name
                }
            )

        elif action == 'webrtc':
            # Unicast WebRTC signaling to a specific peer channel
            target_channel = data.get('target')
            if target_channel:
                await self.channel_layer.send(target_channel, {
                    'type': 'webrtc_unicast',
                    'signal_type': data.get('signal_type'),
                    'payload': data.get('payload'),
                    'sender_channel': self.channel_name,
                    'sender_name': data.get('sender_name', '')
                })

        elif action == 'chat':
            sender_name = data.get('sender_name')
            message = data.get('message')
            
            # Save to DB asynchronously
            await self.save_chat_message(self.meeting_id, sender_name, message)

            # Broadcast to group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'sender_name': sender_name,
                    'message': message
                }
            )
            
        elif action == 'reaction':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'reaction_event',
                    'participant_id': data.get('participant_id'),
                    'emoji': data.get('emoji')
                }
            )

        elif action == 'screen_share':
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'screen_share_event',
                    'display_name': data.get('display_name'),
                    'is_sharing': data.get('is_sharing')
                }
            )

    # --- Group message handlers ---

    async def peer_announced(self, event):
        """Broadcast peer announcement (display_name <-> channel_name mapping)"""
        await self.send(text_data=json.dumps({
            'type': 'peer_announced',
            'display_name': event['display_name'],
            'channel_name': event['channel_name']
        }))

    async def webrtc_unicast(self, event):
        """Deliver unicast WebRTC signal to the target client"""
        await self.send(text_data=json.dumps({
            'type': 'webrtc',
            'signal_type': event['signal_type'],
            'payload': event['payload'],
            'sender_channel': event['sender_channel'],
            'sender_name': event['sender_name']
        }))

    async def chat_message(self, event):
        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'chat',
            'sender_name': event['sender_name'],
            'message': event['message']
        }))

    async def reaction_event(self, event):
        await self.send(text_data=json.dumps({
            'type': 'reaction',
            'participant_id': event['participant_id'],
            'emoji': event['emoji']
        }))

    async def screen_share_event(self, event):
        await self.send(text_data=json.dumps({
            'type': 'screen_share',
            'display_name': event['display_name'],
            'is_sharing': event['is_sharing']
        }))

    async def meeting_state_update(self, event):
        await self.send(text_data=json.dumps({
            'type': 'state_update',
            'event': event['event'],
            'data': event['data']
        }))

    @sync_to_async
    def save_chat_message(self, meeting_id, sender_name, message):
        try:
            meeting = Meeting.objects.get(meeting_id=meeting_id)
            ChatMessage.objects.create(
                meeting=meeting,
                sender_name=sender_name,
                message=message
            )
        except Meeting.DoesNotExist:
            pass
