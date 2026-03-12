# Laravel InertiaJS (Coffee Shop)

This repository contains the application in the `coffee-shop/` directory.

## Quick Start (Local)

```bash
cd coffee-shop
nvm use
composer setup
php artisan db:seed
composer dev
```

## Step by Step (First Run)

```bash
cd coffee-shop
nvm use
composer install
pnpm install
cp .env.example .env
touch database/database.sqlite
php artisan key:generate
php artisan migrate
php artisan db:seed
composer dev
```

```
sudo rm -R ./node_modules
sudo rm -R ./package-lock.json
sudo rm -R ./pnpm-lock.yaml
sudo rm -R ./yarn.lock
sudo rm -R ./yarn-error.log
sudo rm -R ./.pnpm-store
corepack use pnpm@latest-10
```

## Test Accounts

- `admin@example.com` / `password`
- `barista@example.com` / `password`

## What `composer dev` Starts

- Laravel server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Logs (`php artisan pail`)
- Vite dev server (`pnpm run dev`)

After startup, open: `http://127.0.0.1:8000`
