# 📚 AI Study Buddy

An AI-powered full-stack learning assistant for college students. Ask questions, generate quizzes, build study plans, and track your progress — all powered by Google Gemini.

## Features

- 🔐 JWT authentication (register/login, hashed passwords, protected routes)
- 🤖 AI Tutor — ask questions and get simple, leveled explanations
- 📝 AI Quiz Generator — structured multiple-choice quizzes with instant scoring
- 📅 AI Study Planner — day-by-day study schedules with task tracking
- 📈 Progress Dashboard — subject-wise performance, charts, weak-topic detection
- 💡 AI Recommendations — personalized revision suggestions based on quiz history

## Technology Stack

**Frontend:** React (Vite), Tailwind CSS, React Router, Axios, Recharts, react-hot-toast
**Backend:** Node.js, Express.js, REST API
**Database:** MongoDB + Mongoose
**Auth:** JWT, bcryptjs
**AI:** Google Gemini API (`@google/genai`), called only from the backend

## Architecture

```
Student → React Frontend → Express Backend → MongoDB Atlas
                                            → Gemini API
```

The frontend never calls Gemini directly — every AI request goes through the Express backend, so the API key is never exposed to the browser.

## Folder Structure

```
AI-Study-Buddy/
├── frontend/    React + Vite app
└── backend/     Express API + Gemini service
```

See inline comments in each file for details.

## Getting Started

### 1. Prerequisites

- Node.js 18+
- A MongoDB connection string (local or MongoDB Atlas)
- A Gemini API key from https://aistudio.google.com/app/apikey

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your MongoDB URI, JWT secret, and Gemini API key
npm run dev
```

Backend runs at `http://localhost:5000`.

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# VITE_API_URL=http://localhost:5000/api
npm run dev
```

Frontend runs at `http://localhost:5173`.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGODB_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_gemini_api_key
CLIENT_URL=http://localhost:5173
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
```

Never commit `.env` files — they're already in `.gitignore`.

## API Documentation

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in, returns JWT |
| GET | `/api/auth/me` | Get current user (protected) |

### AI
| Method | Route | Description |
|---|---|---|
| POST | `/api/ai/ask` | Ask the AI tutor a question |
| POST | `/api/ai/recommendation` | Get a personalized study recommendation |

### Quiz
| Method | Route | Description |
|---|---|---|
| POST | `/api/quiz/generate` | Generate an AI quiz (not saved yet) |
| POST | `/api/quiz/result` | Submit and save a completed quiz |
| GET | `/api/quiz/history` | Get the user's quiz history |

### Study Plan
| Method | Route | Description |
|---|---|---|
| POST | `/api/study-plan/generate` | Generate and save an AI study plan |
| GET | `/api/study-plan` | Get all study plans for the user |
| PUT | `/api/study-plan/:id` | Update a task's status |

### Progress
| Method | Route | Description |
|---|---|---|
| GET | `/api/progress` | Overall progress stats |
| GET | `/api/progress/subjects` | Subject-wise performance & weak topics |

All routes except register/login require `Authorization: Bearer <token>`.

## Gemini Setup

1. Go to https://aistudio.google.com/app/apikey and create an API key.
2. Add it to `backend/.env` as `GEMINI_API_KEY`.
3. All calls are centralized in `backend/services/geminiService.js` — this is the only file that talks to Gemini.

## MongoDB Setup

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow network access (or `0.0.0.0/0` for development).
3. Copy the connection string into `backend/.env` as `MONGODB_URI`.

## Deployment

- **Frontend → Vercel:** set build command `npm run build`, and set `VITE_API_URL` to your deployed backend URL.
- **Backend → Render:** set start command `npm start`. The server reads `process.env.PORT`, so no hardcoded port is needed. Set all backend env vars in Render's dashboard.
- **Database → MongoDB Atlas.**
- **AI → Gemini API**, called only from the backend.

## Screenshots

_Add screenshots of the Dashboard, AI Tutor, Quiz, Study Planner, and Progress pages here after running the app._

## Future Improvements

- Email verification and password reset
- Spaced-repetition flashcards
- Collaborative study groups
- Export study plans to PDF/calendar
- Dark mode

## Development Notes

This project was built as a college minor project and is intended to be understandable and demonstrable end-to-end: Frontend + Backend + Database + Authentication + REST APIs + Gemini AI + Deployment.
