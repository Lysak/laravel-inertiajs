import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import StatCard from '@/Components/StatCard'
import SurfaceCard from '@/Components/SurfaceCard'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function Dashboard({ stats, recentOrders, graphqlEndpoint }) {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <PageSection className="space-y-6">
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard label="Total orders" value={stats.orders} />
                    <StatCard label="Drinks in menu" value={stats.drinks} />
                    <StatCard label="Customers" value={stats.customers} />
                    <StatCard label="Revenue" value={`$${stats.revenue.toFixed(2)}`} />
                </div>

                <SurfaceCard className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent orders</h3>
                        <Link
                            href={route('orders.index')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            View all
                        </Link>
                    </div>

                    <DataTable>
                        <DataTable.Head columns={['ID', 'Customer', 'Status', 'Items', 'Total']} />
                        <DataTable.Body>
                            {recentOrders.map((order) => (
                                <DataTable.Row key={order.id}>
                                    <DataTable.Cell>
                                        <Link
                                            href={route('orders.show', order.id)}
                                            className="font-medium text-indigo-600 hover:text-indigo-500"
                                        >
                                            #{order.id}
                                        </Link>
                                    </DataTable.Cell>
                                    <DataTable.Cell>{order.customer_name}</DataTable.Cell>
                                    <DataTable.Cell>{order.status}</DataTable.Cell>
                                    <DataTable.Cell>{order.items_count}</DataTable.Cell>
                                    <DataTable.Cell emphasis>
                                        ${order.total.toFixed(2)}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>

                <SurfaceCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">GraphQL endpoint</h3>
                    <p className="mt-2 text-sm text-gray-600">{graphqlEndpoint}</p>
                    <p className="mt-3 text-xs text-gray-500">
                        Try queries:
                        <code className="ms-1 rounded bg-gray-100 px-2 py-1">orders</code>
                        <code className="ms-2 rounded bg-gray-100 px-2 py-1">ordersOptimized</code>
                        <code className="ms-2 rounded bg-gray-100 px-2 py-1">drinksWithStats</code>
                        <code className="ms-2 rounded bg-gray-100 px-2 py-1">
                            drinksWithStatsOptimized
                        </code>
                    </p>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
