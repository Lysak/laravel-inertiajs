<?php

declare(strict_types=1);

return [
    'prefix' => env('READ_MODEL_CACHE_PREFIX', 'coffee-shop:read-model-cache'),
    'ttls' => [
        'dashboard' => (int) env('READ_MODEL_CACHE_DASHBOARD_TTL', 30),
        'orders' => (int) env('READ_MODEL_CACHE_ORDERS_TTL', 30),
        'catalog' => (int) env('READ_MODEL_CACHE_CATALOG_TTL', 300),
        'drink_stats' => (int) env('READ_MODEL_CACHE_DRINK_STATS_TTL', 60),
    ],
];
