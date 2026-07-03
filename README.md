# PromptVerse AI

Premium AI Prompt Library scaffold — production-ready Next.js + TypeScript app with Tailwind, Framer Motion, Firebase integration, and a sample dataset of 200 prompts.

Features included in this scaffold:

- Dark-mode-first, glassmorphism-inspired UI
- Landing page with hero, search, categories and stats
- Prompt API route that serves sample prompts
- Seed script that programmatically generates 200 realistic prompts
- Firebase client initialization (placeholder env vars)
- Accessibility and SEO foundations
- Ready for deployment on Vercel

Quick start
1. Install dependencies: npm ci
2. Configure Firebase: set environment variables in Vercel or local .env
3. Run dev: npm run dev
4. Seed local sample prompts (optional): npm run seed

Environment variables (for Firebase & Stripe in production):
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- NEXT_PUBLIC_FIREBASE_APP_ID
- FIREBASE_SERVICE_ACCOUNT (for server-side admin tasks)

Deployment
- Connect this repository to Vercel, set environment variables there, and deploy.

