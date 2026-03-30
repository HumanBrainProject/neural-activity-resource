# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout

All application code lives in `apps/nar-v3/`. The repo root contains only CI/CD configuration (`.gitlab-ci.yml`, `.github/workflows/`).

## Commands

All commands run from `apps/nar-v3/`:

```bash
npm run dev        # start Vite dev server
npm run build      # production build
npm run lint       # ESLint (0 warnings allowed)
npm test           # run all tests (requires EBRAINS KG connectivity for "KG" tests)
npm run testci     # run tests that don't require KG connectivity (CI-safe)
npm run coverage   # test coverage
```

Run a single test file or filter by name:
```bash
npx vitest __tests__/utility.test.js
npx vitest --grep "test name pattern"
```

## Authentication in development

The app uses Keycloak/EBRAINS IAM OAuth. To authenticate in dev mode, copy `apps/nar-v3/.env.local.example` to `apps/nar-v3/.env.local` and paste a valid EBRAINS IAM token as `VITE_DEV_TOKEN`. The dev server will use it automatically — no edits to `main.jsx` needed. `.env.local` is gitignored. Tests that require live KG access have "KG" in their name and are skipped by `testci`.

## Architecture

The app is a React SPA that provides a browsable interface to neural activity datasets stored in the **EBRAINS Knowledge Graph (KG)**. Users can explore datasets, subjects, slices, patched cells, and electrophysiology recordings.

### Data flow

```
React Router v6 loader
  → datastore.js (fetch + in-memory cache)
  → KG Core API v3 (https://core.kg.ebrains.eu/v3)
  → openMINDS-formatted JSON-LD responses
```

Route loaders (in `src/routes/`) fetch data before rendering. `datastore.js` wraps all KG API calls with caching. `queries.js` and `queryLibrary.js` build the KG query payloads.

### Graph database with hierarchical views

The underlying data is a graph database (the EBRAINS KG). The current dataset views impose a particular hierarchical traversal of that graph, but this is just one perspective — future views may root themselves at different nodes (e.g. a recording-centric or subject-centric view).

For patch clamp, the graph path from dataset to recordings looks like:

```
Dataset
  └── StudiedSpecimen (Subject)
      └── StudiedState
          └── SlicePreparation → Slice(s)
              └── CellPatching → PatchedCell(s)
                  └── RecordingActivity / StimulationActivity
                      └── DataFile(s)
```

For other electrophysiology modalities, there may be one or more intermediate Activities whose output is another StudiedState (rather than a final recording), before eventually reaching the RecordingActivity. The graph is not strictly a tree.

Each level of this hierarchy has a corresponding card component in `src/components/`.

### Auth and curator access

`auth.js` handles Keycloak login and checks whether the user has curator permissions. Curators see `IN_PROGRESS` stage data; regular users see only `RELEASED` data. This stage flag flows through `datastore.js` into every KG query.

### Key source files

- `src/main.jsx` — app entry, Keycloak init, dev token
- `src/routes/` — React Router route components with loaders
- `src/datastore.js` — KG API wrapper with caching
- `src/queries.js` / `src/queryLibrary.js` — KG query construction
- `src/auth.js` — Keycloak authentication
- `src/components/` — display components (one per hierarchy level)

## Docker & deployment

Two-stage Docker build: Node 20 for `npm run build`, then Nginx alpine to serve the static output on port 8080 as a non-root user. GitLab CI pushes `:prod` (main branch) or `:dev` (development branch) to `docker-registry.ebrains.eu/neuralactivity/nar-app-v3`.
