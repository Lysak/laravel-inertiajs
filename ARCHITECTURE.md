# Demo Project Architecture (Coffee Shop)

Date: 2026-02-12

## Architecture Goals
- A minimal but realistic structure for interviews.
- Demonstrate GraphQL, Inertia.js + React, and typical N+1/M+1 issues.
- Clear separation between backend (Laravel) and frontend (Inertia + React).

## Domain Model
### Entities
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

### Relationships
- Category 1 — * Drink
- User 1 — * Order
- Order 1 — * OrderItem
- Drink 1 — * OrderItem

### N+1/M+1 Demonstration Model
- **N+1**: an order list where each order loads its items and drink separately.
- **M+1**: a drinks list where each drink loads its category and sales stats separately.

## Architecture Layers
### Backend (Laravel)
- **HTTP**: Inertia controllers (SSR is optional).
- **GraphQL**: `rebing/graphql-laravel` with dedicated folders for:
  - Types
  - Queries
  - Mutations
  - Inputs
- **Domain/Services** (simple service layer):
  - OrderService (creation/payment)
  - StatsService (aggregations)
- **Data access**:
  - Eloquent + eager loading
  - GraphQL DataLoader (batching) to avoid N+1

### Frontend (Inertia + React)
- **Pages**:
  - Dashboard
  - Orders/Index
  - Orders/Show
  - Drinks/Index
- **UI flow**:
  - Lists -> details
  - The same data is available through GraphQL to demonstrate N+1/M+1

## Data Flows
### Inertia flow
1. React page → Inertia visit
2. Laravel controller → Eloquent queries
3. Return props -> React render

### GraphQL flow
1. React/Any client → GraphQL endpoint
2. Resolver → Eloquent
3. DataLoader/batching -> optimized queries

## N+1 / M+1 Examples
### N+1 Example (Orders)
- Query: `orders { id items { id drink { id name } } }`
- Problem: each Order triggers separate queries for OrderItems and Drink.
- Solution:
  - Eager loading `with(['items.drink'])`
  - DataLoader for Drink

### M+1 Example (Drinks + Stats)
- Query: `drinks { id name category { id name } stats { totalSold } }`
- Problem: each drink loads category and stats separately.
- Solution:
  - Eager loading `with('category')`
  - Aggregate query for stats using `groupBy`
  - DataLoader for stats

## Modules and Folders (Preliminary)
- `app/Models` — Eloquent models
- `app/GraphQL/Types`
- `app/GraphQL/Queries`
- `app/GraphQL/Mutations`
- `app/GraphQL/Inputs`
- `app/Services`
- `app/Http/Controllers`
- `resources/js/Pages`

## Non-Functional Requirements
- Biome as the formatter/linter for the frontend
- pnpm as the package manager
- nvm: latest LTS/Stable

## Open Questions
- Should we use SSR for Inertia? (default: no)
- Do we need tests for GraphQL resolvers?
