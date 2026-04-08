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

```
 Тут ланцюжок такий:

  database / Eloquent -> PHP GraphQL query classes -> schema.graphql -> GraphQL Codegen -> resources/js/graphql/generated/graphql.ts ->
  Dashboard.tsx

  Звідки генерується graphql.ts

  1. Бекенд описує GraphQL-схему через PHP-класи, зареєстровані в config/graphql.php.
  2. Команда php artisan graphql:schema-dump з routes/console.php дампить цю схему у resources/graphql/schema.graphql.
  3. Далі graphql-codegen бере:
      - схему з codegen.ts
      - frontend-документи з resources/js/graphql/documents/**/*.graphql
  4. І генерує файли в resources/js/graphql/generated/graphql.ts та resources/js/graphql/generated/gql.ts.

  Команди для цього вже є в package.json:

  - pnpm graphql:schema
  - pnpm graphql:codegen
  - pnpm graphql:generate

  Які “оригінальні дані”
  Не generated/graphql.ts. Це лише згенеровані TypeScript-типи і DocumentNode.

  Оригінальне джерело:

  - структура API: PHP GraphQL-класи на бекенді
  - реальні дані: база даних через Eloquent

  Для dashboardStats:

  - поле зареєстроване в app/GraphQL/Queries/DashboardStatsQuery.php
  - дані рахує app/Queries/Dashboard/GetDashboardStats.php

  Для orders:

  - GraphQL query в app/GraphQL/Queries/OrdersQuery.php
  - вибірка з БД в app/Queries/Orders/GetRecentOrders.php

  Звідки береться DASHBOARD_QUERY
  У resources/js/Pages/Dashboard.tsx він імпортується так:

  - з resources/js/graphql/queries/dashboard.ts

  А там просто реекспорт:

  - DashboardQueryDocument з resources/js/graphql/generated/graphql.ts

  Сам DashboardQueryDocument згенерований із цього файлу:

  - resources/js/graphql/documents/dashboard.graphql

  Тобто конкретно для Dashboard шлях такий:

  dashboard.graphql -> codegen -> generated/graphql.ts -> queries/dashboard.ts -> Pages/Dashboard.tsx

  Якщо хочеш, я можу далі розписати це ще простіше на одному конкретному прикладі: “що відбувається від dashboard.graphql до відповіді з /graphql
  крок за кроком”.
```

```
Так. На твоєму Dashboard це відбувається так:

  1. У файлі dashboard.graphql лежить сам GraphQL-запит, приблизно такого змісту:

  query DashboardQuery($limit: Int!) {
      dashboardStats {
          orders
          drinks
          customers
          revenue
      }
      orders(limit: $limit) {
          id
          customer_name
          status
          items_count
          total
      }
  }

  2. graphql-codegen читає цей файл і схему з schema.graphql, після чого генерує:

  - TypeScript-типи відповіді
  - типи змінних
  - DashboardQueryDocument

  У тебе це з’являється в generated/graphql.ts.

  3. Файл queries/dashboard.ts просто експортує цей згенерований документ під зручним ім’ям DASHBOARD_QUERY.
  4. У Dashboard.tsx Apollo викликає:

  useQuery(DASHBOARD_QUERY, {
      variables: { limit: 5 },
  })

  5. Apollo Client відправляє HTTP POST на GraphQL endpoint /graphql з тілом приблизно такого вигляду:

  {
    "query": "...текст DashboardQuery...",
    "variables": {
      "limit": 5
    }
  }

  6. На бекенді rebing/graphql-laravel дивиться на поля запиту:

  - dashboardStats
  - orders(limit: 5)

  І знаходить відповідні PHP query-класи, зареєстровані в config/graphql.php.

  7. Для dashboardStats викликається DashboardStatsQuery.php, а той уже звертається до GetDashboardStats.php, який рахує дані з БД.
  8. Для orders(limit: 5) викликається OrdersQuery.php, а він використовує GetRecentOrders.php, який робить Eloquent query.
  9. GraphQL сервер збирає результат в один JSON і повертає його в такому форматі:

  {
    "data": {
      "dashboardStats": {
        "orders": 12,
        "drinks": 8,
        "customers": 20,
        "revenue": 154.5
      },
      "orders": [
        {
          "id": "1",
          "customer_name": "John",
          "status": "new",
          "items_count": 2,
          "total": 12.5
        }
      ]
    }
  }

  10. Apollo кладе це в data, і в Dashboard.tsx ти вже читаєш:

  const stats = data?.dashboardStats;
  const recentOrders = data?.orders ?? [];

  Коротко:
  dashboard.graphql описує що попросити -> codegen робить TS-обгортку -> Apollo відправляє запит -> PHP GraphQL резолвери дістають дані з БД -> /
  graphql повертає JSON -> React рендерить.

  Якщо хочеш, далі можу окремо пояснити різницю між:

  - generated/graphql.ts
  - generated/gql.ts
  - файлами в resources/js/graphql/documents/
    бо саме тут зазвичай найбільше плутанини.


```
