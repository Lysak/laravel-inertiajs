# Project Structure Plan and Initial Configuration

Date: 2026-02-12

## 1) Directory Structure (After Laravel Initialization)
```
app/
  GraphQL/
    Inputs/
    Mutations/
    Queries/
    Types/
  Http/
    Controllers/
  Models/
  Services/
config/
  graphql.php
resources/
  js/
    Pages/
    Components/
routes/
  web.php
  graphql.php
```

## 2) Initial Setup Steps
1. Create the Laravel project (latest).
2. Add the Inertia.js + React preset.
3. Add `rebing/graphql-laravel`.
4. Configure pnpm for the frontend.
5. Configure Biome.
6. Pin Node via nvm to the latest LTS/Stable version.

## 3) Configuration Files (Expected)
- `.nvmrc` — Node version
- `biome.json` — Biome configuration
- `package.json` — pnpm + scripts
- `vite.config.js` — React + Inertia
- `config/graphql.php` — rebing/graphql-laravel configuration
- `routes/graphql.php` — GraphQL endpoint

## 4) Initial Packages
### PHP
- laravel/framework (latest)
- rebing/graphql-laravel (latest)

### JS
- react, react-dom (latest)
- @inertiajs/react (latest)
- @inertiajs/inertia-laravel (latest)
- vite (latest)
- biome (latest)

## 5) Scripts (`package.json`)
- `dev`: start Vite
- `build`: production build
- `lint`: biome lint
- `format`: biome format

## 6) Minimal Pages (React)
- `Dashboard` — compact overview panel
- `Orders/Index` — order list
- `Orders/Show` — order details
- `Drinks/Index` — drinks list

## 7) Next Actions
1. Confirm Laravel initialization and the selected stack.
2. Create the base file and configuration structure.
3. Add the initial pages and routes.
