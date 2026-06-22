# SkillSwap (MERN)

Student skill-exchange platform. Stack: MongoDB, Express, React (Vite + Tailwind), Node, Socket.io, JWT, Google OAuth.

## Run locally

### 1. Server
```bash
cd server
cp .env.example .env   # fill in MONGO_URI, JWT_SECRET, etc.
npm install
npm run dev            # http://localhost:5000
```

### 2. Client
```bash
cd client
cp .env.example .env
npm install
npm run dev            # http://localhost:5173
```

MongoDB must be running locally (`mongodb://127.0.0.1:27017/skillswap`) or use MongoDB Atlas.

## Features included in this starter
- JWT auth (signup, login, forgot password) + Google OAuth
- User profile with avatar upload (multer → `server/uploads/`)
- Skills (teach / learn), experience level, availability
- Smart matching with score
- Real-time chat (Socket.io) with online presence
- Session booking + accept/reject
- Reviews & ratings
- AI endpoints (OpenAI) for partner/skill suggestions
- Admin routes (users, reports)
- React + Tailwind UI, dark/light mode, protected routes

This is a working scaffold — extend pages/components as you build.
