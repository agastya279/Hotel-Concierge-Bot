# SEED Resort Hotel Concierge — Workspace

## Project Overview

Full-stack AI hotel concierge chatbot for **SEED Resort**. The AI (named **Aria**) handles guest requests, recommendations, and resort information. Supports both authenticated users (saved conversation history) and guests (ephemeral, in-memory chat).

---

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5 (with session-based auth middleware)
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: plain Zod (`zod` NOT `zod/v4` — v4 path does not resolve in api-server)
- **API codegen**: Orval (OpenAPI spec → React Query hooks + Zod schemas)
- **Build**: esbuild (bundles to `dist/index.mjs`)
- **Frontend**: React + Vite + Tailwind CSS + Framer Motion
- **AI**: OpenAI (via `AI_INTEGRATIONS_OPENAI_BASE_URL` + `AI_INTEGRATIONS_OPENAI_API_KEY`), model `gpt-5.2`, `max_completion_tokens: 8192`, NO temperature param

---

## Structure

```text
workspace/
├── artifacts/
│   ├── api-server/           # Express 5 backend (port 8080)
│   │   └── src/routes/openai/
│   │       ├── conversations.ts  # Auth'd conversation CRUD + streaming + PATCH rename
│   │       └── guest-chat.ts     # Guest streaming (no DB writes)
│   └── hotel-chatbot/        # React/Vite frontend
│       └── src/
│           ├── App.tsx           # QueryClient, AuthProvider, WouterRouter, KeyboardShortcuts
│           ├── pages/
│           │   ├── welcome.tsx   # Landing page with Ken Burns BG, quick chips
│           │   ├── chat.tsx      # Authenticated chat (with DB, title editing)
│           │   └── guest-chat.tsx # Guest chat (in-memory, no DB)
│           ├── components/
│           │   ├── layout/sidebar.tsx    # Date-grouped convos, search, ⌘K badge
│           │   └── chat/chat-bubble.tsx  # Markdown, copy button, timestamps, "A" avatar
│           ├── hooks/
│           │   ├── use-chat-stream.ts    # Auth'd streaming + AbortController
│           │   └── use-guest-stream.ts   # Guest streaming + AbortController
│           └── contexts/auth-context.tsx # isAuthenticated, user, login, logout
├── lib/
│   ├── api-spec/             # OpenAPI spec + Orval codegen config
│   ├── api-client-react/     # Generated React Query hooks
│   ├── api-zod/              # Generated Zod schemas
│   └── db/                   # Drizzle ORM schema + DB connection
└── scripts/                  # Utility scripts
```

---

## Key Design Decisions

### Auth
- Cookie-based session via `authMiddleware` (sets `req.user` if session cookie present — optional)
- `req.user.id` used as DB scope for conversations
- Guests use `/api/openai/guest-chat` (streams, no DB writes)
- No auth gate — guests can chat forever; sign-in saves history

### Drizzle ORM
- **NO relational query API** — use only `db.select().from(...)` plain selects
- Use `and()` for compound WHERE clauses
- Use `and(eq(conversations.id, id), eq(conversations.sessionId, userId))` for ownership checks

### SSE Streaming
- Format: `data: {content}` chunks → `data: {done: true}`
- Frontend uses `fetch` + `ReadableStream`, NOT `EventSource`
- Both hooks expose `stopStreaming()` via `AbortController`

### API Client
- Generated hooks from OpenAPI spec via Orval
- For endpoints not in spec (e.g. PATCH rename, generate-title), use raw `fetch` with `credentials: "include"`
- `getGetOpenaiConversationQueryKey(id)` — invalidate to refresh header title

---

## Chatbot Features

### Welcome Page (`/`)
- Ken Burns background animation (`/images/seed-resort-bg.png`, `objectPosition: "65% 50%"`)
- Glassmorphism overlays + vignette pulse
- "Start a Conversation" CTA → creates conv (auth) or routes to `/chat` (guest)
- "Reserve Your Stay" link → `https://legendary-manatee-c69f26.netlify.app/`
- Feature strip badges (privacy, guest access, sign-in perk)
- Quick request chips (4 suggestions) → auto-send when clicked

### Authenticated Chat (`/c/:id`)
- Full conversation history from DB
- Auto-title generation after first exchange (`POST /conversations/:id/generate-title`)
- Inline title editing (click pencil → save with Enter/✓ or cancel with Esc/✗)
- Stop generation button (square icon, appears during streaming)
- Character counter (appears > 150 chars, turns red > 1800)
- "Aria is thinking…" animated indicator in header
- `PATCH /conversations/:id` endpoint for renaming

### Guest Chat (`/chat`)
- In-memory messages only, no DB writes
- Streaming via `/api/openai/guest-chat`
- Timestamps on messages, copy button on AI responses
- "Sign in to save" nudge in header
- Same stop button + character counter as auth'd chat
- Auto-send from `?init=` query param

### Sidebar
- Date-grouped conversations: Today / Yesterday / This Week / Older
- Search bar (appears when > 2 conversations)
- Delete button on hover per conversation
- ⌘K badge on "Start New Request" button
- Guest panel with sign-in prompt when not authenticated
- User profile + logout footer when authenticated

### Chat Bubble (`ChatBubble` component)
- "A" green-gradient avatar for Aria (not a building icon)
- User avatar (User icon in muted bg)
- Relative timestamps (just now / Xs ago / Xm ago)
- Copy button on hover for AI messages (toast confirmation)
- Animated typing dots for streaming state
- `react-markdown` rendering for AI messages with prose styling

### Keyboard Shortcut
- `Cmd+K` (Mac) / `Ctrl+K` (Windows): new conversation (or route to `/chat` for guests)

---

## Design Tokens

- **Primary green**: `#52b788` (sage green)
- **Dark green**: `#2d6a4f`
- **Background**: dark charcoal (`bg-background`)
- **Headings font**: `Georgia, Times New Roman, serif`
- **Aria gradient**: `linear-gradient(135deg, #2d6a4f 0%, #52b788 100%)`
- **Brand gradient**: `linear-gradient(135deg, #a7f3d0 0%, #52b788 45%, #95d5b2 100%)`

---

## GitHub Push (Pending)

GitHub OAuth was dismissed during setup. To push to GitHub:

```bash
git remote add github https://<your-token>@github.com/<username>/<repo>.git
git push github master
```

---

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` (`composite: true`). Root `tsconfig.json` lists all packages as project references.

- **Always typecheck from the root**: `pnpm run typecheck`
- **`emitDeclarationOnly`** — JS bundling is handled by esbuild/vite
- Run codegen: `pnpm --filter @workspace/api-spec run codegen`

## Root Scripts

- `pnpm run build` — typecheck then recursive build
- `pnpm run typecheck` — `tsc --build --emitDeclarationOnly`
