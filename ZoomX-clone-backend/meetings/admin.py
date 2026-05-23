from django.contrib import admin
from .models import Meeting, Participant

@admin.register(Meeting)
class MeetingAdmin(admin.ModelAdmin):
    # Columns to display in list view
    list_display = ('meeting_id', 'title', 'host_name', 'meeting_type', 'status', 'scheduled_at', 'duration_minutes', 'created_at')
    # Filters available in the sidebar
    list_filter = ('meeting_type', 'status')
    # Enable search by these fields
    search_fields = ('title', 'meeting_id', 'host_name')
    # Fields that cannot be edited in admin
    readonly_fields = ('meeting_id', 'invite_link', 'created_at')
    # Default ordering
    ordering = ('-created_at',)

@admin.register(Participant)
class ParticipantAdmin(admin.ModelAdmin):
    # Columns to display in list view
    list_display = ('display_name', 'meeting', 'joined_at', 'left_at')
    # Filters available in the sidebar
    list_filter = ('meeting',)
    # Enable search by participant name
    search_fields = ('display_name',)
