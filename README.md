# Hospital Management System

A web-based hospital management system built with **Flask** and **SQLite**. Supports admin and patient roles with dashboards for managing bed availability, inventory, and appointments.

## Features

- **Role-based login** — separate admin and patient views
- **User registration** — patients can sign up directly
- **Bed management** — admin can track bed availability and assignments
- **Inventory management** — track hospital supplies and medicines
- **Appointment scheduling** — patients book and view appointments
- Session-based authentication with Werkzeug password hashing

## Tech Stack

- **Backend:** Flask (Python)
- **Database:** SQLite (auto-created on first run)
- **Frontend:** HTML templates with Jinja2
- **Auth:** Werkzeug security (bcrypt hashing)

## Setup

### 1. Install dependencies
```bash
pip install flask werkzeug
```

### 2. Run the application
```bash
python app.py
```

Open [http://localhost:5000](http://localhost:5000) in your browser.

The SQLite database (`hospital.db`) is created automatically.

## Roles

| Role | Access |
|------|--------|
| **Admin** | Manage beds, inventory, view all appointments |
| **User/Patient** | Book appointments, view own records |

## Project Structure

```
Hospital_Management/
├── app.py          # Main Flask application
├── hospital.db     # SQLite database (auto-generated)
├── static/         # CSS and static assets
└── templates/      # HTML templates
    ├── index.html
    ├── signup.html
    ├── admin.html
    └── user.html
```
