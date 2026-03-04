<?php

namespace App\Queries\Orders;

use App\Models\Category;
use App\Support\CustomerUsers;

class GetOrderCreatePageData
{
    /**
     * @return array<string, mixed>
     */
    public function handle(): array
    {
        $anonymousCustomer = CustomerUsers::anonymousCustomer();

        return [
            'anonymous_customer' => [
                'id' => $anonymousCustomer->id,
                'name' => $anonymousCustomer->name,
            ],
            'categories' => Category::query()
                ->with([
                    'drinks' => fn ($query) => $query
                        ->where('is_available', true)
                        ->orderBy('name'),
                ])
                ->orderBy('name')
                ->get()
                ->map(static fn (Category $category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                    'drinks' => $category->drinks->map(static fn ($drink): array => [
                        'id' => $drink->id,
                        'name' => $drink->name,
                        'price' => (float) $drink->price,
                    ])->values()->all(),
                ])
                ->filter(static fn (array $category): bool => count($category['drinks']) > 0)
                ->values()
                ->all(),
        ];
    }
}
