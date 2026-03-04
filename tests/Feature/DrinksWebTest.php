<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Drink;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class DrinksWebTest extends TestCase
{
    use RefreshDatabase;

    public function test_authenticated_user_can_create_drink_from_web_form(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        $response = $this
            ->actingAs($user)
            ->post(route('drinks.store'), [
                'category_id' => $category->id,
                'name' => 'Honey Latte',
                'price' => 5.90,
                'is_available' => true,
            ]);

        $response->assertRedirect(route('drinks.index'));

        $this->assertDatabaseHas('drinks', [
            'category_id' => $category->id,
            'name' => 'Honey Latte',
            'is_available' => true,
        ]);
    }

    public function test_web_form_rejects_duplicate_drink_name_inside_same_category(): void
    {
        $user = User::factory()->create();
        $category = Category::factory()->create();

        Drink::factory()->create([
            'category_id' => $category->id,
            'name' => 'Honey Latte',
        ]);

        $response = $this
            ->actingAs($user)
            ->from(route('drinks.index'))
            ->post(route('drinks.store'), [
                'category_id' => $category->id,
                'name' => 'Honey Latte',
                'price' => 5.90,
                'is_available' => true,
            ]);

        $response
            ->assertRedirect(route('drinks.index'))
            ->assertSessionHasErrors('name');
    }
}
