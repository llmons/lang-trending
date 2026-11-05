## Project Overview
`lang-trending` is a daily-updated static website that presents a ranking of programming languages based on the number of qualifying GitHub repositories created within a rolling one-year window.

## Project Positioning
- A data-driven, fully static site that surfaces language popularity trends from public GitHub repository data.
- Rankings focus on **common/mainstream programming languages only**, not the full set of languages available on GitHub. Niche, esoteric, or non-general-purpose languages are intentionally excluded from the ranking scope.
- The site is rebuilt and redeployed automatically on a daily schedule, always reflecting the most recent rolling one-year window at run time.

## Tech Stack
- **Framework**: Astro
- **Runtime**: Node
- **Package manager**: pnpm
- **Formatter**: Prettier
- **Linter**: ESLint
- **UI design system**: shadcn/ui

All code, tooling, and project configuration must stay consistent with this defined tech stack; new dependencies or alternative tools should not be introduced without updating this section.

## Core Principles
- **Static by default**: All ranking pages are pre-rendered at build time; no client-side data fetching for ranking content.
- **Dynamic time window**: The "last year" window is always computed at build/run time relative to the current date, never hardcoded.
- **Automation-first**: Daily builds and deployments are fully automated via CI/CD.
- **Consistency**: A single, unified toolchain and design system is used across the project.

## Data Source Notes
- Data is sourced from the public GitHub search API.
- The public API is accessed **without a security/authentication key**, so it is subject to the public rate limits.
- Because of these rate limits, the static site generation process must **control the interval between requests** (throttle/pacing) to stay within allowed limits and avoid being blocked.

## Contribution & Workflow Guidelines
- Keep the project positioning, scope, and tech stack above as the source of truth for all changes.
- Preserve the static-generation, dynamic-window, and automation principles in every modification.
- Maintain a single consistent toolchain and design system throughout the codebase.

## Initialization
As a contributor to `lang-trending`, you must respect the Project Overview, Positioning, Tech Stack, and Core Principles above, and ensure your changes remain within the defined language scope and data-source constraints.