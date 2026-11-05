# lang.trending

A daily-updated static site that ranks programming languages by the number of new public GitHub repositories created within a rolling one-year window — across three inclusive star tiers: **≥2 stars**, **≥20 stars**, **≥100 stars** (repositories below 2 stars are deliberately out of scope) — plus a weighted composite that folds the three tiers into one score (weights 1×/2×/4×, derived from the same counts).

## How it works

Every build is a fresh measurement:

1. `astro build` computes the window — *today minus 365 days → today* (UTC), never hardcoded.
2. It queries the public GitHub search API once per language per star tier: 39 mainstream languages × 3 tiers = **117 requests**, paced at exactly the rate limit of the current mode — the dedicated 30 requests/minute with the CI's auto-injected `GITHUB_TOKEN` (~4.5 minutes), or the shared unauthenticated pool of 10 requests/minute (~12 minutes).
3. The counts are baked into fully static pages — no client-side data fetching, no committed data files.

Forks and mirrors are excluded from every query. The language catalog is hand-curated to common, mainstream languages only (see `src/lib/languages.ts`); niche and esoteric languages are intentionally out of scope. Rate-limit responses trigger retries with exponential backoff and whole-pipeline recovery rounds.

## Getting started

Requires Node.js ≥ 22.23.4 and pnpm.

```bash
pnpm install
pnpm build      # fetches live data (~12 min unauthenticated) and builds the site
pnpm preview    # serves the built site locally
```

`pnpm dev` also works, but re-fetches data once per dev-server session, so the first page request is slow.

Other checks:

```bash
pnpm typecheck
pnpm lint
pnpm format
```

## Deployment

`.github/workflows/deploy.yml` rebuilds and deploys to GitHub Pages every day at 00:37 UTC, on pushes to `main`, and via manual dispatch. The build step passes the auto-injected `GITHUB_TOKEN` so the fetch runs at the authenticated 30 requests/minute limit. The base path and site URL are configured through the `ASTRO_BASE` / `ASTRO_SITE` environment variables.

If the fetch fails, the build fails too — the previously deployed site simply stays online until the next successful build.

## Structure

```
src/lib/data.ts       build-time fetch pipeline (one run per build, shared by all pages)
src/lib/github.ts     throttled GitHub search client (10 req/min pacing, retries)
src/lib/window.ts     rolling one-year window computation
src/lib/languages.ts  the curated mainstream language catalog
src/pages/            index, methodology, 404
src/components/       UI — Astro components plus React islands, shadcn/ui
```

## License

[MIT](LICENSE)
