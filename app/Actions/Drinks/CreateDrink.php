<?php

namespace App\Actions\Drinks;

use App\Models\Drink;
use Illuminate\Validation\ValidationException;

class CreateDrink
{
    /**
     * @param  array{category_id:int, name:string, price:numeric-string|float|int, is_available:bool}  $attributes
     */
    public function handle(array $attributes): Drink
    {
        $alreadyExists = Drink::query()
            ->where('category_id', (int) $attributes['category_id'])
            ->where('name', $attributes['name'])
            ->exists();

        if ($alreadyExists) {
            throw ValidationException::withMessages([
                'name' => 'A drink with this name already exists in the selected category.',
            ]);
        }

        return Drink::query()->create([
            'category_id' => (int) $attributes['category_id'],
            'name' => $attributes['name'],
            'price' => $attributes['price'],
            'is_available' => (bool) $attributes['is_available'],
        ])->load('category');
    }
}
