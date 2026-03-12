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
- For HTTP requests in Node/TypeScript code, do not use `axios`. Use the native `fetch()` available in Node v24 instead.
- React/Inertia: build UI through components first. Pages should orchestrate data and compose reusable components instead of owning large markup blocks directly.
- React/Inertia: shared UI must be reused, not copied. If the same table, card, form field group, section shell, or interaction pattern appears in more than one place, extract it into a component and use that component everywhere.
- React/Inertia: do not duplicate React UI code across pages or components. Put cross-page UI in `resources/js/Components` and page-scoped building blocks in a nearby `Components` or `Partials` folder.
- Use descriptive names by responsibility: `OrderService`, `CreateOrderMutation`, `OrdersQuery`, `Orders/Show.tsx`.
- Keep GraphQL types/queries/mutations in their dedicated folders.
- For GraphQL named type lookups used inside wrappers like `Type::nonNull(...)`, do not pass `GraphQL::type(...)` directly. Use a local typed helper that narrows the result to `Type&NullableType` (for example `nullableType('CreateDrinkInput')`) so static analysis stays correct.
- Always use dependency injection for services/classes; avoid `app(...)` service-locator calls in application code.

## Frontend Data Flow Rules
- This project intentionally uses Laravel + Inertia + React + Apollo Client + `rebing/graphql-laravel` to gain hands-on experience with that stack. Treat this as a project goal, not accidental complexity.
- Apollo Client + React against `rebing/graphql-laravel` is intentional in this project, even alongside Inertia. Do not propose removing Apollo, GraphQL Codegen, or the schema dump in favor of Inertia-only data flow unless explicitly requested.
- Inertia is responsible for page shell, routing, auth-bound pages, and initial page render.
- Apollo Client is responsible for GraphQL queries and mutations inside React components.
- Do not duplicate the same resource in both Inertia page props and Apollo cache on the same screen without a clear reason.

## Backend Architecture Rules
- For Inertia pages, keep controllers thin: authorize the request, call a dedicated application class, and return `Inertia::render(...)`. Do not place non-trivial Eloquent query building or business rules directly in controllers.
- Do not call GraphQL from Laravel web controllers or call controllers from GraphQL resolvers. Controllers, GraphQL resolvers, and REST endpoints are separate delivery layers over shared application logic.
- Prefer use-case classes over repository-per-model. Create a dedicated class per scenario instead of growing a large `OrderRepository`/`DrinkRepository`.
- Put read use cases in `coffee-shop/app/Queries/<Domain>/...` and write/state-changing use cases in `coffee-shop/app/Actions/<Domain>/...` when the logic is more than trivial or must be reused across delivery layers.
- Do not create `Queries`/`Actions` folders for every model up front. Add them when a real use case appears.
- Reuse by scenario, not by model name alone. If web, mobile, and GraphQL need the same data retrieval rules, share one query class. If they need different filters, pagination, or relation graphs, create separate use-case classes.
- Split shared data fetching from presentation shaping. Shared query classes should return domain models or raw result sets that multiple delivery layers can reuse; web-specific mapping for Inertia props should live in a separate presenter/query class on top of the shared fetcher.
- For presenter/query result contracts, prefer explicit DTO/value objects over large associative array shapes. Use array shapes only for very small, local, single-use payloads.
- Keep reusable query-building primitives close to the model only when they are small and generic, such as relationships, casts, and simple local scopes. Do not move screen-specific or endpoint-specific queries into the model.
- Use services/actions for business operations such as creating, paying, or cancelling orders. Do not duplicate business rules between controllers, GraphQL mutations, and future mobile/API flows.
- Prefer native PHP type hints first. Use PHPDoc for collection generics and array shapes that PHP cannot express natively. Do not replace PHPDoc typing with PHP attributes; attributes are only for framework/runtime metadata.

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
