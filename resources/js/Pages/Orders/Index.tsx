import { useQuery } from '@apollo/client/react'
import { Head, Link } from '@inertiajs/react'
import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
import { ORDERS_QUERY } from '@/graphql/queries/orders'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import MarkOrderPaidButton from '@/Pages/Orders/Partials/MarkOrderPaidButton'
import type { OrderListItem } from '@/types/page-props'

const ORDERS_LIMIT = 25

export default function OrdersIndex() {
    const { data, error, loading } = useQuery(ORDERS_QUERY, {
        variables: { limit: ORDERS_LIMIT },
    })

    const orders: OrderListItem[] =
        data?.orders.map((order) => ({
            id: Number(order.id),
            customer_name: order.customer_name,
            status: order.status,
            items_count: order.items_count,
            total: order.total,
            created_at: order.created_at,
        })) ?? []

    const inProgressOrders = orders.filter((order) => order.status === 'in_progress')
    const paidOrders = orders.filter((order) => order.status === 'paid')
    const completedOrders = orders.filter((order) => order.status === 'completed')

    const statusClasses: Record<string, string> = {
        in_progress: 'bg-amber-100 text-amber-800',
        paid: 'bg-emerald-100 text-emerald-800',
        completed: 'bg-stone-200 text-stone-700',
        new: 'bg-sky-100 text-sky-800',
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Orders</h2>
                    <Link
                        href={route('orders.create')}
                        className="rounded-full bg-stone-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-stone-800"
                    >
                        New order
                    </Link>
                </div>
            }
        >
            <Head title="Orders" />

            <PageSection className="space-y-6">
                {error ? (
                    <SurfaceCard className="p-6">
                        <p className="text-sm text-red-600">Failed to load orders.</p>
                    </SurfaceCard>
                ) : null}

                <div className="grid gap-4 md:grid-cols-3">
                    <SurfaceCard className="rounded-[1.75rem] border border-amber-200 bg-amber-50 p-5 shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-amber-700">
                            In progress
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-stone-900">
                            {inProgressOrders.length}
                        </p>
                        <p className="mt-2 text-sm text-stone-600">
                            Orders the barista should focus on now.
                        </p>
                    </SurfaceCard>
                    <SurfaceCard className="rounded-[1.75rem] border border-emerald-200 bg-emerald-50 p-5 shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-emerald-700">Paid</p>
                        <p className="mt-3 text-3xl font-semibold text-stone-900">
                            {paidOrders.length}
                        </p>
                        <p className="mt-2 text-sm text-stone-600">
                            Finished at the register, ready to move on.
                        </p>
                    </SurfaceCard>
                    <SurfaceCard className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 shadow-none">
                        <p className="text-xs uppercase tracking-[0.24em] text-stone-600">
                            Completed
                        </p>
                        <p className="mt-3 text-3xl font-semibold text-stone-900">
                            {completedOrders.length}
                        </p>
                        <p className="mt-2 text-sm text-stone-600">
                            Already finished and out of the active queue.
                        </p>
                    </SurfaceCard>
                </div>

                <SurfaceCard className="overflow-hidden p-6">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                                Barista queue
                            </p>
                            <h3 className="mt-2 text-xl font-semibold text-stone-900">
                                Active work stays at the top
                            </h3>
                        </div>
                        <div className="rounded-full bg-stone-100 px-4 py-2 text-sm text-stone-600">
                            {orders.length} total orders
                        </div>
                    </div>

                    <DataTable>
                        <DataTable.Head
                            columns={['Order', 'Customer', 'Status', 'Items', 'Total', 'Created', 'Action']}
                        />
                        <DataTable.Body>
                            {loading && orders.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={7}>Loading orders...</DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
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
                                    <DataTable.Cell>
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] ${
                                                statusClasses[order.status] ?? 'bg-stone-100 text-stone-700'
                                            }`}
                                        >
                                            {order.status.replace('_', ' ')}
                                        </span>
                                    </DataTable.Cell>
                                    <DataTable.Cell>{order.items_count}</DataTable.Cell>
                                    <DataTable.Cell emphasis>
                                        ${order.total.toFixed(2)}
                                    </DataTable.Cell>
                                    <DataTable.Cell>{order.created_at ?? '—'}</DataTable.Cell>
                                    <DataTable.Cell>
                                        <MarkOrderPaidButton
                                            orderId={order.id}
                                            status={order.status}
                                            className="inline-flex rounded-full border border-emerald-300 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 transition hover:border-emerald-400 hover:text-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                                        />
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            {!loading && orders.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={7}>No orders yet.</DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
