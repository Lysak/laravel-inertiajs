import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function OrdersIndex({ orders }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Orders
                </h2>
            }
        >
            <Head title="Orders" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="overflow-x-auto p-6">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Order
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Customer
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Status
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Items
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Total
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Created
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {orders.map((order) => (
                                        <tr key={order.id}>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                <Link
                                                    href={route('orders.show', order.id)}
                                                    className="font-medium text-indigo-600 hover:text-indigo-500"
                                                >
                                                    #{order.id}
                                                </Link>
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {order.customer_name}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {order.status}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {order.items_count}
                                            </td>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                                ${order.total.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {order.created_at}
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
