<!--
Guidance for AI coding agents working on this repository.
Focus: practical, discoverable rules and references so an agent can make small, safe changes.
-->

# Copilot / AI agent instructions — tttedt

Short, actionable notes an automated coding agent should follow when editing this repo.

1. Project purpose and run commands
   - This is a Vite + React (TypeScript) single-page app. Key scripts are in `package.json`: `npm run dev`, `npm run build`, `npm run preview`.
   - Environment: `GEMINI_API_KEY` is expected in environment vars (the repo uses Vite's `loadEnv` and sets `process.env.GEMINI_API_KEY` in `vite.config.ts`). For local dev create `.env.local` and add `GEMINI_API_KEY=...`.

2. High-level architecture
   - UI: components live under `components/` and `screens/` and follow a presentational/container split (e.g., `MainAppShell` composes many subcomponents).
   - State: global state uses `zustand` stores located in `store/` (e.g. `appStore.ts`, `userStore.ts`). Exports are re-exported from `store/index.ts`.
   - Data layer: the app uses React Query (`@tanstack/react-query`) for data caching and async flows. Look at `index.tsx` for QueryClient provider wiring.
   - Fake backend: `utils/api.ts` implements an in-browser fake API (mock data, FAKE_LATENCY). Many screens and components depend on these functions (e.g., `fetchProperties`, `toggleLike`, `sendMessage`). When changing shape of types, update `types.ts` and `utils/api.ts` together.

3. Service integrations & PWA
   - Service worker registration happens in `index.tsx` and the worker file is `sw.js`. Keep changes here minimal and verify registration logs via `utils/logger`.

4. Conventions & patterns to follow
   - Logging: use the `logger` helper (`utils/logger.ts`) for debug/info/error messages. Many components already call `logger.log`/`logger.error` — keep the pattern consistent.
   - Types: central types live in `types.ts`. Update these first when adding or changing data shapes; then fix callers and `utils/api.ts` mock implementations.
   - Mock data and mutation semantics: `utils/api.ts` simulates latency and random failures (~10% in some mutations). When adding network-like behavior, mirror this approach for realism.
   - Stores: follow existing store patterns — simple functions, minimal side-effects. When introducing derived selectors, prefer storing in the same store file.

5. Safe edit rules for automated changes
   - Do not remove or alter `GEMINI_API_KEY` handling in `vite.config.ts` unless adding an alternate env strategy; instead update `.env` usage if necessary.
   - Preserve PWA registration in `index.tsx`. If modifying, ensure `navigator.serviceWorker.register('./sw.js')` still runs on window `load`.
   - When changing public component APIs, update all usages across `components/` and `screens/` (search workspace for component name) — there are many tightly-coupled imports.

6. Tests / build checks
   - There are no tests in the repo. Run local build checks by running `npm install` then `npm run build` to validate TypeScript/Vite compilation.

7. Useful files to inspect for context (examples)
   - `vite.config.ts` — env wiring and alias (`@` -> project root)
   - `utils/api.ts` — fake backend behavior and mutation examples
   - `types.ts` — canonical type definitions used across components
   - `store/` — Zustand stores and exported hooks
   - `index.tsx` and `App.tsx` — app bootstrap, providers, and top-level routing/view switch logic

8. When in doubt
   - Make minimal, localizable changes and run `npm run dev` (or `npm run build`) to ensure no type or runtime errors.
   - Prefer editing mock APIs (`utils/api.ts` and `data/mockData.ts`) when adding features that require backend changes; this keeps the UI integrated during development.

If any part of the codebase is unclear, ask for guidance and point to specific files/lines you inspected.
