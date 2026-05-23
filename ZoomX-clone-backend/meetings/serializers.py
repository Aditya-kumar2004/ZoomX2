from rest_framework import serializers
from .models import Meeting, Participant, ChatMessage

class ParticipantSerializer(serializers.ModelSerializer):
    # Serializes the Participant model
    class Meta:
        model = Participant
        # Only expose necessary fields
        fields = ['id', 'display_name', 'joined_at', 'left_at', 'is_muted', 'status']

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['id', 'sender_name', 'message', 'timestamp']

class MeetingSerializer(serializers.ModelSerializer):
    # Calculates the number of participants using a custom method
    participant_count = serializers.SerializerMethodField()
    # Nests the participant data inside the meeting data (read-only)
    participants = ParticipantSerializer(many=True, read_only=True)

    class Meta:
        model = Meeting
        # Define all fields to be serialized
        fields = [
            'id', 'meeting_id', 'title', 'description', 'host_name',
            'meeting_type', 'status', 'scheduled_at', 'duration_minutes',
            'invite_link', 'created_at', 'updated_at', 'participant_count', 'participants', 'chat_enabled'
        ]
        # These fields cannot be modified via API requests
        read_only_fields = ['meeting_id', 'invite_link', 'created_at', 'updated_at']

    def get_participant_count(self, obj):
        # Return the count of related participants
        return obj.participants.count()

class CreateInstantMeetingSerializer(serializers.Serializer):
    # Regular serializer for validating instant meeting creation
    # host_name is optional, defaults to 'John Doe'
    host_name = serializers.CharField(max_length=100, required=False, default='John Doe')
    duration_minutes = serializers.IntegerField(min_value=15, max_value=480, required=False, default=60)
    meeting_id = serializers.CharField(max_length=15, required=False)

class ScheduleMeetingSerializer(serializers.Serializer):
    # Regular serializer for validating scheduled meeting creation
    # title is required
    title = serializers.CharField(max_length=255)
    # description is optional
    description = serializers.CharField(required=False, allow_blank=True)
    # host_name defaults to 'John Doe'
    host_name = serializers.CharField(max_length=100, default='John Doe')
    # must provide a scheduled date and time
    scheduled_at = serializers.DateTimeField()
    # duration must be between 15 and 480 minutes
    duration_minutes = serializers.IntegerField(min_value=15, max_value=480)

    def validate_scheduled_at(self, value):
        from django.utils import timezone
        from datetime import timedelta
        # Add a 60-second grace period for clock drift and network latency
        if value < timezone.now() - timedelta(seconds=60):
            raise serializers.ValidationError("Cannot schedule a meeting in the past.")
        return value

class JoinMeetingSerializer(serializers.Serializer):
    # Regular serializer for validating joining a meeting
    # Requires a display name
    display_name = serializers.CharField(max_length=100)

class SendMessageSerializer(serializers.Serializer):
    # Regular serializer for validating sending a message
    sender_name = serializers.CharField(max_length=100)
    message = serializers.CharField()
