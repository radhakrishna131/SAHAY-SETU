# Workers Community

Workers Community is a professional network and discovery marketplace for skilled workers to find jobs, meet trade communities, and access tools and equipment.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/workers-community` — React/Vite frontend and route-level UI
- `artifacts/api-server/src/routes` — Express API route handlers
- `lib/api-spec/openapi.yaml` — source of truth for API contracts
- `lib/db/src/schema/marketplace.ts` — Drizzle tables for the first discovery surfaces
- `lib/api-client-react/src/generated` — generated React Query hooks
- `lib/api-zod/src/generated` — generated request/response validation

## Architecture decisions

- The first product slice is a modular monolith: one shared Express API, one React app, and PostgreSQL-backed discovery tables.
- OpenAPI is the contract boundary; frontend hooks and server validation are generated from `lib/api-spec/openapi.yaml`.
- Public discovery pages are backed by database reads and seeded development records, not frontend-only arrays.
- The interface follows the supplied Workers Community reference direction with a teal workwear palette, warm neutral surfaces, and amber emphasis.

## Product

- Public home discovery with live counts and featured jobs, products, rentals, and communities.
- Searchable jobs, workers, tools, equipment rentals, and communities.
- Job detail, dashboard, login, and registration entry points are scaffolded for the next authentication and workflow increments.

## User preferences

No additional preferences recorded.

## Gotchas

- Run API codegen after changing `lib/api-spec/openapi.yaml`.
- The web artifact expects workflow-provided `PORT` and `BASE_PATH`; use the managed workflow for preview.
- API requests should use the shared `/api` proxy path rather than hardcoded service ports.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
