<?php

namespace App\Queries\Drinks\Data;

use Illuminate\Contracts\Support\Arrayable;
use JsonSerializable;

readonly class DrinkIndexData implements Arrayable, JsonSerializable
{
    public function __construct(
        public int $id,
        public string $name,
        public float $price,
        public bool $isAvailable,
        public ?string $category,
        public int $totalSold,
        public float $revenue,
    ) {}

    /**
     * @return array{
     *     id:int,
     *     name:string,
     *     price:float,
     *     is_available:bool,
     *     category:string|null,
     *     total_sold:int,
     *     revenue:float
     * }
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'price' => $this->price,
            'is_available' => $this->isAvailable,
            'category' => $this->category,
            'total_sold' => $this->totalSold,
            'revenue' => $this->revenue,
        ];
    }

    /**
     * @return array{
     *     id:int,
     *     name:string,
     *     price:float,
     *     is_available:bool,
     *     category:string|null,
     *     total_sold:int,
     *     revenue:float
     * }
     */
    public function jsonSerialize(): array
    {
        return $this->toArray();
    }
}
