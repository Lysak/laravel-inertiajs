<?php

namespace App\Http\Controllers;

use App\Actions\Drinks\CreateDrink;
use App\Http\Requests\StoreDrinkRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class DrinkController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Drinks/Index');
    }

    public function store(StoreDrinkRequest $request, CreateDrink $createDrink): RedirectResponse
    {
        $createDrink->handle($request->validated());

        return redirect()->route('drinks.index');
    }
}
