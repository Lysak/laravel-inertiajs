# Архітектура тестового проєкту (Coffee Shop)

Дата: 2026-02-12

## Цілі архітектури
- Мінімальна, але реалістична структура для співбесід.
- Демонстрація GraphQL, Inertia.js + React і типових проблем N+1/M+1.
- Чіткий поділ бекенду (Laravel) і фронтенду (Inertia-React).

## Доменна модель
### Сутності
- **User**
  - role: admin | barista | customer
- **Category**
  - name
- **Drink**
  - name, price, is_available
  - belongsTo Category
- **Order**
  - status: new | paid | completed | canceled
  - belongsTo User (customer)
- **OrderItem**
  - quantity, unit_price
  - belongsTo Order
  - belongsTo Drink

### Зв’язки
- Category 1 — * Drink
- User 1 — * Order
- Order 1 — * OrderItem
- Drink 1 — * OrderItem

### Модель для N+1/M+1
- **N+1**: список замовлень + для кожного замовлення лоадинг items + drink.
- **M+1**: список напоїв + для кожного напою лоадинг категорії + статистики продажів.

## Архітектурні шари
### Backend (Laravel)
- **HTTP**: Inertia контролери (SSR не обов’язковий).
- **GraphQL**: `rebing/graphql-laravel` з окремими папками для:
  - Types
  - Queries
  - Mutations
  - Inputs
- **Domain/Services** (простий service-layer):
  - OrderService (створення/оплата)
  - StatsService (агрегації)
- **Data access**:
  - Eloquent + eager loading
  - GraphQL DataLoader (batching) для уникнення N+1

### Frontend (Inertia + React)
- **Pages**:
  - Dashboard
  - Orders/Index
  - Orders/Show
  - Drinks/Index
- **UI flow**:
  - Списки → деталі
  - Ті ж дані доступні через GraphQL для демонстрації N+1/M+1

## Потоки даних
### Inertia flow
1. React page → Inertia visit
2. Laravel controller → Eloquent queries
3. Повернення props → React рендер

### GraphQL flow
1. React/Any client → GraphQL endpoint
2. Resolver → Eloquent
3. DataLoader/batching → оптимізовані запити

## Приклади N+1 / M+1
### N+1 приклад (Orders)
- Запит: `orders { id items { id drink { id name } } }`
- Проблема: для кожного Order окремі запити до OrderItems і Drink.
- Рішення:
  - Eager loading `with(['items.drink'])`
  - DataLoader для Drink

### M+1 приклад (Drinks + Stats)
- Запит: `drinks { id name category { id name } stats { totalSold } }`
- Проблема: кожен напій тягне category і stats окремо.
- Рішення:
  - Eager loading `with('category')`
  - Aggregate query для stats через groupBy
  - DataLoader для stats

## Модулі та папки (попередньо)
- `app/Models` — Eloquent моделі
- `app/GraphQL/Types`
- `app/GraphQL/Queries`
- `app/GraphQL/Mutations`
- `app/GraphQL/Inputs`
- `app/Services`
- `app/Http/Controllers`
- `resources/js/Pages`

## Нефункціональні вимоги
- Biome як форматтер/лінтер для фронтенду
- pnpm як менеджер пакетів
- nvm: остання LTS/Stable

## Відкриті питання
- Чи робимо SSR для Inertia? (за замовчуванням — ні)
- Чи потрібні тести для GraphQL резолверів?
