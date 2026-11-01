# AGENTS.md

## Stack

- Vue 3 (JavaScript, `<script setup>`), Vite 4, Pinia, Vue Router 4, Firebase 9 (Auth + Realtime Database), SCSS. No TypeScript.
- Firebase Hosting SPA: project `clinky-dfd84` (`.firebaserc`), build output `dist/`, catch-all rewrite to `index.html`.
- UI copy, comments, and commit messages are Russian; keep user-facing strings Russian.

## Commands

- Install: `npm install` at the repo root.
- `npm run dev` — Vite dev server.
- `npm run build` — production build to `dist/`.
- `npm run preview` — serve the built `dist/`.
- `npm run lint` — ESLint **with `--fix`**; it rewrites files. Style: single quotes, semicolons, trailing commas.
- `npm run format` — Prettier, `src/` only.
- `npm run deploy` — build + `firebase deploy` (requires Firebase CLI login). `deploy:auth` forces re-login first.
- No test runner, typecheck, or CI. Verify changes with `npm run lint` then `npm run build`.
- `.env` is gitignored and required by Firebase: `VITE_API_KEY`, `VITE_AUTH_DOMAIN`, `VITE_PROJECT_ID`, `VITE_STORAGE_BUCKET`, `VITE_MESSAGING_SENDER_ID`, `VITE_APP_ID`, `VITE_DB_URL`.
- On this Windows host PowerShell blocks `npm.ps1`; use `npm.cmd run ...` if `npm` fails with `UnauthorizedAccess`.

## Entrypoints and structure

- `index.html` → `src/app/main.js`: creates the app, installs Pinia/router, registers global `App*` components from `src/shared/ui`, initializes Firebase.
- Aliases (`vite.config.js`): `@` → `src`, plus `@app`, `@pages`, `@features`, `@shared`; `~` → repo root.
- Canonical tree: `src/app` (entry, router, layouts, global SCSS), `src/pages` (route components), `src/features/<domain>/ui` (feature UI re-exported from `src/features/<domain>/index.js`), `src/shared` (`ui`, `api`, `lib`, `config`).
- Also live: `src/stores` (Pinia), `src/middlewares` (route guards), `src/mocks` (news fixtures), `src/firebase` (Firebase init), `src/common` (composables/constants), `src/assets` (icons/SCSS).
- Routes: `src/app/router/routes.js`. `meta.layout: 'Main'` resolves to `src/app/layouts/MainLayout.vue`; `meta.middlewares` run in order through `src/middlewares/middlewarePipeline.js`.
- Guards: `isLoggedIn` checks Firebase Auth; `hasCurrenciesAccess` checks RTDB `permissions/features/currencies/{uid}` and redirects to `/app`. Protect new routes via `meta.middlewares`.

## Migration trap: check the import before editing

The repo is mid-migration; old and new trees coexist and both are imported:

- Live new-tree files still import legacy code, e.g. `features/links/ui/TheCardBox.vue` → `@/modules/app/...`, `CountdownTimer.vue` → `@/modules/app/form/FormEditTimer.vue`, many components → `@/common/...` and `@/assets/icons/...`.
- `src/services/*` and `src/shared/api/*` are near-identical copies. Stores use `@/services`; currencies/permissions/navigation use `@/shared/api`. Grep the import path first and edit the copy actually used; update both only when behavior must change everywhere.
- `src/views`, `src/layouts`, `src/router` are orphaned older versions of `src/pages`, `src/app/layouts`, `src/app/router` — editing them has no runtime effect.
- `src/shared/config/firebase/firebase.config.js` and `src/assets/scss/*` are unused duplicates; the live config is `src/firebase/firebase.config.js`, the live styles are `src/app/styles/*`.
- Only `angle-down.svg` exists in `src/shared/assets/icons`; most icon imports use `src/assets/icons`.

## Data and Firebase

- `FirebaseClient` wraps Realtime Database; services are singleton classes extending it.
- Main RTDB paths: `users/{uid}/links`, `users/{uid}/attention/*`, `users/{uid}/storage`, `users/{uid}/timer`, `currencies/ecurrency/monthly/{YYYY-MM}`, `permissions/features/currencies/{uid}`.
- `localStorage['auth-key']` stores the Firebase **uid**, not an ID token; token helpers exist in both `src/services` and `src/shared/api`.
- `$get()` returns `{}` for missing RTDB nodes.
- `currencies-service` calls external URLs directly (BlackBit via a Cloudflare Worker, plus `cbr-xml-daily.ru`); the `/api/blackbit` proxy in `vite.config.js` is not used by current code.
- News is mock-only (`src/mocks/news.js`); there is no news backend.
- `functions/` contains only `node_modules` and a lockfile — no source or `package.json`; `firebase.json` configures hosting only. Do not assume Cloud Functions exist.

## Styling and tooling quirks

- `vite.config.js` auto-injects `rem()`, SCSS variables, and mixins into every `<style lang="scss">`; do not re-import abstracts.
- SVGs are imported as Vue components (`vite-svg-loader` default import): `import IconX from '@/assets/icons/x.svg'`, then `<icon-x />`. SVGO rewrites fills/strokes to `currentColor`.
- `vue-i18n` is installed but never initialized in `main.js`; do not assume translation helpers.
- Pre-existing build warnings (do not chase): SVG loader warns that `addAttributesToSVGElement` is not part of `preset-default`; Rollup warns about a circular chunk for `useLinksStore` re-exported via `src/stores/index.js`.
