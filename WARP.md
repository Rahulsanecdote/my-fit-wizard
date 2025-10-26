# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

Project overview
- Stack: Vite + React + TypeScript + Tailwind CSS + shadcn-ui + TanStack Query + Supabase Auth
- App type: Single Page App (SPA) served by Vite
- Node tooling: npm scripts, ESLint (flat config)

Essential commands
- Install dependencies
  - npm install
- Start the dev server (binds on port 8080)
  - npm run dev
- Build for production
  - npm run build
- Build with development mode flags (useful for faster iteration on prod build shape)
  - npm run build:dev
- Preview the built app locally
  - npm run preview
- Lint the codebase
  - npm run lint

Notes
- Port and host: Vite dev server is configured to listen on host "::" (IPv6) at port 8080. Open http://localhost:8080/
- Path alias: Import from src using the @ alias (configured in vite.config.ts and tsconfig paths). Example: import { Button } from "@/components/ui/button"
- TypeScript settings: Several strict options are disabled for app code (e.g., noImplicitAny=false). Node-side config (tsconfig.node.json) is stricter.
- Environment: Vite exposes variables prefixed with VITE_ via import.meta.env. Ensure any environment-specific values are provided via .env and are not inlined into commands.

High-level architecture
- Entry point and App shell
  - src/main.tsx mounts <App /> to #root (index.html)
  - src/App.tsx composes providers (TanStack Query, AuthProvider, shadcn toasters/tooltip) and BrowserRouter
- Routing
  - Defined in src/App.tsx using react-router-dom: "/" → Index, "/auth" → AuthPage, "/dashboard" → Dashboard, catch-all → NotFound
  - Index page redirects users based on auth state to /dashboard or /auth
- Authentication (Supabase)
  - Supabase client: src/integrations/supabase/client.ts
  - Auth context: src/contexts/AuthContext.tsx provides { user, session, loading, signUp, signIn, signOut }
  - Auth flow:
    - App bootstraps auth by listening to supabase.auth.onAuthStateChange and calling supabase.auth.getSession()
    - Index page gates initial navigation; AuthPage handles sign-in/sign-up; Dashboard expects an authenticated user
- Data fetching and caching
  - TanStack Query’s QueryClientProvider is set at the root; use useQuery/useMutation in feature code
- UI system
  - Component library lives under src/components/ui (shadcn-style primitives) and src/components/layout for app scaffolding
  - Design tokens and themes are defined in src/index.css (CSS variables in HSL), wired via Tailwind
- Styling
  - Tailwind configured in tailwind.config.ts; PostCSS in postcss.config.js
  - Global styles and tokens in src/index.css; custom animations, gradients, and shadows are in Tailwind theme extensions
- Utilities and hooks
  - Common helpers in src/lib (e.g., utils.ts with cn)
  - App hooks in src/hooks (e.g., use-toast)

Testing
- No test framework is configured in this repo at present; there are no npm scripts for test execution.

Tooling details
- Build tooling
  - Vite config: vite.config.ts (uses @vitejs/plugin-react-swc, sets server host/port, and defines @ alias)
  - In development mode, the lovable-tagger plugin is enabled
- Linting
  - ESLint flat config at eslint.config.js with typescript-eslint, react-hooks, and react-refresh rules; dist/ is ignored

Readme highlights
- README.md contains Lovable project links and quickstart (npm i, npm run dev)
- Deployment and editing can also be performed via the Lovable platform; changes made there auto-commit back to this repo

Operational tips for Warp
- When modifying imports, prefer the @ alias to avoid deep relative paths
- For routes, add new <Route> entries in src/App.tsx above the catch-all route
- For authenticated views, consume useAuth() from AuthContext and handle loading state consistently with existing pages

