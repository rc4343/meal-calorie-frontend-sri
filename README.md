# NourishLog

Calorie tracking frontend built with Next.js 16, React 19, and TypeScript.

Users can search dishes, see calorie breakdowns (USDA data), and keep a daily meal log. Supports dark mode and English/Spanish.

## Setup

```bash
pnpm install
pnpm dev
```

Requires Node 20+ and pnpm 9+.

## Environment

Copy `.env.example` to `.env.local`. The only variable is `NEXT_PUBLIC_API_BASE_URL` — leave it empty to use the built-in mock API. When set, the app tries the real backend first and falls back to mock if the server is unreachable.

## Scripts

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # eslint
pnpm type-check   # tsc --noEmit
pnpm test         # vitest (single run)
```

## API

The backend (when available) should expose:

- `POST /register` — `{ first_name, last_name, email, password }` → `{ token, user }`
- `POST /login` — `{ email, password }` → `{ token, user }`
- `POST /get-calories` — `{ dish_name, servings }` → `{ dish_name, servings, calories_per_serving, total_calories, source }`

Auth uses JWT. The client attaches `Authorization: Bearer <token>` to all requests and auto-logs out on 401.

## Key decisions

- **State**: Zustand. Auth store persists to localStorage, meal store is session-scoped (resets on refresh).
- **Routing**: App Router. Protected routes (`/dashboard`, `/calories`) are guarded by middleware checking an `auth-token` cookie.
- **Forms**: React Hook Form + Zod v4 for validation.
- **i18n**: Custom context-based provider with JSON locale files (`src/locales/`). No external i18n library.
- **API fallback**: `withFallback()` pattern in `src/lib/api.ts` — tries real endpoint, catches network errors, falls back to mock. Proper API errors (4xx/5xx) are not caught.
- **Styling**: Tailwind CSS 4 + shadcn/ui components.

## CI

GitHub Actions runs lint, type-check, test, and build on push/PR to `main`.

## Deploy

Connected to Vercel. Deploys automatically on push to `main`.
