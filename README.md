# NoteVerse (MERN) — working setup

## Run locally
1. MongoDB running locally (or use an Atlas URI).
2. Backend (API + chat sockets, one server):
   cd backend && npm install && cp .env.example .env   # edit URL if needed
   npm run dev                                          # http://localhost:8000
3. Frontend:
   cd frontend && npm install && npm start             # http://localhost:3000
   (frontend/.env -> REACT_APP_API_URL=http://localhost:8000)

## Deploy
- Backend -> Render/Railway (Root Directory: backend, Build: npm install, Start: npm start).
  Env vars: URL (MongoDB Atlas URI), CLIENT_URL (your Vercel URL), PUBLIC_URL (the backend's own URL).
- Frontend -> Vercel (Root Directory: frontend).
  Env var: REACT_APP_API_URL = your backend URL (no trailing slash).
- Atlas: Network Access must allow the backend host (0.0.0.0/0 for a student project).

## Known limitation
Uploaded files are stored on the backend's disk (public/uploads). Free hosts wipe that on
redeploy/restart, so uploaded notes can disappear. For permanent storage use Cloudinary/S3.
