<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;

final class CheckPhpConfigCli extends Command
{
    protected $signature = 'php:check-config';

    protected $description = 'Check PHP production-related configuration for Laravel';

    private int $passed = 0;
    private int $failed = 0;
    private int $warnings = 0;

    public function handle(): int
    {
        $checks = [
            'Runtime' => [
                $this->check('PHP >= 8.1', version_compare(PHP_VERSION, '8.1.0', '>='), PHP_VERSION),
                $this->check('SAPI', in_array(PHP_SAPI, ['fpm-fcgi', 'cli', 'cli-server'], true), PHP_SAPI, 'warn'),
            ],
            'Xdebug' => [
                $this->check('xdebug disabled', !extension_loaded('xdebug'), extension_loaded('xdebug') ? 'loaded' : 'not loaded'),
            ],
            'OPcache' => [
                $this->iniEquals('opcache.enable', '1'),
                $this->iniMinInt('opcache.memory_consumption', 128),
                $this->iniMinInt('opcache.interned_strings_buffer', 16),
                $this->iniMinInt('opcache.max_accelerated_files', 10000),
                $this->iniEquals('opcache.validate_timestamps', '0', 'warn'),
                $this->iniEquals('opcache.save_comments', '1'),
                $this->check(
                    'opcache running',
                    function_exists('opcache_get_status') && ((opcache_get_status(false)['opcache_enabled'] ?? false) === true),
                    function_exists('opcache_get_status') ? json_encode(opcache_get_status(false)['opcache_enabled'] ?? null) : 'n/a',
                    'warn'
                ),
            ],
            'JIT' => [
                $this->check(
                    'jit disabled or explicitly configured',
                    in_array((string) ini_get('opcache.jit'), ['disable', 'off', '0', 'tracing', 'function', '1205', '1254'], true),
                    'opcache.jit=' . (string) ini_get('opcache.jit'),
                    'warn'
                ),
                $this->check(
                    'jit buffer readable',
                    ini_get('opcache.jit_buffer_size') !== false,
                    'opcache.jit_buffer_size=' . (string) ini_get('opcache.jit_buffer_size'),
                    'warn'
                ),
            ],
            'GC' => [
                $this->iniEquals('zend.enable_gc', '1'),
                $this->check('gc_enabled()', gc_enabled(), gc_enabled() ? 'true' : 'false'),
            ],
            'Errors' => [
                $this->iniEquals('display_errors', '0'),
                $this->iniEquals('display_startup_errors', '0', 'warn'),
                $this->iniEquals('log_errors', '1'),
            ],
            'Security' => [
                $this->iniEquals('expose_php', '0', 'warn'),
                $this->iniEquals('allow_url_include', '0'),
            ],
            'Laravel' => [
                $this->check('APP_DEBUG=false', $this->appDebugOff(), 'APP_DEBUG=' . var_export(env('APP_DEBUG'), true)),
                $this->check('config cached', file_exists(app()->bootstrapPath('cache/config.php')), 'bootstrap/cache/config.php'),
                $this->check('routes cached', count(glob(app()->bootstrapPath('cache/routes*.php'))) > 0, 'bootstrap/cache/routes*.php', 'warn'),
            ],
        ];

        $this->line('');
        $this->line('<options=bold>PHP production config check</>');
        $this->line('<fg=gray>' . PHP_VERSION . ' | ' . PHP_SAPI . ' | ' . now()->toDateTimeString() . '</>');
        $this->line('');

        foreach ($checks as $section => $items) {
            $this->line("<options=bold>{$section}</>");

            foreach ($items as $item) {
                $icon = match ($item['status']) {
                    'pass' => '<fg=green>✔</>',
                    'fail' => '<fg=red>✘</>',
                    'warn' => '<fg=yellow>⚠</>',
                    default => '•',
                };

                $labelColor = $item['status'] === 'fail' ? 'red' : 'white';
                $this->line(sprintf(
                    '  %s <fg=%s>%s</> <fg=gray>(%s)</>',
                    $icon,
                    $labelColor,
                    $item['label'],
                    $item['actual']
                ));
            }

            $this->line('');
        }

        $this->line(sprintf(
            '<fg=green>%d passed</> · <fg=red>%d failed</> · <fg=yellow>%d warnings</>',
            $this->passed,
            $this->failed,
            $this->warnings
        ));

        return $this->failed > 0 ? self::FAILURE : self::SUCCESS;
    }

    private function check(string $label, bool $ok, string $actual, string $severity = 'fail'): array
    {
        $status = $ok ? 'pass' : $severity;

        if ($status === 'pass') {
            $this->passed++;
        } elseif ($status === 'fail') {
            $this->failed++;
        } elseif ($status === 'warn') {
            $this->warnings++;
        }

        return [
            'label' => $label,
            'actual' => $actual,
            'status' => $status,
        ];
    }

    private function iniEquals(string $key, string $expected, string $severity = 'fail'): array
    {
        $actual = (string) ini_get($key);
        $ok = $actual === $expected || (string) (int) $actual === (string) (int) $expected;

        return $this->check("{$key}={$expected}", $ok, "{$key}={$actual}", $severity);
    }

    private function iniMinInt(string $key, int $min, string $severity = 'fail'): array
    {
        $actual = (string) ini_get($key);
        $ok = (int) $actual >= $min;

        return $this->check("{$key}>={$min}", $ok, "{$key}={$actual}", $severity);
    }

    private function appDebugOff(): bool
    {
        $value = env('APP_DEBUG');

        return $value === false || $value === 'false' || $value === 0 || $value === '0' || $value === null;
    }
}
