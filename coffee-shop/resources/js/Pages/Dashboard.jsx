import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function Dashboard({ stats, recentOrders, graphqlEndpoint }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="grid gap-4 md:grid-cols-4">
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Total orders</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.orders}
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Drinks in menu</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.drinks}
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Customers</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                {stats.customers}
                            </p>
                        </div>
                        <div className="rounded-lg bg-white p-6 shadow-sm">
                            <p className="text-sm text-gray-500">Revenue</p>
                            <p className="mt-2 text-3xl font-semibold text-gray-900">
                                ${stats.revenue.toFixed(2)}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">
                                Recent orders
                            </h3>
                            <Link
                                href={route('orders.index')}
                                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                View all
                            </Link>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
                                            ID
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
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 bg-white">
                                    {recentOrders.map((order) => (
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
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="rounded-lg bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-900">
                            GraphQL endpoint
                        </h3>
                        <p className="mt-2 text-sm text-gray-600">{graphqlEndpoint}</p>
                        <p className="mt-3 text-xs text-gray-500">
                            Try queries:
                            <code className="ms-1 rounded bg-gray-100 px-2 py-1">orders</code>
                            <code className="ms-2 rounded bg-gray-100 px-2 py-1">
                                ordersOptimized
                            </code>
                            <code className="ms-2 rounded bg-gray-100 px-2 py-1">
                                drinksWithStats
                            </code>
                            <code className="ms-2 rounded bg-gray-100 px-2 py-1">
                                drinksWithStatsOptimized
                            </code>
                        </p>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    )
}
