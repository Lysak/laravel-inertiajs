import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function DrinksIndex({ drinks }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Drinks
                </h2>
            }
        >
            <Head title="Drinks" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Drink
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Category
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Price
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Available
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Sold
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Revenue
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {drinks.map((drink) => (
                                        <tr key={drink.id}>
                                            <td className="px-3 py-2 text-sm text-gray-700">{drink.name}</td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {drink.category}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                ${drink.price.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {drink.is_available ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {drink.total_sold}
                                            </td>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                                ${drink.revenue.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
