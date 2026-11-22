# Deploy with Docker Compose

This repository includes a Docker Compose deployment for the complete application: the React site, Express API, and PostgreSQL. Nginx serves the frontend and proxies `/api/*` to the backend, so the browser uses one origin for chat streaming, Clerk proxy requests, and cookies.

## Requirements

- Docker Engine and the Docker Compose plugin
- Clerk publishable and secret keys
- A Groq API key

## Configure and launch

1. Copy the deployment template and edit the values:

   ```sh
   cp .env.docker.example .env
   ```

   Set `POSTGRES_PASSWORD`, `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `GROQ_API_KEY`, and `SESSION_SECRET`. The Clerk publishable key is public and gets injected into the frontend at container startup; never put the other keys in frontend files.

2. Build and start the services:

   ```sh
   docker compose up --build -d
   ```

3. Open `http://localhost:8080` (or the port configured by `WEB_PORT`). Check the API with `http://localhost:8080/api/healthz`.

For production, point a domain and HTTPS reverse proxy at the web service's published port. Set the Clerk application’s allowed origins and redirect URLs to the public site origin. Use a managed PostgreSQL database if desired by replacing `DATABASE_URL` in the `api` service configuration and removing or ignoring the Compose `db` service. Keep the database and backend secrets in the hosting provider's secret manager.

## Initialize/update the database schema

The API expects the Drizzle schema to exist before it can persist conversations. For a new database or after schema changes, run the workspace's Drizzle push command from the repository root:

```sh
docker compose run --rm --no-deps api pnpm --filter @workspace/db run push
```

Back up production data before applying schema changes. The command applies the current schema; it is not an automated migration history.

## Operations

```sh
docker compose logs -f api
docker compose ps
docker compose down
```

`docker compose down` preserves the PostgreSQL volume. To permanently delete the database data as well, use `docker compose down --volumes`.

## Alternative: Netlify frontend

The frontend also has its existing Netlify configuration and manual deployment guide at `artifacts/hotel-chatbot/NETLIFY_DEPLOYMENT.md`. The Docker Compose option serves both frontend and API together. For separate Netlify hosting, deploy the API to a Node-compatible host and configure the public API URL in the frontend runtime config; never publish server-side keys.
