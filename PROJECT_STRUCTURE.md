# План структури проєкту та початкові конфіги

Дата: 2026-02-12

## 1) Структура директорій (після ініціалізації Laravel)
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

## 2) Початкові кроки ініціалізації
1. Створити Laravel-проєкт (latest).
2. Додати Inertia.js + React preset.
3. Додати `rebing/graphql-laravel`.
4. Налаштувати pnpm для фронтенду.
5. Налаштувати Biome.
6. Зафіксувати nvm (node latest LTS/Stable).

## 3) Файли конфігурації (очікувані)
- `.nvmrc` — версія node
- `biome.json` — конфіг Biome
- `package.json` — pnpm + скрипти
- `vite.config.js` — React + Inertia
- `config/graphql.php` — налаштування rebing/graphql-laravel
- `routes/graphql.php` — GraphQL endpoint

## 4) Початкові пакети
### PHP
- laravel/framework (latest)
- rebing/graphql-laravel (latest)

### JS
- react, react-dom (latest)
- @inertiajs/react (latest)
- @inertiajs/inertia-laravel (latest)
- vite (latest)
- biome (latest)

## 5) Скрипти (package.json)
- `dev`: запуск Vite
- `build`: збірка
- `lint`: biome lint
- `format`: biome format

## 6) Мінімальні сторінки (React)
- `Dashboard` — коротка панель
- `Orders/Index` — список замовлень
- `Orders/Show` — деталі замовлення
- `Drinks/Index` — список напоїв

## 7) Наступні дії
1. Підтвердити ініціалізацію Laravel та стек.
2. Створити базову структуру файлів і конфігів.
3. Додати початкові сторінки та маршрути.
