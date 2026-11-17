# SEED Resort Hotel Concierge

<p align="center">
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Express-5-000000?logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/OpenAI-GPT-5.2-412991?logo=openai&logoColor=white" alt="OpenAI GPT 5.2" />
  <img src="https://img.shields.io/badge/DB-PostgreSQL-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Tooling-pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
</p>

A full-stack AI concierge experience for SEED Resort, built as a TypeScript monorepo with a streaming OpenAI-powered backend and a polished React frontend. The system supports both signed-in guest experiences with persistent conversation history and guest-mode chat without a database.

The project is centered around Aria, the resort concierge, who can answer guest questions, provide recommendations, and help with stay-related information in a friendly, modern interface.

## Overview

This repository combines:

- A Node.js/Express backend with session-aware auth
- A PostgreSQL + Drizzle data layer for saved conversations
- An OpenAI integration for AI-powered chat responses
- A Vite + React + Tailwind frontend with a rich hotel-brand experience
- A monorepo build system using pnpm workspaces and TypeScript project references

The architecture is designed for rapid iteration, clean API boundaries, and a modern full-stack developer workflow.

## Why this project matters

Hospitality experiences increasingly depend on instant, personalized support. This app provides a smart concierge-style interface where guests can:

- ask about amenities, local attractions, or restaurant suggestions
- start a chat without signing in
- preserve conversation history when authenticated
- interact with a fast, streaming AI experience
- browse previous resort chats from a sidebar dashboard

It is a strong example of a production-style AI application that blends UX, API design, AI orchestration, and data persistence.

## Core features

### AI assistant experience

- Streaming chat responses from OpenAI
- Guest chat mode with in-memory conversation flow
- Authenticated chat mode with persistent DB-backed history
- Response rendering with markdown support and copy buttons
- Animated typing state and messaging experience

### Hospitality-focused UX

- Elegant landing page with immersive resort background styling
- Glassmorphism interface and dark resort theme
- Quick action chips for common guest requests
- Date-grouped conversation history and search experience
- New conversation shortcuts using keyboard commands

### Conversation management

- Save conversations for authenticated users
- Rename conversations inline
- Auto-generate conversation titles after initial exchange
- Sidebar organization by time group
- Conversation deletion and session-aware user scoping

### Authentication and authorization

- Session-based auth middleware
- Per-user isolation for conversation records
- Guest access without DB writes
- Sign-in flow that upgrades the guest experience to saved history

### Developer ergonomics

- TypeScript monorepo structure
- Shared schemas generated from OpenAPI specs
- React Query hooks generated from API contracts
- API validation with Zod
- Root-level build and typecheck orchestration

## Tech stack

### Frontend

- React
- Vite
- Tailwind CSS
- Framer Motion
- Wouter for routing
- TanStack React Query
- Radix UI primitives
- React Markdown for assistant message rendering

### Backend

- Node.js
- Express 5
- PostgreSQL
- Drizzle ORM
- Zod validation
- OpenAI SDK
- SSE-style streaming responses

### Tooling

- pnpm workspaces
- TypeScript 5.9
- esbuild for backend bundling
- Orval for API client generation
- project references for composite TypeScript builds

## Architecture

```text
SEED Resort Concierge
├── artifacts/
│   ├── api-server/           # Express backend + AI orchestration
│   ├── hotel-chatbot/        # React frontend + UX
│   └── mockup-sandbox/       # design/sandbox experimentation
├── lib/
│   ├── api-spec/              # OpenAPI contract and codegen config
│   ├── api-client-react/      # generated React client hooks
│   ├── api-zod/               # generated Zod schemas
│   ├── db/                    # DB schema and connection logic
│   ├── integrations/          # shared integration layer
│   ├── integrations-openai-ai-react/
│   ├── integrations-openai-ai-server/
│   ├── replit-auth-web/
│   └── ...
├── scripts/
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── replit.md
```

The project follows a practical multi-package layout:

- frontend and backend are isolated artifacts
- generated API code is kept separate from handwritten app logic
- shared libraries provide typed contracts and integrations
- root package handles workspace orchestration

## Repository structure

```text
.
├── .agents/
├── .env.example
├── .gitignore
├── .npmrc
├─��� .replit
├── .replitignore
├── artifacts/
│   ├── api-server/
│   ├── hotel-chatbot/
│   └── mockup-sandbox/
├── lib/
│   ├── api-client-react/
│   ├── api-spec/
│   ├── api-zod/
│   ├── db/
│   ├── integrations/
│   ├── integrations-openai-ai-react/
│   ├── integrations-openai-ai-server/
│   └── replit-auth-web/
├── scripts/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── replit.md
├── tsconfig.base.json
├── tsconfig.json
├── seed-resort-netlify-package.zip
├── seed-resort-netlify-site.zip
└── README.md
```

## Getting started

### Prerequisites

- Node.js 24+
- pnpm
- PostgreSQL instance
- OpenAI-compatible API access or configured AI integration

### 1. Install dependencies

```bash
git clone https://github.com/agastya279/Hotel-Concierge-Bot.git
cd Hotel-Concierge-Bot
pnpm install
```

### 2. Configure environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env
```

The repository expects variables such as:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/seed_hotel
AI_INTEGRATIONS_OPENAI_BASE_URL=https://...
AI_INTEGRATIONS_OPENAI_API_KEY=your_openai_api_key_here
SESSION_SECRET=your_random_session_secret_here
REPL_ID=
REPLIT_DOMAINS=
REPLIT_DEV_DOMAIN=
```

For local development, the example file is a useful guide. The app is designed to work with Replit AI integrations or a custom OpenAI-compatible endpoint.

### 3. Run the app locally

Start the backend:

```bash
pnpm --dir artifacts/api-server run dev
```

Start the frontend:

```bash
pnpm --dir artifacts/hotel-chatbot run dev
```

The backend listens on the configured API port, while the hotel chatbot frontend runs via Vite and provides the guest experience.

## Useful workspace commands

From the repository root:

```bash
pnpm install
pnpm run typecheck
pnpm run build
```

Package-specific commands are defined in the individual package manifests, such as:

```bash
pnpm --dir artifacts/api-server run typecheck
pnpm --dir artifacts/hotel-chatbot run typecheck
pnpm --dir artifacts/api-server run build
pnpm --dir artifacts/hotel-chatbot run build
```

## Project behavior

### Guest mode

Guests can chat without storing data in the database. This mode is optimized for quick access and onboarding without friction. The app can route directly to chat flow and use in-memory conversation storage.

### Authenticated mode

Authenticated users get:

- persistent conversation history
- saved conversation titles
- per-user chat ownership and access control
- inline rename/editing for conversation metadata

### Streaming AI

The platform uses streaming responses rather than waiting for the entire completion before sending output. This creates a more natural chat-like interaction and supports richer UI feedback such as typing indicators and live streaming updates.

### API contracts and generated client code

The repository uses a generated client pattern from the OpenAPI spec. This is a good fit for a modern monorepo because it keeps frontend and backend aligned around a single API contract.

The pipeline appears to be:

- define OpenAPI contract in the API spec module
- generate Zod schemas for validation
- generate React Query hooks for client use
- consume the generated contracts in the frontend UI

## Design system notes

The interface uses a warm green / resort palette and a dark background with a polished, premium travel aesthetic. The brand styling strongly emphasizes hospitality, calmness, and polished service.

Key colors and design direction noted in the repo include:

- primary green: `#52b788`
- darker green accent: `#2d6a4f`
- dark background tones for contrast
- serif headlines for a boutique hotel identity

## Deployment notes

The repository includes deployment-oriented artifacts and integration notes for hosting the frontend on Netlify and keeping the API server separate. The frontend package includes Netlify deployment configuration and a deployment guide in the artifact directory.

This project also includes Replit-focused config and environment support, making it suitable for hosted development and quick iteration.

## Development considerations

### Monorepo conventions

The root project is configured as a TypeScript project with composite package references. The repo enforces an incremental and typed workspace build model instead of a loose, ad hoc structure.

### API validation and safety

The backend emphasizes structured validation and typed endpoints, reducing drift between the server and client. Schemas and generated clients help maintain a consistent contract.

### Performance and UX

The frontend is designed to feel fast and responsive, with features such as:

- hierarchical sidebar organization
- streaming assistant output
- quick actions to reduce friction
- markdown response rendering
- keyboard shortcuts for instant task execution

## Roadmap / extension ideas

This app is a strong base for several hospitality or assistant-driven enhancements, including:

- room booking and check-in flows
- local recommendations with maps and routing
- multilingual concierge support
- guest satisfaction surveys
- staff escalation / human handoff
- integration with property management systems

## License

This repository currently declares MIT licensing at the root package level, which indicates the project is intended to be open-source and reusable as a starter/template for similar AI concierge experiences.

## Final thoughts

SEED Resort Hotel Concierge is a polished, modern example of an AI-powered hospitality assistant. It blends end-user delight with engineering discipline: strong API contracts, typed monorepo design, streaming AI orchestration, and a visually compelling UI.

If you are looking for a project that demonstrates how to combine frontend experience, backend orchestration, AI integration, and developer tooling in one cohesive app, this repo is a strong example.

---

Built for SEED Resort • Powered by TypeScript, React, Express, PostgreSQL, and OpenAI
