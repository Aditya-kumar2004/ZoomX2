from django.urls import path
from . import views

# URL patterns for the meetings API
urlpatterns = [
    # GET /api/meetings/ - list all meetings
    path('', views.get_all_meetings, name='get_all_meetings'),
    
    # GET /api/meetings/upcoming/ - list upcoming scheduled meetings
    path('upcoming/', views.get_upcoming_meetings, name='get_upcoming_meetings'),
    
    # GET /api/meetings/recent/ - list recent ended meetings
    path('recent/', views.get_recent_meetings, name='get_recent_meetings'),
    
    # POST /api/meetings/create/ - create an instant meeting
    path('create/', views.create_instant_meeting, name='create_instant_meeting'),
    
    # POST /api/meetings/schedule/ - schedule a new meeting
    path('schedule/', views.schedule_meeting, name='schedule_meeting'),
    
    # GET /api/meetings/<meeting_id>/ - get detailed meeting info
    path('<str:meeting_id>/', views.get_meeting_detail, name='get_meeting_detail'),
    
    # GET /api/meetings/<meeting_id>/validate/ - check if meeting is joinable
    path('<str:meeting_id>/validate/', views.validate_meeting, name='validate_meeting'),
    
    # POST /api/meetings/<meeting_id>/join/ - join a meeting as participant
    path('<str:meeting_id>/join/', views.join_meeting, name='join_meeting'),
    
    # PATCH /api/meetings/<meeting_id>/end/ - end an active meeting
    path('<str:meeting_id>/end/', views.end_meeting, name='end_meeting'),
    
    # --- NEW FULL FLEDGED FEATURES ---
    
    # GET & POST /api/meetings/<meeting_id>/chat/ - chat messages
    path('<str:meeting_id>/chat/', views.chat_messages, name='chat_messages'),
    
    # PATCH /api/meetings/<meeting_id>/chat/toggle/
    path('<str:meeting_id>/chat/toggle/', views.toggle_chat, name='toggle_chat'),

    # PATCH /api/meetings/<meeting_id>/participants/<participant_id>/mute/
    path('<str:meeting_id>/participants/<int:participant_id>/mute/', views.mute_participant, name='mute_participant'),
    
    # PATCH /api/meetings/<meeting_id>/participants/<participant_id>/admit/
    path('<str:meeting_id>/participants/<int:participant_id>/admit/', views.admit_participant, name='admit_participant'),
    
    # PATCH /api/meetings/<meeting_id>/participants/<participant_id>/decline/
    path('<str:meeting_id>/participants/<int:participant_id>/decline/', views.decline_participant, name='decline_participant'),
    
    # DELETE /api/meetings/<meeting_id>/participants/<participant_id>/remove/
    path('<str:meeting_id>/participants/<int:participant_id>/remove/', views.remove_participant, name='remove_participant'),
]
