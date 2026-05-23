# ZoomX Clone — Backend API

## Tech Stack
- Python
- Django 4.2
- Django REST Framework
- SQLite
- django-cors-headers
- python-dotenv

## Setup Instructions (Windows)
1. Clone repo
   ```bash
   git clone <repository_url>
   cd ZoomX-clone-backend
   ```
2. Create venv
   ```bash
   python -m venv venv
   ```
3. Activate venv
   ```bash
   venv\Scripts\activate
   ```
4. Install dependencies
   ```bash
   pip install -r requirements.txt
   ```
5. Create `.env` file with content
   ```env
   SECRET_KEY=your-secret-key-here
   DEBUG=True
   ALLOWED_HOSTS=localhost,127.0.0.1
   FRONTEND_URL=http://localhost:3000
   ```
6. Make migrations
   ```bash
   python manage.py makemigrations
   ```
7. Run migrations
   ```bash
   python manage.py migrate
   ```
8. Seed the database
   ```bash
   python manage.py shell < meetings/seed.py
   ```
9. Create super user (for admin panel)
   ```bash
   python manage.py createsuperuser
   ```
10. Run development server
    ```bash
    python manage.py runserver
    ```

## API Endpoints Table

| Method | URL | Description | Request Body |
|--------|-----|-------------|--------------|
| GET | `/api/meetings/` | List all meetings | N/A |
| GET | `/api/meetings/upcoming/` | List future scheduled meetings | N/A |
| GET | `/api/meetings/recent/` | List past ended meetings (max 10) | N/A |
| POST | `/api/meetings/create/` | Create an instant meeting | `{"host_name": "string"}` (optional) |
| POST | `/api/meetings/schedule/` | Schedule a future meeting | `{"title": "string", "description": "string", "host_name": "string", "scheduled_at": "datetime", "duration_minutes": integer}` |
| GET | `/api/meetings/<meeting_id>/` | Get detailed meeting info | N/A |
| GET | `/api/meetings/<meeting_id>/validate/` | Check if meeting is joinable | N/A |
| POST | `/api/meetings/<meeting_id>/join/` | Join a meeting | `{"display_name": "string"}` |
| PATCH | `/api/meetings/<meeting_id>/end/` | End an active meeting | N/A |

## Database Schema

### Meeting Table
- `meeting_id`: Unique identifier (e.g. 123-456-789)
- `title`: Meeting title
- `description`: Optional description
- `host_name`: Creator's name
- `meeting_type`: 'instant' or 'scheduled'
- `status`: 'waiting', 'active', or 'ended'
- `scheduled_at`: When it starts (for scheduled)
- `duration_minutes`: Expected length
- `invite_link`: Auto-generated join link
- `created_at`: Creation timestamp

### Participant Table
- `meeting`: Foreign key to Meeting table
- `display_name`: Participant's name
- `joined_at`: Join timestamp
- `left_at`: Leave timestamp (null if still joined)

## Assumptions Made
- No authentication is required (assume default user "John Doe" is always logged in)
- Using SQLite for simplicity and ease of setup
- CORS is enabled specifically for localhost:3000 (frontend)

## Deployment to Render
To deploy this Django backend to Render, you will need to:
1. Add `gunicorn` to your `requirements.txt`.
2. Push your code to a GitHub repository.
3. In Render, create a new "Web Service" and connect your repository.
4. Set the Build Command to: `pip install -r requirements.txt && python manage.py migrate`
5. Set the Start Command to: `gunicorn project.wsgi:application`
6. Add the necessary Environment Variables (`SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS=*`, `FRONTEND_URL=<your-vercel-url>`) in the Render dashboard.
