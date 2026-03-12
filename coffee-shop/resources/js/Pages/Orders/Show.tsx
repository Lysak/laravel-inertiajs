import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
import { ORDER_QUERY } from '@/graphql/queries/orders'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import MarkOrderPaidButton from '@/Pages/Orders/Partials/MarkOrderPaidButton'
import type { OrderDetails, OrderShowPageProps } from '@/types/page-props'
import { useQuery } from '@apollo/client/react'
import { Head, Link } from '@inertiajs/react'

export default function OrderShow({ orderId }: OrderShowPageProps) {
    const { data, error, loading } = useQuery(ORDER_QUERY, {
        variables: { id: String(orderId) },
    })

    const order: OrderDetails | null = data
        ? {
              id: Number(data.order.id),
              customer_name: data.order.customer_name,
              customer_email: data.order.customer_email ?? null,
              status: data.order.status,
              total: data.order.total,
              items: data.order.items.map((item) => ({
                  id: Number(item.id),
                  drink_name: item.drink_name,
                  quantity: item.quantity,
                  unit_price: item.unit_price,
                  line_total: item.line_total,
              })),
          }
        : null

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">
                        Order #{order?.id ?? orderId}
                    </h2>
                    <div className="flex flex-col items-end gap-3 sm:flex-row sm:items-start">
                        <MarkOrderPaidButton
                            orderId={order?.id ?? orderId}
                            status={order?.status ?? 'in_progress'}
                            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                            errorClassName="max-w-48 text-right text-xs text-red-600"
                            wrapperClassName="space-y-2"
                        />
                        <Link
                            href={route('orders.index')}
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Back to orders
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title={`Order #${order?.id ?? orderId}`} />

            <PageSection className="space-y-6">
                {error ? (
                    <SurfaceCard className="p-6">
                        <p className="text-sm text-red-600">Failed to load the order.</p>
                    </SurfaceCard>
                ) : null}

                <SurfaceCard className="p-6">
                    <div className="grid gap-3 md:grid-cols-4">
                        <div>
                            <p className="text-xs uppercase text-gray-500">Customer</p>
                            <p className="text-sm font-medium text-gray-900">
                                {order?.customer_name ?? (loading ? 'Loading...' : '—')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-gray-500">Email</p>
                            <p className="text-sm font-medium text-gray-900">
                                {order?.customer_email ?? (loading ? 'Loading...' : 'No card attached')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-gray-500">Status</p>
                            <p className="text-sm font-medium text-gray-900">
                                {order?.status ?? (loading ? 'Loading...' : '—')}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-gray-500">Total</p>
                            <p className="text-sm font-semibold text-gray-900">
                                {order ? `$${order.total.toFixed(2)}` : loading ? 'Loading...' : '—'}
                            </p>
                        </div>
                    </div>
                </SurfaceCard>

                <SurfaceCard className="p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">Items</h3>
                    <DataTable>
                        <DataTable.Head columns={['Drink', 'Qty', 'Unit price', 'Line total']} />
                        <DataTable.Body>
                            {loading && !order ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={4}>Loading items...</DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                            {order?.items.map((item) => (
                                <DataTable.Row key={item.id}>
                                    <DataTable.Cell>{item.drink_name}</DataTable.Cell>
                                    <DataTable.Cell>{item.quantity}</DataTable.Cell>
                                    <DataTable.Cell>${item.unit_price.toFixed(2)}</DataTable.Cell>
                                    <DataTable.Cell emphasis>
                                        ${item.line_total.toFixed(2)}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            {!loading && order?.items.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={4}>This order has no items.</DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
