<?php

declare(strict_types=1);

namespace App\Queries\Dashboard;

use App\Support\ReadModelCache;

readonly class DashboardStatsCache
{
    public function __construct(
        private ReadModelCache $readModelCache,
    ) {}

    /**
     * @param  callable(): array{orders:int, drinks:int, customers:int, revenue:float}  $resolver
     * @return array{orders:int, drinks:int, customers:int, revenue:float}
     */
    public function remember(callable $resolver): array
    {
        /** @var array{orders:int, drinks:int, customers:int, revenue:float} $stats */
        $stats = $this->readModelCache->remember(
            ['dashboard'],
            'dashboard.stats',
            (int) config('read-model-cache.ttls.dashboard', 30),
            $resolver,
        );

        return $stats;
    }

    public function forget(): void
    {
        $this->readModelCache->invalidate(['dashboard']);
    }
}
