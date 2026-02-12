# Поточний аналіз і продовження

Дата: 2026-02-12

## Що вже є в папці
- `PROJECT_BRIEF.md` — цілі, стек і вимоги.
- `PROJECT_STRUCTURE.md` — цільова структура та базові конфіги.
- `ARCHITECTURE.md` — доменна модель і шари застосунку.

## Висновок з аналізу
- Це підготовчий етап документації.
- Код Laravel/Inertia/GraphQL ще не ініціалізовано.
- Локальне оточення готове частково:
  - PHP: `8.4.16`
  - Composer: `2.8.4`
  - Node: `v22.17.1`
  - pnpm: `10.28.2`
  - `nvm` не знайдено в поточній shell-сесії

## Поточний блокер
- Ініціалізація Laravel через Composer зараз неможлива через відсутність доступу до `repo.packagist.org`:
  - `curl error 6 ... Could not resolve host: repo.packagist.org`

## Що робити далі, коли буде мережа
1. Ініціалізувати Laravel (рекомендовано в окрему папку, щоб не втратити документи):
   - `composer create-project laravel/laravel coffee-shop`
2. Встановити Inertia + React (через офіційний starter/preset для вашої версії Laravel).
3. Додати GraphQL пакет:
   - `composer require rebing/graphql-laravel`
4. Налаштувати фронтенд залежності через pnpm:
   - `pnpm install`
5. Перенести узгоджені модулі з `ARCHITECTURE.md`:
   - `app/GraphQL/{Types,Queries,Mutations,Inputs}`
   - `app/Services`
   - `resources/js/Pages`
6. Реалізувати мінімальний вертикальний зріз:
   - `Drink`/`Category` моделі + міграції
   - 1 GraphQL query для списку напоїв
   - 1 Inertia-сторінка для відображення

## Що вже додано в цій папці для старту
- `.nvmrc` — `22.17.1`
- `biome.json` — базовий конфіг форматування/лінту
