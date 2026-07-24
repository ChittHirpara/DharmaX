# Sakha AI (Sattva)

An emotionally intelligent AI companion built to provide a safe, non-judgmental space using active listening and spiritual wisdom.

## Features
- **Empathetic AI:** Driven by a custom persona designed to actively listen and comfort the user.
- **Dual-Engine AI:** Uses Llama-3 (via Groq) as the primary engine for high-speed responses, with Google Gemini 1.5 Flash as a seamless fallback.
- **API Key Rotation:** Built-in round-robin rotation for Groq API keys to prevent rate limits.
- **Full-Stack Architecture:** React (Vite) frontend + Node.js/Express backend.
- **MongoDB Cloud:** Scalable, real-time database to securely store user chat history.

## Tech Stack
- Frontend: React, TypeScript, TailwindCSS
- Backend: Node.js, Express
- Database: MongoDB Atlas
- AI: Groq (Llama-3), Google Gemini

## How to Run Locally

### 1. Backend Setup
```bash
cd server
npm install
# Ensure your .env file is set up with GROQ_API_KEYS and MONGODB_URI
npm run dev
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
