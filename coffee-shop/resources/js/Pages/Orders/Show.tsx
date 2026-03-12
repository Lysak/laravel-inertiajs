import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
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

            <PageSection className="space-y-6">
                <SurfaceCard className="p-6">
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
                </SurfaceCard>

                <SurfaceCard className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Items</h3>
                    <DataTable>
                        <DataTable.Head columns={['Drink', 'Qty', 'Unit price', 'Line total']} />
                        <DataTable.Body>
                            {order.items.map((item) => (
                                <DataTable.Row key={item.id}>
                                    <DataTable.Cell>{item.drink_name}</DataTable.Cell>
                                    <DataTable.Cell>{item.quantity}</DataTable.Cell>
                                    <DataTable.Cell>${item.unit_price.toFixed(2)}</DataTable.Cell>
                                    <DataTable.Cell emphasis>
                                        ${item.line_total.toFixed(2)}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
