# Polsk Rubber Bridge

Single-table Butler-style contract bridge scoring app. Each board compares actual result versus an HCP-based datum, then converts the difference to WBF IMPs.

## Tech Stack

- React + TypeScript + Vite
- Tailwind CSS
- Zustand
- Vitest + React Testing Library

## MVP Scope (Current)

- Single-board entry flow
- Manual declaring HCP input (0-40)
- Datum schema selection (Modern and Classic)
- Duplicate bridge score calculation with vulnerability and X/XX
- IMP conversion via WBF table
- NS perspective normalization for actual score storage

Supabase persistence and Claude hand recognition are intentionally out of scope in this first implementation slice.

## Development

```bash
npm install
npm run dev
```

## Run a Local Test Server

Use the Vite dev server for quick manual testing:

```bash
npm run dev
```

Then open http://localhost:5173 in your browser.

If you want to test the production build locally instead:

```bash
npm run build
npm run preview
```

## Test and Build

```bash
npm run test
npm run test:run
npm run coverage
npm run build
```

## Render.com Support

The project includes [render.yaml](render.yaml) for static site deployment.

Render settings used:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Node version: `22`

Deploy options:

1. Connect the repository in Render and let it auto-detect [render.yaml](render.yaml).
2. Or create a Static Site manually with the same build and publish settings.
