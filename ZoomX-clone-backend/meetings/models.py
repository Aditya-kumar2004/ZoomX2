from django.db import models
import random

# Helper function to generate meeting IDs like XXX-XXX-XXX
def generate_meeting_id():
    # Loop to ensure unique ID is generated
    while True:
        # Generate three groups of 3 digits
        part1 = str(random.randint(100, 999))
        part2 = str(random.randint(100, 999))
        part3 = str(random.randint(100, 999))
        # Format the ID
        meeting_id = f"{part1}-{part2}-{part3}"
        # Only return if it doesn't exist already
        if not Meeting.objects.filter(meeting_id=meeting_id).exists():
            return meeting_id

class Meeting(models.Model):
    # Choices for meeting type
    INSTANT = 'instant'
    SCHEDULED = 'scheduled'
    MEETING_TYPE_CHOICES = [
        (INSTANT, 'Instant'),
        (SCHEDULED, 'Scheduled'),
    ]

    # Choices for meeting status
    WAITING = 'waiting'
    ACTIVE = 'active'
    ENDED = 'ended'
    STATUS_CHOICES = [
        (WAITING, 'Waiting'),
        (ACTIVE, 'Active'),
        (ENDED, 'Ended'),
    ]

    # Unique 11-character string for identifying a meeting
    meeting_id = models.CharField(max_length=15, unique=True, default=generate_meeting_id)
    # The title of the meeting, defaults to 'My Meeting'
    title = models.CharField(max_length=255, default='My Meeting')
    # Optional description of the meeting
    description = models.TextField(blank=True, null=True)
    # The name of the person hosting the meeting, defaults to John Doe
    host_name = models.CharField(max_length=100, default='John Doe')
    # The type of meeting, either instant or scheduled (indexed for quick dashboard listing queries)
    meeting_type = models.CharField(max_length=20, choices=MEETING_TYPE_CHOICES, default=INSTANT, db_index=True)
    # Current status of the meeting (indexed for dashboard filtering)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=WAITING, db_index=True)
    # When the meeting is scheduled to happen (null for instant meetings, indexed for chronological queries)
    scheduled_at = models.DateTimeField(blank=True, null=True, db_index=True)
    # Duration in minutes, defaults to 60
    duration_minutes = models.IntegerField(default=60)
    # Timestamp of when this record was created
    created_at = models.DateTimeField(auto_now_add=True)
    # Timestamp of when this record was last modified (SaaS auditing standard)
    updated_at = models.DateTimeField(auto_now=True)
    # Chat permission
    chat_enabled = models.BooleanField(default=True)

    @property
    def invite_link(self):
        # Dynamic link generation utilizing Django settings.
        # This keeps the database normalized and prevents local domain values from hardcoding.
        from django.conf import settings
        frontend_url = getattr(settings, 'FRONTEND_URL', 'http://localhost:3000').rstrip('/')
        return f"{frontend_url}/meeting/{self.meeting_id}"

    def __str__(self):
        # String representation of the meeting
        return f"{self.title} ({self.meeting_id})"

    class Meta:
        # Order by newest first
        ordering = ['-created_at']

class Participant(models.Model):
    # The meeting this participant joined. Cascade delete means if meeting is deleted, so is participant
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='participants')
    # Name shown in the meeting
    display_name = models.CharField(max_length=100)
    # When the participant joined
    joined_at = models.DateTimeField(auto_now_add=True)
    # When the participant left (null if still in meeting, indexed for filtering active participants)
    left_at = models.DateTimeField(blank=True, null=True, db_index=True)
    # Whether the participant is muted by the host
    is_muted = models.BooleanField(default=False)
    
    WAITING = 'waiting'
    ADMITTED = 'admitted'
    DECLINED = 'declined'
    STATUS_CHOICES = [
        (WAITING, 'Waiting'),
        (ADMITTED, 'Admitted'),
        (DECLINED, 'Declined'),
    ]
    # Current state of participant in waiting lobby (indexed for lobby admission checks)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=WAITING, db_index=True)

    def __str__(self):
        # String representation of a participant
        return f"{self.display_name} in {self.meeting.title}"

    class Meta:
        # Order by when they joined
        ordering = ['joined_at']
        # Conditional unique constraint ensuring a participant display name can only be actively in a meeting once.
        # Enforces integrity without blocking users from leaving and joining under the same name again later.
        constraints = [
            models.UniqueConstraint(
                fields=['meeting', 'display_name'],
                condition=models.Q(left_at__isnull=True),
                name='unique_active_participant'
            )
        ]

class ChatMessage(models.Model):
    # The meeting this message belongs to
    meeting = models.ForeignKey(Meeting, on_delete=models.CASCADE, related_name='messages')
    # Name of the person who sent it
    sender_name = models.CharField(max_length=100)
    # The actual text content
    message = models.TextField()
    # When it was sent (indexed for chronological sorting optimization)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    def __str__(self):
        return f"{self.sender_name}: {self.message[:20]}"

    class Meta:
        # Oldest first so chat displays top to bottom
        ordering = ['timestamp']
