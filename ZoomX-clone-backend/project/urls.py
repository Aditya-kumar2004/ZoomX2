from django.contrib import admin
from django.urls import path, include

# URL configuration for the entire project
urlpatterns = [
    # Route for the Django admin panel
    path('admin/', admin.site.urls),
    
    # Route all /api/meetings/... to the meetings app urls
    path('api/meetings/', include('meetings.urls')),
]
