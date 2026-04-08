<?php

declare(strict_types=1);

namespace App\Support;

use Illuminate\Contracts\Cache\Repository as CacheRepository;
use Illuminate\Contracts\Foundation\Application;

class ReadModelCache
{
    public function __construct(
        private readonly CacheRepository $cache,
        private readonly Application $application,
    ) {}

    /**
     * @template TValue
     *
     * @param  array<int, string>  $scopes
     * @param  callable(): TValue  $resolver
     * @return TValue
     */
    public function remember(array $scopes, string $suffix, int $ttlSeconds, callable $resolver): mixed
    {
        if ($this->application->runningUnitTests()) {
            return $resolver();
        }

        $key = $this->makeKey($scopes, $suffix);

        return $this->cache->remember($key, now()->addSeconds($ttlSeconds), $resolver);
    }

    /**
     * @param  array<int, string>  $scopes
     */
    public function invalidate(array $scopes): void
    {
        if ($this->application->runningUnitTests()) {
            return;
        }

        foreach (array_unique($scopes) as $scope) {
            $versionKey = $this->versionKey($scope);
            $currentVersion = (int) $this->cache->get($versionKey, 1);

            $this->cache->forever($versionKey, $currentVersion + 1);
        }
    }

    /**
     * @param  array<int, string>  $scopes
     */
    private function makeKey(array $scopes, string $suffix): string
    {
        $normalizedScopes = array_values(array_unique($scopes));
        sort($normalizedScopes);

        $versions = array_map(
            fn (string $scope): string => $scope . ':' . $this->version($scope),
            $normalizedScopes,
        );

        $prefix = (string) config('read-model-cache.prefix', 'read-model-cache');

        return $prefix . ':' . implode('|', $versions) . ':' . sha1($suffix);
    }

    private function version(string $scope): int
    {
        return (int) $this->cache->get($this->versionKey($scope), 1);
    }

    private function versionKey(string $scope): string
    {
        $prefix = (string) config('read-model-cache.prefix', 'read-model-cache');

        return $prefix . ':version:' . $scope;
    }
}
