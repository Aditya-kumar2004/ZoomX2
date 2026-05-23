<div align="center">
  <img src="C:\Users\hp\.gemini\antigravity\brain\7b89c7e9-7ea7-4026-94e3-f510c6bc8155\zoomx_hero_banner_1779553126496.png" alt="ZoomX Banner" width="100%" />

  <h1>🚀 ZoomX</h1>
  <p><strong>A Modern, High-Performance Video Conferencing Platform</strong></p>
</div>

<br />

## 🌟 Overview
ZoomX is a pixel-perfect, production-ready video conferencing application built to deliver seamless, low-latency communication. It bridges the gap between individuals and teams through high-definition video, crystal-clear audio, real-time messaging, and interactive screen sharing. Built with a robust modern tech stack, ZoomX offers a rich, intuitive, and highly responsive user experience.

---

## ✨ Key Features

- **🎥 Real-Time HD Video & Audio**: Powered by raw WebRTC for ultra-low latency, peer-to-peer communication.
- **💬 Integrated Live Chat**: Instant messaging built alongside the video interface, powered by WebSocket technology.
- **🖥️ Screen Sharing**: Easily present your screen, application windows, or browser tabs to all participants.
- **🎙️ Active Speaker Detection**: Intelligently highlights the participant who is currently speaking using real-time audio level monitoring via Web Audio API.
- **📅 Meeting Scheduling**: Schedule meetings in advance, generate unique meeting IDs, and manage your upcoming calendar.
- **🛡️ Host Controls & Waiting Room**: Secure your meetings with a waiting room, allowing hosts to admit, decline, mute, or remove participants.
- **📱 Fully Responsive UI**: A beautifully crafted, modern dark-mode interface built with Tailwind CSS that adapts perfectly to desktop, tablet, and mobile devices.

---

## 🛠️ Technology Stack

### Frontend Architecture
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, lucide-react (Icons)
- **Communication**: WebRTC API, Web Audio API

### Backend Architecture
- **Framework**: [Django](https://www.djangoproject.com/) & Django REST Framework
- **Real-Time Engine**: Django Channels (WebSockets)
- **Database**: SQLite (optimized for rapid development and testing)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.10 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/ZoomX.git
cd ZoomX
```

### 2. Backend Setup (Django)
```bash
# Navigate to the backend directory
cd ZoomX-clone-backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the Daphne ASGI server
daphne -p 8000 backend.asgi:application
```
*Note: The backend runs on `http://localhost:8000` and the WebSocket endpoint is accessible at `ws://localhost:8000/ws/meeting/<id>/`.*

### 3. Frontend Setup (Next.js)
```bash
# Open a new terminal and navigate to the frontend directory
cd frontend/pixel-perfect-clone

# Install dependencies
npm install

# Start the development server
npm run dev
```
*Note: The frontend runs on `http://localhost:3000`.*

---

## 🏗️ Project Structure
```text
ZoomX2/
├── ZoomX-clone-backend/         # Django backend
│   ├── backend/                 # Core Django project settings & ASGI configuration
│   └── meetings/                # Meetings app (Models, Views, Consumers, Routing)
│
└── frontend/
    └── pixel-perfect-clone/     # Next.js frontend
        ├── src/app/             # Next.js App Router (Pages & Layouts)
        ├── src/components/      # Reusable UI components (Dashboard, Meeting Room, UI kit)
        ├── src/hooks/           # Custom React hooks (WebRTC, Sockets, Speaker Detection)
        └── src/lib/             # API services and shared utilities
```

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📄 License
This project is licensed under the MIT License.
