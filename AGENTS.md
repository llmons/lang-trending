## Project Overview
`lang-trending` is a daily-updated static website that presents a ranking of programming languages based on the number of qualifying GitHub repositories created within a rolling one-year window, across four star-threshold tiers (all repos, >10, >50, >100 stars).

## Project Positioning
- A data-driven, fully static site that surfaces language popularity trends from public GitHub repository data.
- Rankings focus on **common/mainstream programming languages only** — a hand-curated catalog of 29 in `src/lib/languages.ts` — not the full set of languages available on GitHub. Niche, esoteric, or non-general-purpose languages are intentionally excluded from the ranking scope.
- The site is rebuilt and redeployed automatically on a daily schedule (GitHub Actions → GitHub Pages), always reflecting the most recent rolling one-year window at run time.

## Tech Stack
- **Framework**: Astro — pages are `.astro`; interactive widgets (star-tier tabs, FAQ accordion, theme toggle) are React islands, all pre-rendered at build time
- **Runtime**: Node (>=22.23.4)
- **Package manager**: pnpm
- **Formatter**: Prettier
- **Linter**: ESLint
- **UI lib**: shadcn/ui (base-sera style, dark-first with a light theme)

All code, tooling, and project configuration must stay consistent with this defined tech stack; new dependencies or alternative tools should not be introduced without updating this section.

## Core Principles
- **Static by default**: All ranking pages are pre-rendered at build time; no client-side data fetching for ranking content. Tier switching is client-side, but the data for every tier is baked into the page at build time.
- **Dynamic time window**: The "last year" window is always computed at build/run time relative to the current date, never hardcoded.
- **Automation-first**: Daily builds and deployments are fully automated via CI/CD.
- **Consistency**: A single, unified toolchain and design system is used across the project.
- **No committed data files**: Every count is fetched fresh at build time. There is no data snapshot to maintain and the CI never pushes to the repository.

## Data Source Notes
- Data is sourced from the public GitHub search API. **No self-managed credentials**: CI uses the automatically injected `GITHUB_TOKEN` (dedicated 30 searches/min), local builds run unauthenticated (shared 10 searches/min per IP).
- The fetch runs **inside `astro build`** (top-level await in `src/lib/data.ts`, evaluated once per build and shared by all pages).
- One query per language per star tier: 29 languages × 4 tiers = **116 requests** per build (≈5 minutes authenticated in CI, ≈12 minutes unauthenticated locally).
- Pacing matches the mode's limit exactly — one request every 2s (authenticated) or 6s (unauthenticated). `403`/`429` responses trigger rate-limit waits (≥30s) and retries with exponential backoff; languages that still fail are retried in whole-pipeline recovery rounds after cooling down.
- If the fetch ultimately fails, the build fails too — the previously deployed site stays online until the next successful build. There is no stale-data fallback.

## Automation (CI/CD)
- `.github/workflows/deploy.yml` rebuilds and redeploys to GitHub Pages on a daily cron (`37 0 * * *` UTC), on pushes to `main`, and via manual dispatch.
- Pipeline: install → typecheck → lint → build (fetches + renders) → deploy-pages.
- Deploy base path and site URL are configurable via `ASTRO_BASE` / `ASTRO_SITE` environment variables (defaults in `astro.config.mjs`).

## Local Development
- Preferred: `pnpm build && pnpm preview` — the build fetches live data, so it takes ~12 minutes.
- `pnpm dev` re-fetches once per dev-server session; the first page request is slow.
- Checks: `pnpm typecheck`, `pnpm lint`, `pnpm format`.

## Contribution & Workflow Guidelines
- Keep the project positioning, scope, and tech stack above as the source of truth for all changes.
- Preserve the static-generation, dynamic-window, and automation principles in every modification.
- Maintain a single consistent toolchain and design system throughout the codebase.
- Product decisions (language catalog, star tiers, window) are reflected in user-facing copy — keep the methodology page, FAQ, and insight cards in sync with code changes.

## Initialization
As a contributor to `lang-trending`, you must respect the Project Overview, Positioning, Tech Stack, and Core Principles above, and ensure your changes remain within the defined language scope and data-source constraints.
