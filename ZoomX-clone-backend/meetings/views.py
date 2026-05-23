from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Meeting, Participant, ChatMessage
from .serializers import (
    MeetingSerializer, CreateInstantMeetingSerializer, 
    ScheduleMeetingSerializer, JoinMeetingSerializer,
    ChatMessageSerializer, SendMessageSerializer
)
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def broadcast_meeting_event(meeting_id, event_type, data=None):
    channel_layer = get_channel_layer()
    if data is None:
        data = {}
    async_to_sync(channel_layer.group_send)(
        f'meeting_{meeting_id}',
        {
            'type': 'meeting_state_update',
            'event': event_type,
            'data': data
        }
    )

@api_view(['GET'])
def get_all_meetings(request):
    # Retrieve all meetings, ordered by creation date descending (default in model)
    meetings = Meeting.objects.all()
    # Serialize data (many=True since there are multiple objects)
    serializer = MeetingSerializer(meetings, many=True)
    # Return 200 OK with data
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_upcoming_meetings(request):
    # Get current time
    now = timezone.now()
    from datetime import timedelta
    # Filter for scheduled meetings that haven't ended and are either:
    # 1. Scheduled in the future (scheduled_at >= now)
    # 2. Or scheduled in the past but within a 12-hour buffer (so active/waiting meetings don't vanish)
    meetings = Meeting.objects.filter(
        meeting_type='scheduled', 
        status__in=['waiting', 'active'],
        scheduled_at__gte=now - timedelta(hours=12)
    ).order_by('scheduled_at') # Order by soonest first
    
    # Serialize the filtered queryset
    serializer = MeetingSerializer(meetings, many=True)
    # Return response
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['GET'])
def get_recent_meetings(request):
    # Filter for ended meetings, order by newest first, limit to 10
    meetings = Meeting.objects.filter(status='ended').order_by('-created_at')[:10]
    # Serialize data
    serializer = MeetingSerializer(meetings, many=True)
    # Return response
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def create_instant_meeting(request):
    # Validate request payload
    serializer = CreateInstantMeetingSerializer(data=request.data)
    # If invalid, return 400 Bad Request
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    meeting_id = serializer.validated_data.get('meeting_id')
    duration = serializer.validated_data.get('duration_minutes', 60)
    host_name = serializer.validated_data['host_name']
    
    if meeting_id:
        try:
            meeting = Meeting.objects.get(meeting_id=meeting_id)
            meeting.status = 'active'
            meeting.duration_minutes = duration
            meeting.save()
        except Meeting.DoesNotExist:
            meeting = Meeting.objects.create(
                meeting_id=meeting_id,
                title=f"{host_name}'s Personal Meeting",
                host_name=host_name,
                duration_minutes=duration,
                meeting_type='instant',
                status='active'
            )
    else:
        meeting = Meeting.objects.create(
            title=f"{host_name}'s Instant Meeting",
            host_name=host_name,
            duration_minutes=duration,
            meeting_type='instant',
            status='active'
        )

    # Auto join host
    Participant.objects.create(meeting=meeting, display_name=meeting.host_name, status='admitted')
    
    # Serialize the created object
    response_serializer = MeetingSerializer(meeting)
    # Return created data with 201 Created status
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def schedule_meeting(request):
    # Validate request payload
    serializer = ScheduleMeetingSerializer(data=request.data)
    # Return 400 if validation fails
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Create the scheduled meeting in database
    meeting = Meeting.objects.create(
        title=serializer.validated_data['title'],
        description=serializer.validated_data.get('description', ''),
        host_name=serializer.validated_data.get('host_name', 'John Doe'),
        scheduled_at=serializer.validated_data['scheduled_at'],
        duration_minutes=serializer.validated_data['duration_minutes'],
        meeting_type='scheduled',
        status='waiting'
    )
    # Serialize created meeting
    response_serializer = MeetingSerializer(meeting)
    # Return response with 201
    return Response(response_serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def get_meeting_detail(request, meeting_id):
    # Try to find the meeting
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
    except Meeting.DoesNotExist:
        # Return 404 if not found
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Serialize and return the single meeting
    serializer = MeetingSerializer(meeting)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def join_meeting(request, meeting_id):
    # Get meeting or return 404
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Prevent joining if ended
    if meeting.status == 'ended':
        return Response({'error': 'Meeting has ended'}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate request body for display_name
    serializer = JoinMeetingSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Create participant record if they don't already exist
    display_name = serializer.validated_data['display_name']
    is_host = display_name == meeting.host_name
    participant_status = 'admitted' if is_host else 'waiting'
    
    participant, created = Participant.objects.get_or_create(
        meeting=meeting,
        display_name=display_name,
        left_at__isnull=True, # only get active ones
        defaults={'status': participant_status}
    )
    
    # If meeting hasn't started yet, set it to active
    if meeting.status == 'waiting':
        meeting.status = 'active'
        meeting.save()
        
    # Serialize updated meeting
    meeting_serializer = MeetingSerializer(meeting)
    
    # Broadcast join event
    broadcast_meeting_event(meeting.meeting_id, 'participant_joined', meeting_serializer.data)
    
    # Return success message and data
    return Response({
        'message': 'Joined successfully',
        'participant_id': participant.id,
        'meeting': meeting_serializer.data
    }, status=status.HTTP_200_OK)

@api_view(['PATCH'])
def end_meeting(request, meeting_id):
    # Try getting the meeting
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)
    
    # Change status to ended and save
    meeting.status = 'ended'
    meeting.save()
    
    # Update all active participants to record when they left
    now = timezone.now()
    Participant.objects.filter(meeting=meeting, left_at__isnull=True).update(left_at=now)
    
    # Broadcast end event
    broadcast_meeting_event(meeting.meeting_id, 'meeting_ended')
    
    # Return success response
    return Response({'message': 'Meeting ended successfully'}, status=status.HTTP_200_OK)

@api_view(['GET'])
def validate_meeting(request, meeting_id):
    # Try fetching the meeting
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
    except Meeting.DoesNotExist:
        # If missing, return valid=False
        return Response({'valid': False, 'error': 'not found'}, status=status.HTTP_200_OK)
    
    # If it has already ended, return valid=False
    if meeting.status == 'ended':
        return Response({'valid': False, 'error': 'ended'}, status=status.HTTP_200_OK)
        
    # Otherwise return valid=True and basic details
    return Response({
        'valid': True,
        'meeting_id': meeting.meeting_id,
        'title': meeting.title,
        'host_name': meeting.host_name,
        'status': meeting.status
    }, status=status.HTTP_200_OK)

# --- NEW FULL FLEDGED FEATURES ---

@api_view(['GET', 'POST'])
def chat_messages(request, meeting_id):
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        messages = meeting.messages.all()
        serializer = ChatMessageSerializer(messages, many=True)
        return Response(serializer.data)
        
    elif request.method == 'POST':
        serializer = SendMessageSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        # In a real app we'd verify the sender is in the meeting
        # For now just save it
        try:
            meeting = Meeting.objects.get(meeting_id=meeting_id)
            if not meeting.chat_enabled and serializer.validated_data['sender_name'] != meeting.host_name:
                return Response({'error': 'Chat is disabled'}, status=status.HTTP_403_FORBIDDEN)
                
            message = ChatMessage.objects.create(
                meeting=meeting,
                sender_name=serializer.validated_data['sender_name'],
                message=serializer.validated_data['message']
            )
            serializer = ChatMessageSerializer(message)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except Meeting.DoesNotExist:
            return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def admit_participant(request, meeting_id, participant_id):
    try:
        participant = Participant.objects.get(id=participant_id, meeting__meeting_id=meeting_id)
        participant.status = 'admitted'
        participant.save()
        broadcast_meeting_event(meeting_id, 'participant_admitted', {'participant_id': participant.id})
        return Response({'message': 'Admitted'})
    except Participant.DoesNotExist:
        return Response({'error': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def decline_participant(request, meeting_id, participant_id):
    try:
        participant = Participant.objects.get(id=participant_id, meeting__meeting_id=meeting_id)
        participant.status = 'declined'
        participant.left_at = timezone.now()
        participant.save()
        broadcast_meeting_event(meeting_id, 'participant_declined', {'participant_id': participant.id})
        return Response({'message': 'Declined'})
    except Participant.DoesNotExist:
        return Response({'error': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def toggle_chat(request, meeting_id):
    try:
        meeting = Meeting.objects.get(meeting_id=meeting_id)
        meeting.chat_enabled = not meeting.chat_enabled
        meeting.save()
        broadcast_meeting_event(meeting_id, 'chat_toggled', {'chat_enabled': meeting.chat_enabled})
        return Response({'message': 'Chat toggled', 'chat_enabled': meeting.chat_enabled})
    except Meeting.DoesNotExist:
        return Response({'error': 'Meeting not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def mute_participant(request, meeting_id, participant_id):
    try:
        participant = Participant.objects.get(id=participant_id, meeting__meeting_id=meeting_id)
        # toggle mute
        participant.is_muted = not participant.is_muted
        participant.save()
        
        # Broadcast mute toggle
        broadcast_meeting_event(meeting_id, 'participant_muted', {
            'participant_id': participant.id,
            'is_muted': participant.is_muted
        })
        
        return Response({'message': 'Mute status toggled', 'is_muted': participant.is_muted})
    except Participant.DoesNotExist:
        return Response({'error': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
def remove_participant(request, meeting_id, participant_id):
    try:
        participant = Participant.objects.get(id=participant_id, meeting__meeting_id=meeting_id)
        participant.left_at = timezone.now()
        participant.save()
        
        # Broadcast leave event
        broadcast_meeting_event(meeting_id, 'participant_left', {
            'participant_id': participant.id
        })
        
        return Response({'message': 'Participant removed successfully'})
    except Participant.DoesNotExist:
        return Response({'error': 'Participant not found'}, status=status.HTTP_404_NOT_FOUND)
