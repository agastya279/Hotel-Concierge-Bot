<div align="center">

# SEED Resort Concierge

### Hospitality, with an intelligent first response.

A full-stack AI concierge for SEED Resort. Guests can ask Aria for help in a polished, streaming chat experience—without an account—or sign in to keep their conversations and return to them later.

[Features](#-product-experience) · [Architecture](#-architecture) · [Local setup](#-local-development) · [Deployment](#-deployment)

<br />

<img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
<img src="https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=black" alt="React and Vite" />
<img src="https://img.shields.io/badge/Express-5-111111?logo=express&logoColor=white" alt="Express 5" />
<img src="https://img.shields.io/badge/PostgreSQL-Drizzle-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL and Drizzle" />
<img src="https://img.shields.io/badge/AI-OpenAI-412991?logo=openai&logoColor=white" alt="OpenAI" />
<img src="https://img.shields.io/badge/Workspace-pnpm-F69220?logo=pnpm&logoColor=white" alt="pnpm" />

</div>

---

## The idea

Great hospitality is personal, immediate, and effortless. **SEED Resort Concierge** brings those qualities into a digital guest experience: Aria answers resort questions and offers recommendations through a conversational interface designed to feel at home in a premium resort brand.

The product is built around a low-friction promise: **start chatting immediately; sign in when you want your history saved.** Guests can use an in-memory chat, while authenticated users can revisit, search, rename, and manage database-backed conversations.

> **Product principle:** remove friction for the first question, then make the experience more useful over time.

## ✨ Product experience

- **Talk to Aria** — a resort concierge experience powered by OpenAI, with incremental streaming responses.
- **Start without signing in** — guest messages stay in the guest flow and are not written to the conversation database.
- **Keep a conversation history** — signed-in guests can save and revisit their chats.
- **Move quickly** — welcome-page request suggestions, a new-chat shortcut (`⌘K` / `Ctrl+K`), and a stop-generation control.
- **Make answers usable** — assistant responses render Markdown, show timestamps, and can be copied.
- **Stay organized** — conversation sidebar groups chats by date, supports search, and offers rename and delete actions.
- **Enjoy a considered interface** — resort-inspired dark surfaces, sage-green accents, motion, and a responsive chat layout.

## 🧭 Architecture

```mermaid
flowchart LR
    Guest[Guest or signed-in user] --> Web[React + Vite web app]
    Web -->|Guest streaming request| GuestAPI[Express API · guest chat]
    Web -->|Authenticated chat and history| ChatAPI[Express API · conversations]
    ChatAPI --> Auth[Auth/session middleware]
    ChatAPI --> DB[(PostgreSQL · Drizzle ORM)]
    GuestAPI --> AI[OpenAI-compatible integration]
    ChatAPI --> AI
    Spec[OpenAPI contract] --> Gen[Orval code generation]
    Gen --> Hooks[React Query client hooks]
    Gen --> Schemas[Zod schemas]
    Hooks --> Web
    Schemas --> ChatAPI
```

### Request lifecycle

1. The React client sends a chat request to the Express API.
2. The API selects the guest or authenticated conversation flow.
3. Authenticated conversation operations are scoped to the current user; guest chat does not persist messages to PostgreSQL.
4. The server calls the configured OpenAI-compatible service and streams output to the client.
5. The frontend consumes the stream with `fetch` and a `ReadableStream`, updating the assistant message as chunks arrive. An `AbortController` allows the guest to stop generation.

### API contract and shared packages

The workspace separates the API contract, generated frontend client, validation schemas, database layer, and applications. OpenAPI code generation uses Orval to produce React Query hooks and Zod schemas. Keep generated output and hand-written application code distinct; update the API specification and run code generation when the contract changes.

## 🧰 Technology

| Area | Technologies |
| --- | --- |
| Web client | React, Vite, TypeScript, Tailwind CSS, Framer Motion |
| Routing and data | Wouter, TanStack React Query |
| UI | Radix UI, Lucide, React Markdown |
| API | Node.js 24, Express 5, TypeScript |
| AI | OpenAI SDK and configurable OpenAI-compatible endpoint |
| Persistence | PostgreSQL, Drizzle ORM |
| Contracts | OpenAPI, Orval, Zod |
| Build and workspace | pnpm workspaces, TypeScript project references, esbuild |

## 📁 Repository map

```text
.
├── artifacts/
│   ├── api-server/                  # Express API, chat routes, server build
│   ├── hotel-chatbot/               # React/Vite guest-facing application
│   └── mockup-sandbox/              # UI experimentation
├── lib/
│   ├── api-spec/                    # OpenAPI specification and codegen config
│   ├── api-client-react/            # Generated React Query client
│   ├── api-zod/                     # Generated Zod schemas
│   ├── db/                          # Drizzle schema and database connection
│   ├── integrations/                # Shared integration packages
│   ├── integrations-openai-ai-react/
│   ├── integrations-openai-ai-server/
│   └── replit-auth-web/
├── scripts/                         # Workspace utility scripts
├── .env.example                     # Environment variable template
├── package.json                     # Root scripts and workspace metadata
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── replit.md                        # Additional project and implementation notes
```

### Application responsibilities

- `artifacts/hotel-chatbot` owns the welcome experience, guest and authenticated chat UI, streaming hooks, and client-side navigation.
- `artifacts/api-server` owns API routing, AI request handling, authentication integration, and server-side conversation operations.
- `lib/api-spec`, `lib/api-client-react`, and `lib/api-zod` provide the contract-first API tooling.
- `lib/db` provides PostgreSQL and Drizzle integration.

## 🚀 Local development

### Requirements

- Node.js **24**
- pnpm (the repository's `preinstall` script rejects other package managers)
- PostgreSQL
- An OpenAI API key or compatible AI integration endpoint

### 1. Install

```bash
git clone https://github.com/agastya279/Hotel-Concierge-Bot.git
cd Hotel-Concierge-Bot
pnpm install
```

### 2. Configure environment

Create a local `.env` from the checked-in template:

```bash
cp .env.example .env
```

Set the values appropriate to your environment:

```dotenv
DATABASE_URL=postgresql://user:password@localhost:5432/seed_hotel
AI_INTEGRATIONS_OPENAI_BASE_URL=https://your-openai-compatible-endpoint
AI_INTEGRATIONS_OPENAI_API_KEY=your_api_key
SESSION_SECRET=replace_with_a_long_random_secret
REPL_ID=
REPLIT_DOMAINS=
REPLIT_DEV_DOMAIN=
```

Do not commit `.env` or expose server-side API credentials in frontend code. The `.env.example` file is the source of truth for the environment variables currently documented by the repository. Hosted deployments may require additional provider-specific configuration; consult the deployment handoff and hosting platform settings.

### 3. Start the applications

Run the API and frontend in separate terminals from the repository root:

```bash
pnpm --dir artifacts/api-server run dev
```

```bash
pnpm --dir artifacts/hotel-chatbot run dev
```

The frontend's Vite server is configured to bind to `0.0.0.0`. Configure the frontend's API destination and any provider-specific auth settings for your local environment as needed.

### 4. Validate and build

```bash
# Type-check workspace libraries and applications
pnpm run typecheck

# Type-check first, then build packages that define a build script
pnpm run build
```

Useful package-level commands:

```bash
pnpm --dir artifacts/api-server run typecheck
pnpm --dir artifacts/api-server run build
pnpm --dir artifacts/hotel-chatbot run typecheck
pnpm --dir artifacts/hotel-chatbot run build
```

## 🧑‍💻 Engineering notes

### Streaming

The frontend reads the chat response using `fetch` and `ReadableStream`; it does not rely on `EventSource`. Both authenticated and guest chat flows use an `AbortController` so the user can stop an in-progress response. The documented stream uses content chunks followed by a completion marker.

### Data ownership

Authenticated conversations are associated with the current user. Conversation reads and mutations should include both the conversation identifier and owner scope in their database predicates. Guest chat is intentionally separate and does not write conversation history to the database.

### TypeScript workspace

Packages use TypeScript composite-project configuration and references from the root `tsconfig.json`. Run type-checking from the workspace root to validate the related packages together. JavaScript bundling is handled by the relevant package build tools rather than TypeScript declaration output.

### API client generation

The repository documents API generation through the `@workspace/api-spec` package. When changing a documented API contract, regenerate the client and validation code using the package script:

```bash
pnpm --filter @workspace/api-spec run codegen
```

Some app-specific endpoints may not be represented in generated hooks; follow the existing client patterns in the relevant feature when adding or modifying endpoints.

## ☁️ Deployment

The frontend includes Netlify deployment configuration and a deployment guide at [`artifacts/hotel-chatbot/NETLIFY_DEPLOYMENT.md`](artifacts/hotel-chatbot/NETLIFY_DEPLOYMENT.md). That guide describes deploying the static frontend separately from the Express API.

At a high level:

1. Build the frontend and publish its static output to Netlify.
2. Deploy the API separately to a Node-compatible host.
3. Set the frontend's public API base URL and browser-safe auth configuration.
4. Configure the API's secrets, database connection, and allowed frontend origin for credentialed requests.
5. Verify the deployed frontend can reach the API over HTTPS.

The frontend is not the AI service: chat streaming and saved-conversation endpoints require the separately deployed API. Never put OpenAI API credentials, auth secret keys, or session secrets in static frontend assets. See the [API handoff](artifacts/hotel-chatbot/api-server-handoff.md) for backend deployment requirements.

## 🎨 Visual direction

The interface's design language is warm, calm, and resort-inspired:

- Sage green: `#52b788`
- Deep green: `#2d6a4f`
- Dark charcoal surfaces
- Serif display headings for a boutique-hospitality feel
- Soft motion and glass-like overlays to create depth without distracting from the conversation

## 🛣️ Possible next steps

The current foundation can support future hospitality workflows such as booking and check-in requests, multilingual assistance, curated local recommendations, staff handoff, guest feedback, and property-management integrations. These are potential extensions—not claims about current functionality.

## License

The root `package.json` declares the project license as MIT. Refer to the repository's license file and distribution terms when reusing the code.

---

<div align="center">

**A more thoughtful first response for every resort guest.**

Built with TypeScript · React · Express · PostgreSQL · OpenAI

</div>
