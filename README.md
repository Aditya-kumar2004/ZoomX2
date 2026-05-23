<div align="center">
  <img src="./assets/zoomx_banner.png" alt="ZoomX Premium Banner" width="100%" style="border-radius: 20px; box-shadow: 0 8px 30px rgba(0,0,0,0.3);" />

  <br />
  <br />

  <h1>⚡ ZoomX (Zoom Clone)</h1>
  <p><strong>A Premium, High-Performance, Pixel-Perfect Full-Stack Video Conferencing Platform</strong></p>

  <p>
    <img src="https://img.shields.io/badge/Next.js-15.5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js Badge" />
    <img src="https://img.shields.io/badge/Django-5.1-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django Badge" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript Badge" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS Badge" />
    <img src="https://img.shields.io/badge/WebRTC-Enabled-FF6F61?style=for-the-badge&logo=webrtc&logoColor=white" alt="WebRTC Badge" />
  </p>
</div>

<br />

## 🚀 Overview
**ZoomX** is a production-grade, highly responsive, full-featured clone of the Zoom application. It provides an ultra-low latency, professional environment for virtual collaboration. Leveraging a robust architecture combining **Next.js (App Router)** on the frontend and **Django Channels (WebSockets)** on the backend, ZoomX delivers raw peer-to-peer WebRTC video feeds, live chat, interactive screen sharing, host control rooms, and scheduled calendars within a premium SaaS layout.

---

## ✨ Key Features

- 🎥 **HD Video & Audio Channels**: Seamless, raw, low-latency audio/video feeds powered by WebRTC.
- 🎙️ **Dominant Speaker Detection**: Real-time active speaker election using the Web Audio API to analyze mic input and visually spotlight speakers.
- 🖥️ **Theater Screen Share**: Present slides or browser windows to all participants instantly with interactive focus options.
- 🛡️ **Host Control Center**: Complete meeting authority including wait lobbies, admitting/declining entrants, toggling group chat, muting, or removing participants.
- 📅 **Meeting Scheduler**: Set up scheduled meetings with custom durations, generate unique IDs, and view them in a live calendar lobby.
- 💬 **Live Meeting Chat**: Real-time text messaging alongside video feeds, powered by high-speed WebSocket connections.
- 🎨 **SaaS-Level Visual Polish**: An extremely premium, modern dark-mode meeting workspace featuring glassmorphism, responsive tiles, and micro-interactions.
- 💡 **Coming Soon Overlays**: All placeholder or future features display a highly polite and beautifully custom-styled toast notification on user clicks.

---

## 🛠️ Technology Stack

| Architecture | Technologies Used |
| :--- | :--- |
| **Frontend Core** | Next.js 15 (App Router), React 19, TypeScript |
| **Backend Engine** | Django 5, Django REST Framework |
| **Real-time Channels** | Django Channels (Daphne ASGI WebSockets), raw WebRTC APIs |
| **Styling & Theme** | Tailwind CSS v4, tw-animate-css, lucide-react icons |
| **Database Layer** | SQLite (optimized relationship modeling, indexed migrations) |
| **Notification Engine** | Sonner global toast overlays |

---

## 📁 Project Structure

```text
ZoomX2/
├── assets/                      # Repository image assets and 8K banners
│   └── zoomx_banner.png
│
├── ZoomX-clone-backend/         # Django ASGI WebSocket & REST API Backend
│   ├── backend/                 # Project settings, routing, and ASGI entrypoint
│   └── meetings/                # Models, migrations, consumers (WebSockets), and views
│
└── frontend/
    └── pixel-perfect-clone/     # Next.js 15 Client Web Application
        ├── src/app/             # Pages (Lobby, Meeting room, Auth rooms)
        ├── src/components/      # Reusable cards, layouts, and toolbars
        ├── src/hooks/           # Custom React WebRTC, WebSocket, and level monitoring hooks
        └── src/lib/             # REST API clients, formatting utilities
```

---

## ⚙️ Installation & Setup

<details>
<summary>📋 Step 1: Repository Configuration</summary>
<br />

Clone the repository and ensure you are in the root directory:
```bash
git clone https://github.com/Aditya-kumar2004/ZoomX2.git
cd ZoomX2
```
</details>

<details>
<summary>🐍 Step 2: Backend Setup (Django & WebSockets)</summary>
<br />

1. Navigate to the backend directory:
   ```bash
   cd ZoomX-clone-backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On macOS/Linux:
   source venv/bin/activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run database migrations and seed schemas:
   ```bash
   python manage.py migrate
   ```
5. Start the Daphne ASGI WebSockets server:
   ```bash
   daphne -p 8000 backend.asgi:application
   ```
*Backend server is fully operational at `http://localhost:8000`*
</details>

<details>
<summary>⚛️ Step 3: Frontend Setup (Next.js & Tailwind v4)</summary>
<br />

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend/pixel-perfect-clone
   ```
2. Install required node packages:
   ```bash
   npm install
   ```
3. Boot the local development server:
   ```bash
   npm run dev
   ```
*Next.js application is running at `http://localhost:3000`*
</details>

---

## 🤝 Contributing
Contributions, feature enhancements, and bug reports are welcome! Feel free to open issues or file pull requests.

## 📄 License
Licensed under the [MIT License](LICENSE).

<hr />

<div align="center">
  <p>🚀 Developed with ❤️ by <strong>Aditya Kumar</strong> and backed by <strong>Antigravity</strong></p>
</div>
