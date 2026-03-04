import { useQuery } from '@apollo/client/react'
import { Head, Link } from '@inertiajs/react'
import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import StatCard from '@/Components/StatCard'
import SurfaceCard from '@/Components/SurfaceCard'
import { DASHBOARD_QUERY } from '@/graphql/queries/dashboard'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

export default function Dashboard() {
    const { data, error, loading } = useQuery(DASHBOARD_QUERY, {
        variables: { limit: 5 },
    })

    const stats = data?.dashboardStats
    const recentOrders = data?.orders ?? []

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            <PageSection className="space-y-6">
                {error ? (
                    <SurfaceCard className="p-6">
                        <p className="text-sm text-red-600">Failed to load dashboard data.</p>
                    </SurfaceCard>
                ) : null}

                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard
                        label="Total orders"
                        value={stats ? stats.orders : loading ? '...' : 0}
                    />
                    <StatCard
                        label="Drinks in menu"
                        value={stats ? stats.drinks : loading ? '...' : 0}
                    />
                    <StatCard
                        label="Customers"
                        value={stats ? stats.customers : loading ? '...' : 0}
                    />
                    <StatCard
                        label="Revenue"
                        value={stats ? `$${stats.revenue.toFixed(2)}` : loading ? '...' : '$0.00'}
                    />
                </div>

                <SurfaceCard className="p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-gray-900">Recent orders</h3>
                        <Link
                            href={route('orders.create')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Start order
                        </Link>
                    </div>

                    <DataTable>
                        <DataTable.Head columns={['ID', 'Customer', 'Status', 'Items', 'Total']} />
                        <DataTable.Body>
                            {loading && recentOrders.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={5}>
                                        Loading recent orders...
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                            {recentOrders.map((order) => (
                                <DataTable.Row key={order.id}>
                                    <DataTable.Cell>
                                        <Link
                                            href={route('orders.show', Number(order.id))}
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
                            {!loading && recentOrders.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={5}>
                                        No recent orders yet.
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>

                <SurfaceCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900">GraphQL endpoint</h3>
                    <p className="mt-2 text-sm text-gray-600">/graphql</p>
                    <p className="mt-3 text-xs text-gray-500">
                        Try queries:
                        <code className="ms-1 rounded bg-gray-100 px-2 py-1">dashboardStats</code>
                        <code className="ms-2 rounded bg-gray-100 px-2 py-1">orders</code>
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
