import { useForm } from '@inertiajs/react'
import Checkbox from '@/Components/Checkbox'
import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import SurfaceCard from '@/Components/SurfaceCard'
import TextInput from '@/Components/TextInput'
import type { ChangeEvent, SubmitEvent } from 'react'
import type { CreateDrinkFormProps } from '@/types/page-props'

type CreateDrinkFormData = {
    category_id: string
    name: string
    price: string
    is_available: boolean
}

export default function CreateDrinkForm({ categories }: CreateDrinkFormProps) {
    const { data, setData, post, processing, errors, reset } = useForm<CreateDrinkFormData>({
        category_id: categories[0] ? String(categories[0].id) : '',
        name: '',
        price: '',
        is_available: true,
    })

    const submit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        post(route('drinks.store'), {
            preserveScroll: true,
            onSuccess: () => {
                reset()
                setData('category_id', categories[0] ? String(categories[0].id) : '')
                setData('is_available', true)
            },
        })
    }

    const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>) => {
        setData('category_id', event.target.value)
    }

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData('name', event.target.value)
    }

    const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData('price', event.target.value)
    }

    const handleAvailabilityChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData('is_available', event.target.checked)
    }

    return (
        <SurfaceCard className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add drink from web</h3>
                <p className="mt-1 text-sm text-gray-600">
                    This form uses the regular Laravel web flow and stores a new catalog item.
                </p>
            </div>

            <form onSubmit={submit} className="grid gap-6 md:grid-cols-2">
                <div>
                    <InputLabel htmlFor="category_id" value="Category" />
                    <select
                        id="category_id"
                        value={data.category_id}
                        onChange={handleCategoryChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                    <InputError className="mt-2" message={errors.category_id} />
                </div>

                <div>
                    <InputLabel htmlFor="name" value="Drink name" />
                    <TextInput
                        id="name"
                        className="mt-1 block w-full"
                        value={data.name}
                        onChange={handleNameChange}
                        required
                    />
                    <InputError className="mt-2" message={errors.name} />
                </div>

                <div>
                    <InputLabel htmlFor="price" value="Price" />
                    <TextInput
                        id="price"
                        type="number"
                        min="0.01"
                        step="0.01"
                        className="mt-1 block w-full"
                        value={data.price}
                        onChange={handlePriceChange}
                        required
                    />
                    <InputError className="mt-2" message={errors.price} />
                </div>

                <label className="flex items-center gap-3 rounded-md border border-gray-200 px-4 py-3">
                    <Checkbox checked={data.is_available} onChange={handleAvailabilityChange} />
                    <span className="text-sm text-gray-700">Available for orders</span>
                </label>

                <div className="md:col-span-2">
                    <PrimaryButton disabled={processing || categories.length === 0}>
                        Create drink
                    </PrimaryButton>
                </div>
            </form>
        </SurfaceCard>
    )
}
