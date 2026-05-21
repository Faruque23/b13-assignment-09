# TutorNest

Tutor booking platform built with Next.js App Router.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local env file from template:

```bash
copy .env.example .env.local
```

3. Update values in `.env.local`:

- `GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- `JWT_SECRET`

## Google OAuth Required Steps

1. Open Google Cloud Console.
2. Create OAuth 2.0 Web Client credentials.
3. Add authorized JavaScript origins:
- `http://localhost:3000`
4. Copy the client ID and set it in both:
- `GOOGLE_CLIENT_ID`
- `NEXT_PUBLIC_GOOGLE_CLIENT_ID`

If `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is missing, the Google sign-in button will not render.

## Run

```bash
npm run dev
```

After changing env values, restart the dev server.
