from django.utils import timezone
from datetime import timedelta
from meetings.models import Meeting, Participant

# 1. Clear all existing Meeting and Participant data
# This ensures we start with a clean slate
Meeting.objects.all().delete()
Participant.objects.all().delete()

# Get the current time for calculating future/past dates
now = timezone.now()

# 2. Create UPCOMING meetings (future dates)

# Meeting 1
meeting1 = Meeting.objects.create(
    meeting_id='123-456-789',
    title='Team Standup',
    description='Daily sync to discuss blockers and progress',
    host_name='John Doe',
    meeting_type='scheduled',
    status='waiting',
    scheduled_at=now + timedelta(days=1, hours=2),
    duration_minutes=30
)

# Meeting 2
meeting2 = Meeting.objects.create(
    meeting_id='456-789-012',
    title='Product Review',
    description='Review Q2 product roadmap',
    host_name='John Doe',
    meeting_type='scheduled',
    status='waiting',
    scheduled_at=now + timedelta(days=2, hours=5),
    duration_minutes=60
)

# Meeting 3
meeting3 = Meeting.objects.create(
    meeting_id='789-012-345',
    title='Client Demo',
    description='Live demo for enterprise client',
    host_name='John Doe',
    meeting_type='scheduled',
    status='waiting',
    scheduled_at=now + timedelta(days=4, hours=7),
    duration_minutes=45
)

# 3. Create RECENT meetings (past, ended)

# Meeting 4
meeting4 = Meeting.objects.create(
    meeting_id='321-654-987',
    title='Weekly Sync',
    host_name='John Doe',
    meeting_type='scheduled',
    status='ended',
    scheduled_at=now - timedelta(days=3),
    duration_minutes=45
)
# Add participants for Meeting 4
m4_participants = ['Alice Smith', 'Bob Johnson', 'Carol White', 'David Lee', 'Eva Martinez']
for name in m4_participants:
    Participant.objects.create(
        meeting=meeting4,
        display_name=name,
        joined_at=meeting4.scheduled_at,
        left_at=meeting4.scheduled_at + timedelta(minutes=meeting4.duration_minutes)
    )

# Meeting 5
meeting5 = Meeting.objects.create(
    meeting_id='654-987-321',
    title='Design Review',
    host_name='John Doe',
    meeting_type='scheduled',
    status='ended',
    scheduled_at=now - timedelta(days=4),
    duration_minutes=30
)
# Add participants for Meeting 5
m5_participants = ['Alice Smith', 'Frank Zhang']
for name in m5_participants:
    Participant.objects.create(
        meeting=meeting5,
        display_name=name,
        joined_at=meeting5.scheduled_at,
        left_at=meeting5.scheduled_at + timedelta(minutes=meeting5.duration_minutes)
    )

# Meeting 6
meeting6 = Meeting.objects.create(
    meeting_id='987-321-654',
    title='Sprint Planning',
    host_name='John Doe',
    meeting_type='scheduled',
    status='ended',
    scheduled_at=now - timedelta(days=5),
    duration_minutes=90
)
# Add participants for Meeting 6
m6_participants = ['Bob Johnson', 'Carol White', 'David Lee', 'Frank Zhang', 'Grace Kim', 'Henry Wilson', 'Iris Chen', 'James Park']
for name in m6_participants:
    Participant.objects.create(
        meeting=meeting6,
        display_name=name,
        joined_at=meeting6.scheduled_at,
        left_at=meeting6.scheduled_at + timedelta(minutes=meeting6.duration_minutes)
    )

# Meeting 7
meeting7 = Meeting.objects.create(
    meeting_id='111-222-333',
    title='1:1 with Manager',
    host_name='John Doe',
    meeting_type='scheduled',
    status='ended',
    scheduled_at=now - timedelta(days=6),
    duration_minutes=25
)
# Add participants for Meeting 7
m7_participants = ['Manager Mike']
for name in m7_participants:
    Participant.objects.create(
        meeting=meeting7,
        display_name=name,
        joined_at=meeting7.scheduled_at,
        left_at=meeting7.scheduled_at + timedelta(minutes=meeting7.duration_minutes)
    )
# Add host as well since user request specified "2 people including host"
Participant.objects.create(
    meeting=meeting7,
    display_name='John Doe',
    joined_at=meeting7.scheduled_at,
    left_at=meeting7.scheduled_at + timedelta(minutes=meeting7.duration_minutes)
)

# 5. Print success message with counts
print("✅ Seed complete!")
print(f"Meetings: {Meeting.objects.count()}")
print(f"Participants: {Participant.objects.count()}")
