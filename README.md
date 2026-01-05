# Manajeko

<div align="center">
  <img src="assets/manajeko-dashboard.png" alt="Manajeko Dashboard" width="100%" />
  
  <h3 align="center">Modern Project Management for High-Velocity Teams</h3>

  <p align="center">
    Manajeko (formerly Quantask) is a comprehensive project management solution designed to streamline collaboration, tracking, and delivery. Built with a robust Rails API backend and a dynamic Angular frontend.
  </p>
</div>

---

## 🚀 Overview

Manajeko provides a unified workspace for managing projects, tasks, and teams. It combines the structure of traditional project management with the flexibility of modern agile tools.

### Key Features

- **Interactive Dashboard:** Get a bird's-eye view of your projects, notifications, and upcoming deadlines.
- **Kanban Boards:** Visualize workflows with drag-and-drop swimlanes, custom tags, and status tracking (To-do, On Progress, In Review, Completed).
- **Detailed Task Management:** Create tasks with rich descriptions, checklists, comments, and attachments.
- **Team Collaboration:** Invite members, assign tasks, and communicate in real-time.
- **Security:** Robust authentication system with 2FA support (Email & SMS).

## 🏗 Architecture

This repository contains the full source code for the Manajeko platform, organized as a monorepo for the frontend and backend services.

### Directory Structure

| Directory       | Service         | Stack                       | Description                                                                            |
| --------------- | --------------- | --------------------------- | -------------------------------------------------------------------------------------- |
| `quantask-api/` | **Backend API** | Ruby on Rails 7, PostgreSQL | RESTful API handling data persistence, authentication (JWT), and business logic.       |
| `quantask-web/` | **Frontend**    | Angular 16+, Tailwind CSS   | Single Page Application (SPA) delivering a responsive and interactive user experience. |

## 🛠 Getting Started

To run the application locally, you will need to set up both the backend and frontend services.

### Prerequisites

- **Ruby:** 3.x
- **Node.js:** 18+
- **PostgreSQL**

### 1. Backend Setup (`quantask-api`)

```bash
cd quantask-api

# Install dependencies
bundle install

# Setup database
rails db:create db:migrate db:seed

# Start the server (runs on port 3001)
rails server -p 3001
```

### 2. Frontend Setup (`quantask-web`)

```bash
cd quantask-web

# Install dependencies (use legacy-peer-deps if needed)
npm install --legacy-peer-deps

# Start the development server (runs on port 4200)
ng serve
```

Access the application at `http://localhost:4200`.

## 📦 Deployment

Manajeko is configured for deployment on **Render.com**.

- **API:** Deployed as a Web Service (Docker or Native Ruby environment).
- **Web:** Deployed as a Static Site with rewrite rules for SPA routing.

## 🤝 Contributing

1.  Fork the repository
2.  Create your feature branch (`git checkout -b feature/amazing-feature`)
3.  Commit your changes (`git commit -m 'Add some amazing feature'`)
4.  Push to the branch (`git push origin feature/amazing-feature`)
5.  Open a Pull Request

---

© 2025 Manajeko. All rights reserved.
