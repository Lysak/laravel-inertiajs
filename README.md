# Laravel InertiaJS (Coffee Shop)

Цей репозиторій містить застосунок у папці `coffee-shop/`.

## Швидкий старт (локально)

```bash
cd coffee-shop
nvm use
composer setup
php artisan db:seed
composer dev
```

## Покроково (якщо запускаєш вперше)

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

## Тестові акаунти

- `admin@example.com` / `password`
- `barista@example.com` / `password`

## Що запускає `composer dev`

- Laravel server (`php artisan serve`)
- Queue worker (`php artisan queue:listen`)
- Логи (`php artisan pail`)
- Vite dev server (`pnpm run dev`)

Після запуску відкрий: `http://127.0.0.1:8000`
