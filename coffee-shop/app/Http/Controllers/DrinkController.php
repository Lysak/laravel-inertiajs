<?php

namespace App\Http\Controllers;

use App\Actions\Drinks\CreateDrink;
use App\Http\Requests\StoreDrinkRequest;
use App\Models\Category;
use App\Queries\Drinks\ListDrinksForIndex;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DrinkController extends Controller
{
    public function index(ListDrinksForIndex $listDrinksForIndex): Response
    {
        return Inertia::render('Drinks/Index', [
            'drinks' => $listDrinksForIndex->handle(),
            'categories' => Category::query()
                ->orderBy('name')
                ->get(['id', 'name'])
                ->map(fn (Category $category): array => [
                    'id' => $category->id,
                    'name' => $category->name,
                ])
                ->all(),
        ]);
    }

    public function store(StoreDrinkRequest $request, CreateDrink $createDrink): RedirectResponse
    {
        $createDrink->handle($request->validated());

        return redirect()->route('drinks.index');
    }
}
