<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreDrinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('drinks', 'name')->where(
                    fn ($query) => $query->where('category_id', $this->integer('category_id'))
                ),
            ],
            'price' => ['required', 'numeric', 'min:0.01'],
            'is_available' => ['required', 'boolean'],
        ];
    }
}
