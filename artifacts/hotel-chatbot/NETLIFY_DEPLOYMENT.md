# SEED Resort Concierge — Netlify deployment

## What is included

- `dist/public/` — the production-ready static website to upload to Netlify
- `dist/public/config.js` — the only file you need to edit after uploading
- `dist/public/_redirects` — keeps `/chat`, `/login`, `/your-card`, and other routes from returning 404 on refresh
- `netlify.toml` — Netlify CLI configuration
- `api-server-handoff.md` — backend requirements for keeping AI chat and saved conversations working

## Upload the site

1. Open Netlify and choose **Add new site** → **Deploy manually**.
2. Upload the contents of `dist/public/` (upload the folder contents, not the parent folder).
3. Open the deployed site and edit `config.js` in the uploaded files before sharing the URL:

```js
window.__SEED_CONFIG__ = {
  apiBaseUrl: "https://YOUR-PUBLIC-API-DOMAIN",
  clerkPublishableKey: "pk_live_or_pk_test_...",
  clerkProxyUrl: "",
};
```

4. Replace the placeholder API domain and Clerk publishable key, then redeploy the updated `dist/public/` folder.

The Clerk publishable key is intended for browser use. Never place a Clerk secret key or OpenAI key in this folder.

## Keep the chatbot functional

Netlify hosts the React interface only. The AI streaming routes and saved conversation routes are served by the Express API. Deploy that API separately and set `apiBaseUrl` to its public HTTPS origin.

The API must allow the Netlify site origin for credentialed requests and must have these environment values configured:

- `PORT`
- `CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `AI_INTEGRATIONS_OPENAI_BASE_URL`
- `AI_INTEGRATIONS_OPENAI_API_KEY`
- `DATABASE_URL`
- `SESSION_SECRET`

See `api-server-handoff.md` for the API routes and deployment checklist.