

# Screenshot API Admin Panel — Implementation Plan

## Overview
Build a full admin panel SPA with authentication, dashboard analytics, user settings, subscription plans, and developer tools. All API calls go to your Fastify backend at `http://localhost:400`.

## Architecture

```text
src/
├── lib/
│   └── api.ts                  # Axios/fetch wrapper, base URL, auth headers
├── contexts/
│   └── AuthContext.tsx          # Auth state, login/logout, token management
├── components/
│   ├── layout/
│   │   ├── AppLayout.tsx        # SidebarProvider + header + outlet
│   │   └── AppSidebar.tsx       # Sidebar nav (Dashboard, Settings, Billing, Dev)
│   ├── dashboard/
│   │   ├── KpiCards.tsx         # Total requests, success rate, errors, latency
│   │   └── ApiChart.tsx         # Recharts area/line chart (success/error over time)
│   ├── settings/
│   │   └── ProfileForm.tsx      # Update name, email, avatar
│   ├── subscription/
│   │   └── PlanCard.tsx         # Single plan card component
│   └── developer/
│       ├── ApiKeySection.tsx    # Create/revoke API keys
│       └── WebhookSection.tsx   # Add/edit/delete webhooks
├── pages/
│   ├── auth/
│   │   ├── Login.tsx            # Email/password + OAuth buttons
│   │   └── Register.tsx         # Signup form
│   ├── Dashboard.tsx            # KPI cards + chart with 7/14/30d toggle
│   ├── Settings.tsx             # Profile form
│   ├── Subscription.tsx         # 3 plan cards
│   └── Developer.tsx            # API keys + webhooks
└── App.tsx                      # Routes with auth guards
```

## Step-by-step Plan

### 1. API Client & Auth Context
- Create `src/lib/api.ts` — fetch wrapper with `http://localhost:400` base URL, auto-attaches auth token from localStorage
- Create `AuthContext` — manages user state, exposes `login`, `register`, `logout`, `loginWithProvider` (Google/GitHub via better-auth)
- Protected route wrapper that redirects unauthenticated users to `/login`

### 2. Auth Pages (Login & Register)
- `/login` — email/password form + OAuth provider buttons (Google, GitHub)
- `/register` — name, email, password form + OAuth buttons
- Both use Shadcn Card, Input, Button, Form with zod validation
- On success, store token and redirect to `/dashboard`

### 3. App Layout with Sidebar
- Shadcn Sidebar with nav items: Dashboard, Settings, Subscription, Developer
- Header with SidebarTrigger + user avatar dropdown (logout)
- Uses `<Outlet />` for page content

### 4. Dashboard Page
- **KPI Cards** — 4 cards showing total requests, success count, error count, avg latency (fetched from backend)
- **API Chart** — Recharts area chart with success/error lines, toggle buttons for 7/14/30 day ranges
- Data fetched via React Query from your backend endpoints

### 5. Settings Page
- Profile form (name, email, avatar URL) with react-hook-form + zod
- Calls `PATCH /api/user/profile` on your backend

### 6. Subscription Page
- 3 pricing plan cards (e.g., Free / Pro / Enterprise) with feature lists
- Highlight current plan, CTA buttons to upgrade/downgrade
- Calls your backend for plan selection

### 7. Developer Page
- **API Keys section** — list existing keys, create new key (shows once), revoke keys
- **Webhooks section** — list webhooks, add webhook (URL + events), edit/delete
- Both backed by your Fastify API endpoints

## Technical Details
- **HTTP client**: Native fetch with a thin wrapper (no new dependency needed)
- **State management**: React Query for server state, React Context for auth
- **Charts**: Recharts (already installed)
- **Forms**: react-hook-form + zod (already installed)
- **Routing**: react-router-dom with nested routes under the layout
- **Auth tokens**: Stored in localStorage, attached via Authorization header
- **better-auth OAuth**: Opens provider URL from backend, handles callback redirect

