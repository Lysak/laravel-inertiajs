# Repository Guidelines

## Project Structure & Module Organization
This repository contains one active application in `coffee-shop/` (Laravel 12 + Inertia.js + React).

Key paths:
- `coffee-shop/app/`: backend code (`Http/Controllers`, `Models`, `Services`, `GraphQL/{Types,Queries,Mutations,Inputs}`)
- `coffee-shop/resources/js/`: frontend Inertia React code (`Pages`, `Components`, `Layouts`)
- `coffee-shop/routes/`: route definitions (`web.php`, `auth.php`, `graphql.php`)
- `coffee-shop/database/`: migrations, factories, seeders
- `coffee-shop/tests/Unit` and `coffee-shop/tests/Feature`: PHPUnit suites

## Build, Test, and Development Commands
Run commands from `coffee-shop/` unless noted.

- `nvm use`: switch to the Node version pinned in root `.nvmrc`
- `composer setup`: first-time bootstrap (installs deps, creates `.env`, migrates DB, builds assets)
- `composer dev`: start Laravel server, queue worker, logs, and Vite concurrently
- `pnpm dev`: run Vite only
- `pnpm build`: production frontend build
- `composer test`: clear config cache and run all PHPUnit tests
- `pnpm lint`: Biome lint for `resources/js`
- `pnpm format`: Biome auto-format for `resources/js`

## Coding Style & Naming Conventions
- PHP: follow Laravel conventions; format with `vendor/bin/pint` before PRs.
- TS/React: frontend code must use TypeScript only. New files should be `.ts`/`.tsx`; do not add `.js`/`.jsx` files. Biome rules apply (`4` spaces, single quotes, semicolons as needed, 100-char line width).
- React/Inertia: build UI through components first. Pages should orchestrate data and compose reusable components instead of owning large markup blocks directly.
- React/Inertia: shared UI must be reused, not copied. If the same table, card, form field group, section shell, or interaction pattern appears in more than one place, extract it into a component and use that component everywhere.
- React/Inertia: do not duplicate React UI code across pages or components. Put cross-page UI in `resources/js/Components` and page-scoped building blocks in a nearby `Components` or `Partials` folder.
- Use descriptive names by responsibility: `OrderService`, `CreateOrderMutation`, `OrdersQuery`, `Orders/Show.tsx`.
- Keep GraphQL types/queries/mutations in their dedicated folders.
- Always use dependency injection for services/classes; avoid `app(...)` service-locator calls in application code.

## Testing Guidelines
- Framework: PHPUnit (`php artisan test` / `composer test`).
- Unit tests go in `tests/Unit`; feature/integration tests in `tests/Feature`.
- Name tests by behavior, e.g., `CreateOrderMutationTest`, `ProfileUpdateTest`.
- Add tests for new GraphQL resolvers, service-layer logic, and auth/role-sensitive flows.

## Commit & Pull Request Guidelines
- Current git history only contains `Initial Commit`; no strict convention is established yet.
- Use short imperative commit messages (optionally Conventional Commits, e.g., `feat: add paid order mutation`).
- PRs should include: purpose, change summary, test evidence (`composer test`, `pnpm lint`), and screenshots/GIFs for UI updates.
- Link related tasks/issues and call out migrations or env changes explicitly.

## Security & Configuration Tips
- Never commit secrets; keep sensitive values in `coffee-shop/.env`.
- Use seeded local accounts from `README.md` for manual verification.
- If schema changes are introduced, include migrations and rollback-safe assumptions in the PR description.
