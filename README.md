# NourishLog

Calorie tracking app built with Next.js 16, React 19, TypeScript, Tailwind CSS 4, and shadcn/ui.

You search for a dish, get the calorie breakdown from USDA data, and add it to your daily log. There's a dashboard that shows your running total against a 2000 kcal goal. Supports dark/light mode and English/Spanish.

## Setup

```bash
pnpm install
cp .env.example .env.local   # set NEXT_PUBLIC_API_BASE_URL
pnpm dev
```

Requires Node 20+ and pnpm 9+.

Set `NEXT_PUBLIC_API_BASE_URL` to point at the backend. If you leave it empty, the app runs entirely on mock data for local dev. When the URL is set, mocks are never used and errors propagate directly.

```bash
pnpm dev          # dev server
pnpm build        # production build
pnpm lint         # eslint
pnpm type-check   # tsc --noEmit
pnpm test         # vitest (single run)
```

## Architecture Decisions

### State Management (Zustand)

Two stores, both persisted to localStorage via Zustand's `persist` middleware.

`authStore` holds the token, user profile, and an `isAuthenticated` flag. It also tracks a `_hasHydrated` boolean using `onRehydrateStorage` so that auth guard hooks can wait for localStorage to rehydrate before deciding whether to redirect. Without this, you get a flash where the user briefly sees the login page on hard refresh even though they're logged in.

`mealStore` keeps the meal entries array and a computed `totalCalories`. Persisted so the log survives refreshes. Has `addMeal`, `removeMeal`, and `clearMeals` (called on logout).

### Why Both localStorage and a Cookie for Auth

This was a deliberate choice. The token lives in two places because they serve different purposes:

localStorage (via Zustand) is what the client reads. Components subscribe to `isAuthenticated`, the API layer grabs the token for `Authorization: Bearer` headers, and the auth guard hooks check expiry. It's reactive and fast.

The cookie (`auth-token`) exists purely for server-side route protection. `proxy.ts` (which replaces the deprecated Next.js middleware) runs before the page renders and checks this cookie. If you're not authenticated and you hit `/dashboard` or `/calories`, you get redirected to `/login` before any client JS even loads. Similarly, if you're already logged in and navigate to `/login` or `/register`, you get bounced to `/calories`.

So the proxy handles the "don't even load the page" case, and `useAuthGuard` handles the client-side case (token expired mid-session, etc). Both are needed because the proxy can't check JWT expiry (it just checks cookie existence), and the client guard can't prevent the initial server render.

### JWT Handling

Tokens are valid for 1 hour. I decode the payload with `atob` (no library needed) and check the `exp` claim with a 30-second buffer so we don't make requests with a token that's about to expire. On 401 from the API, the client auto-clears everything and does a hard redirect to `/login` via `window.location.href` since we might be outside React router context at that point.

### Routing

App Router. Most pages are client components because they need auth state, i18n, or interactivity. The exceptions are `layout.tsx` (server component for metadata and fonts) and `dashboard/page.tsx` (server component that just exports metadata and renders a client `DashboardContent`).

Protected routes: `/dashboard`, `/calories`
Auth routes: `/login`, `/register` (redirect away if already logged in)

### API Layer

`src/lib/api.ts` has a `withFallback` wrapper. If `NEXT_PUBLIC_API_BASE_URL` is set, it calls the real backend and that's it. If the env var is empty, it uses the mock implementation. There's no "try real then fall back to mock" behavior. It's one or the other.

`apiRequest` is the core fetch wrapper. It attaches the auth header, handles 401 auto-logout, and extracts error messages from JSON responses (the backend returns either `message` or `detail` on errors).

### Backend Contract

```
POST /auth/register  { firstName, lastName, email, password } -> { message, token }
POST /auth/login     { email, password }                      -> { token }
POST /get-calories   { dish_name, servings }                  -> { dish_name, servings, calories_per_serving, total_calories, source }
```

The backend doesn't return a user object on login/register, just a token. So the client constructs a `UserProfile` from the request data (email, and firstName/lastName on register). This gets stored in the auth store.

### Forms and Validation

React Hook Form with Zod v4. The validation schemas in `validations.ts` mirror what the backend expects: dish names allow letters, numbers, spaces, hyphens, commas, apostrophes (1-100 chars), servings between 0.1 and 1000. All inputs have `aria-invalid`, `aria-describedby`, and error messages use `role="alert"`.

### i18n

Rolled my own instead of pulling in next-intl or similar. It's a React context provider with JSON locale files (`src/locales/en.json`, `es.json`). Every user-facing string goes through `t()`. The language switcher in the header shows full language names ("English", "Espanol"). Kept it simple since we only need two languages.

### Error Handling

Three layers:

The API layer throws a typed `ApiError` with `message` and `status`. 401s trigger auto-logout and redirect.

The form layer uses `toErrorMessage(t, err)` from `errors.ts`. It checks if the backend sent a message and uses that directly. If not, it maps the status code to an i18n key (404 -> "Dish not found", 429 -> "Too many requests", etc). This way errors are localized.

The UI layer has error boundaries on `/dashboard`, `/calories`, and a global `global-error.tsx` to catch rendering crashes.

### Styling

Tailwind CSS 4 with shadcn/ui components. Mobile-first: inputs are `h-12` on mobile for touch targets, `sm:h-10` on desktop. Used semantic HTML throughout (`section`, `nav`, `fieldset`, `dl`, `aside`, proper `aria-label` attributes).

## Assumptions

- Backend uses camelCase (`firstName`, `lastName`), not snake_case
- JWT has a standard `exp` claim
- Backend returns `{ message }` or `{ detail }` on errors
- USDA calorie data comes from the backend, not fetched client-side
- Daily goal is 2000 kcal, hardcoded (not user-configurable)

## What I Would Improve With More Time

- Server-side calorie lookup (route handler or server action) to keep the API key off the client
- Per-user configurable daily goal
- Date-based meal history instead of one flat list
- Optimistic UI for meal add/remove
- E2E tests with Playwright
- Rate limiting on the proxy
- Refresh token flow instead of hard logout on expiry
- PWA support for offline meal logging

## CI/CD

GitHub Actions runs lint, type-check, test, and build on push/PR to `main`. Deployed to Vercel with automatic deploys on push to `main`.
