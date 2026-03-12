<?php

declare(strict_types=1);

namespace App\GraphQL\Queries;

use App\Queries\Dashboard\GetDashboardStats;
use GraphQL\Type\Definition\ResolveInfo;
use GraphQL\Type\Definition\Type;
use Rebing\GraphQL\Support\Facades\GraphQL;
use Rebing\GraphQL\Support\Query;

class DashboardStatsQuery extends Query
{
    public function __construct(private readonly GetDashboardStats $getDashboardStats)
    {
    }

    protected $attributes = [
        'name' => 'dashboardStats',
        'description' => 'Dashboard aggregate statistics',
    ];

    public function type(): Type
    {
        return GraphQL::type('DashboardStats');
    }

    public function resolve($root, array $args, $context, ResolveInfo $resolveInfo): array
    {
        return $this->getDashboardStats->handle();
    }
}
