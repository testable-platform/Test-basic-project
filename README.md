# Test Basic Project

A minimal full-stack starter with **Python (Flask)** backend and **React (Vite)** frontend.

Features:
- User registration
- Login with JWT
- Logout (client-side token removal + server acknowledgement)
- Protected dashboard route

## Project structure

```text
Test-basic-project/
├── backend/          # Flask + SQLite
│   └── app/
└── frontend/         # React + Vite
    └── src/
```

## Prerequisites

- Python 3.11+
- Node.js 18+

## Backend setup

```bash
cd backend
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # Windows
# cp .env.example .env   # macOS/Linux

python -m flask --app app.main run --debug --port 8000
```

## Frontend setup

```bash
cd frontend
npm install
npm run dev
```

App: http://localhost:5173

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| POST | `/api/v1/auth/register` | Register a new user |
| POST | `/api/v1/auth/login` | Login and receive JWT |
| POST | `/api/v1/auth/logout` | Logout (requires Bearer token) |
| GET | `/api/v1/auth/me` | Current user profile |

## Auth flow

1. Register or login returns a JWT access token.
2. Frontend stores the token in `localStorage`.
3. Protected requests send `Authorization: Bearer <token>`.
4. Logout clears the token locally and calls the logout endpoint.

## Run tests

```bash
cd backend
pip install -r requirements-dev.txt
pytest tests/ -q
```

## Notes

- Default SQLite database file: `backend/auth.db`
- Change `SECRET_KEY` in `backend/.env` before production use.
- JWT logout is stateless; tokens expire automatically after 60 minutes.

## Push to GitHub

```bash
git add .
git commit -m "Add basic auth app with Flask and React"
git push -u origin main
```

Repository: https://github.com/testable-platform/Test-basic-project
