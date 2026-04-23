# Polsk Rubber Bridge

Polsk Rubber Bridge is a contract bridge scoring app focused on single-table Butler-style board scoring.
For each board, the app compares the actual score against an HCP-based datum and converts the difference to IMP.

## What the app includes

- Tournament mode
	- Create and manage tournaments
	- Configure boards per match (8-32)
	- Choose match format (VP or Carry-over IMP)
	- Choose datum schema (Modern or Classic)
- Just Play mode for quick one-off entry
- Board-by-board entry
	- Contract, declarer, result, vulnerability, and doubles
	- Manual NS HCP input (0-40)
	- Automatic board vulnerability helper
- Live scoring output
	- Datum (raw and rounded)
	- Actual score, diff, and IMP
	- Running IMP tally and VP summary
- Local persistence
	- Tournaments and matches are persisted via Zustand
	- Board entry state is saved in localStorage
- UI options
	- Danish and English language toggle
	- Light/Dark theme toggle
	- Mobile-friendly responsive layout

## Tech stack

- React 19 + TypeScript + Vite
- Zustand (with persist middleware)
- Tailwind CSS
- Vitest + React Testing Library
- vite-plugin-pwa

## Getting started

### Prerequisites

- Node.js 22 (matches Render deployment config)
- npm

### Install and run

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Scripts

- `npm run dev` - Start the Vite dev server
- `npm run build` - Type-check and create a production build
- `npm run preview` - Preview the production build locally
- `npm run lint` - Run ESLint
- `npm run test` - Run Vitest in watch mode
- `npm run test:run` - Run tests once
- `npm run coverage` - Run tests with coverage

## Testing

The repository contains unit tests for scoring utilities and component tests for UI flows.

```bash
npm run test:run
```

## CI

GitHub Actions is configured to run PR-only checks against `main`.

- Lint: `npm run lint`
- Tests: `npm run test:run`
- Coverage: `npm run coverage`

The workflow does not run on direct pushes to `main`.

## PWA behavior

The app is configured as a Progressive Web App using `vite-plugin-pwa`.

- Service worker auto-updates in production builds
- PWA is disabled during development (`NODE_ENV=development`)
- Manifest and icons are configured in `vite.config.ts` and `public/icons/`

## Deployment

`render.yaml` is included for static deployment on Render.

Configured values:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Node version: `22`

You can deploy by connecting the repo in Render and using the existing `render.yaml`.

## License

This project is licensed under the MIT License. See `LICENSE` for the full text.
