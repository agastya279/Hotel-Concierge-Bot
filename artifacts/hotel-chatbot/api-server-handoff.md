# API server handoff

The Netlify folder is a static frontend. This API must remain deployed separately for:

- Guest AI streaming: `POST /api/openai/guest-chat`
- Authenticated conversations: `/api/openai/conversations/*`
- Clerk auth proxying: `/api/__clerk/*`
- Health check: `GET /api/healthz`

## Recommended setup

Keep the existing Express API server deployed on a server that supports Node.js, streaming responses, PostgreSQL, and environment secrets. Netlify Functions are not a drop-in replacement for this server because the current chat implementation uses long-lived SSE response streams and shared database/auth middleware.

After the API has a public HTTPS URL:

1. Put that URL in `dist/public/config.js` as `apiBaseUrl`.
2. Configure the API's CORS policy to allow the exact Netlify site origin.
3. Configure Clerk with the Netlify domain as an allowed origin/redirect domain.
4. Confirm `https://YOUR-PUBLIC-API-DOMAIN/api/healthz` returns `{"status":"ok"}`.
5. Redeploy the updated static frontend.

## Backend source

The complete backend source remains in the project under `artifacts/api-server/`, with shared contracts and database code under `lib/`. It is intentionally not copied into the Netlify static publish directory because Netlify would serve it as public files rather than run it as an Express service.

## Never expose

Do not put any of these in `config.js`, Netlify static files, or browser code:

- `CLERK_SECRET_KEY`
- `AI_INTEGRATIONS_OPENAI_API_KEY`
- `SESSION_SECRET`
- `DATABASE_URL`