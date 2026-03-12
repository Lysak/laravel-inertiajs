import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head, Link } from '@inertiajs/react'

export default function OrdersIndex({ orders }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Orders</h2>}
        >
            <Head title="Orders" />

            <PageSection>
                <SurfaceCard className="overflow-hidden p-6">
                    <DataTable>
                        <DataTable.Head
                            columns={['Order', 'Customer', 'Status', 'Items', 'Total', 'Created']}
                        />
                        <DataTable.Body>
                            {orders.map((order) => (
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
                                    <DataTable.Cell>{order.created_at}</DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
