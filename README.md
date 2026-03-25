# Office Room Reservation App

This project can run in two modes:

- Local Windows mode with `server.ps1` for disk-backed storage and Outlook automation
- Vercel mode with serverless API routes in `api/`

## Deploy To Vercel

1. Push this folder to a Git repository.
2. Import the repository into Vercel.
3. Deploy as a standard Vercel project.

## Optional Vercel Environment Variables

To enable shared online storage:

- `KV_REST_API_URL`
- `KV_REST_API_TOKEN`

These should point to a Vercel KV-compatible REST endpoint.

To enable automatic email sending:

- `RESEND_API_KEY`
- `EMAIL_FROM`

Example `EMAIL_FROM` value:

- `Office Reservations <reservations@yourdomain.com>`

## Behavior Without Environment Variables

- Room and booking data fall back to browser `localStorage`
- Confirmation email falls back to opening a draft in the user's mail client

## Local Windows Run

```powershell
cd C:\Users\coolh\OneDrive\Documents\ChatGPT_Codex
powershell -ExecutionPolicy Bypass -File .\server.ps1
```
