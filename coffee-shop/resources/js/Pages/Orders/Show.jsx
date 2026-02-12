import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function OrderShow({ order }) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order #{order.id}
                    </h2>
                    <Link
                        href={route('orders.index')}
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Back to orders
                    </Link>
                </div>
            }
        >
            <Head title={`Order #${order.id}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="grid gap-3 md:grid-cols-4">
                            <div>
                                <p className="text-xs uppercase text-gray-500">Customer</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {order.customer_name}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500">Email</p>
                                <p className="text-sm font-medium text-gray-900">
                                    {order.customer_email}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500">Status</p>
                                <p className="text-sm font-medium text-gray-900">{order.status}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase text-gray-500">Total</p>
                                <p className="text-sm font-semibold text-gray-900">
                                    ${order.total.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="mb-4 text-lg font-semibold text-gray-900">Items</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Drink
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Qty
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Unit price
                                        </th>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            Line total
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {order.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {item.drink_name}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                {item.quantity}
                                            </td>
                                            <td className="px-3 py-2 text-sm text-gray-700">
                                                ${item.unit_price.toFixed(2)}
                                            </td>
                                            <td className="px-3 py-2 text-sm font-medium text-gray-900">
                                                ${item.line_total.toFixed(2)}
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
