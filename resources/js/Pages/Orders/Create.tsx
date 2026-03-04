import { useMutation, useQuery } from '@apollo/client/react'
import InputError from '@/Components/InputError'
import PageSection from '@/Components/PageSection'
import {
    getGraphQLSubmissionMessage,
    getGraphQLValidationMessages,
} from '@/graphql/errors'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { DASHBOARD_QUERY } from '@/graphql/queries/dashboard'
import {
    CREATE_ORDER_MUTATION,
    ORDER_CREATE_DATA_QUERY,
    ORDERS_QUERY,
} from '@/graphql/queries/orders'
import OrderDrinkPicker from '@/Pages/Orders/Partials/OrderDrinkPicker'
import OrderSummaryPanel from '@/Pages/Orders/Partials/OrderSummaryPanel'
import type { OrderCreateCategory } from '@/types/page-props'
import { Head, Link, router } from '@inertiajs/react'
import type { ComponentPropsWithoutRef } from 'react'
import { useState } from 'react'

type CreateOrderFormData = {
    customer_name: string
    items: Array<{
        drink_id: number
        quantity: number
    }>
}

type FormErrors = {
    customer_name?: string
    items?: string
    submit?: string
}

function extractFormErrors(error: unknown): FormErrors {
    const validation = getGraphQLValidationMessages(error)

    return {
        customer_name: validation?.customer_name?.[0],
        items: validation?.items?.[0] ?? validation?.['items.0.quantity']?.[0],
        submit: getGraphQLSubmissionMessage(error),
    }
}

export default function OrderCreate() {
    const [formData, setFormData] = useState<CreateOrderFormData>({
        customer_name: '',
        items: [],
    })
    const [errors, setErrors] = useState<FormErrors>({})

    const { data, error, loading } = useQuery(ORDER_CREATE_DATA_QUERY)
    const [createOrder, { loading: processing }] = useMutation(CREATE_ORDER_MUTATION, {
        update(cache, { data: mutationData }) {
            const createdOrder = mutationData?.createOrder

            if (!createdOrder) {
                return
            }

            cache.updateQuery(
                {
                    query: ORDERS_QUERY,
                    variables: { limit: 25 },
                },
                (existing) => {
                    if (!existing) {
                        return existing
                    }

                    return {
                        orders: [
                            createdOrder,
                            ...existing.orders.filter((order) => order.id !== createdOrder.id),
                        ].slice(0, 25),
                    }
                },
            )

            cache.updateQuery(
                {
                    query: DASHBOARD_QUERY,
                    variables: { limit: 5 },
                },
                (existing) => {
                    if (!existing) {
                        return existing
                    }

                    return {
                        ...existing,
                        orders: [
                            createdOrder,
                            ...existing.orders.filter((order) => order.id !== createdOrder.id),
                        ].slice(0, 5),
                    }
                },
            )
        },
    })

    const anonymousCustomer = data
        ? {
              id: Number(data.orderCreateData.anonymous_customer.id),
              name: data.orderCreateData.anonymous_customer.name,
          }
        : null

    const categories: OrderCreateCategory[] =
        data?.orderCreateData.categories.map((category) => ({
            id: Number(category.id),
            name: category.name,
            drinks: category.drinks.map((drink) => ({
                id: Number(drink.id),
                name: drink.name,
                price: drink.price,
            })),
        })) ?? []

    const drinks = categories.flatMap((category) => category.drinks)

    const quantities = Object.fromEntries(
        formData.items.map((item) => [item.drink_id, item.quantity]),
    ) as Record<number, number>

    const summaryLines = drinks
        .map((drink) => ({
            id: drink.id,
            name: drink.name,
            quantity: quantities[drink.id] ?? 0,
            unitPrice: drink.price,
        }))
        .filter((line) => line.quantity > 0)

    const totalItems = summaryLines.reduce((sum, line) => sum + line.quantity, 0)
    const totalPrice = summaryLines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)

    const setQuantity = (drinkId: number, nextQuantity: number) => {
        const nextItems = formData.items
            .filter((item) => item.drink_id !== drinkId)
            .concat(nextQuantity > 0 ? [{ drink_id: drinkId, quantity: nextQuantity }] : [])

        setFormData((current) => ({
            ...current,
            items: nextItems,
        }))
        setErrors((current) => ({
            ...current,
            items: undefined,
            submit: undefined,
        }))
    }

    const incrementDrink = (drinkId: number) => {
        setQuantity(drinkId, (quantities[drinkId] ?? 0) + 1)
    }

    const decrementDrink = (drinkId: number) => {
        setQuantity(drinkId, Math.max(0, (quantities[drinkId] ?? 0) - 1))
    }

    const submit: NonNullable<ComponentPropsWithoutRef<'form'>['onSubmit']> = async (event) => {
        event.preventDefault()

        if (!anonymousCustomer) {
            return
        }

        setErrors({})

        try {
            const response = await createOrder({
                variables: {
                    input: {
                        user_id: anonymousCustomer.id,
                        customer_name:
                            formData.customer_name.trim() === '' ? undefined : formData.customer_name.trim(),
                        items: formData.items,
                    },
                },
            })

            const orderId = response.data?.createOrder?.id

            if (orderId) {
                router.visit(route('orders.show', Number(orderId)))
            }
        } catch (mutationError) {
            setErrors((current) => ({
                ...current,
                ...extractFormErrors(mutationError),
            }))
        }
    }

    const activeCustomerName =
        formData.customer_name.trim() === ''
            ? (anonymousCustomer?.name ?? 'Anonymous Guest')
            : formData.customer_name.trim()

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-amber-700">
                            Barista station
                        </p>
                        <h2 className="mt-2 text-2xl font-semibold leading-tight text-stone-900">
                            Start a new order in seconds
                        </h2>
                    </div>
                    <Link
                        href={route('orders.index')}
                        className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
                    >
                        View queue
                    </Link>
                </div>
            }
        >
            <Head title="Create order" />

            <PageSection className="space-y-6">
                {error ? (
                    <InputError message="Failed to load order builder data." />
                ) : null}

                <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_24rem]">
                    <div className="space-y-6">
                        <section className="rounded-[2rem] border border-amber-200 bg-gradient-to-br from-amber-50 via-white to-stone-50 p-6 shadow-[0_20px_60px_rgba(120,53,15,0.08)]">
                            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-amber-700">
                                        Guest name
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-stone-900">
                                        Keep it anonymous or write a name fast
                                    </h3>
                                    <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600">
                                        By default every new order belongs to {activeCustomerName === formData.customer_name.trim() && formData.customer_name.trim() !== '' ? 'the typed guest name' : anonymousCustomer?.name ?? 'Anonymous Guest'}. If the barista has a few seconds, they can type the guest name and it will be saved on the order.
                                    </p>
                                </div>

                                <div className="rounded-[1.5rem] bg-stone-950 p-5 text-stone-50">
                                    <p className="text-xs uppercase tracking-[0.24em] text-stone-300">
                                        Default fallback
                                    </p>
                                    <p className="mt-3 text-lg font-semibold">
                                        {anonymousCustomer?.name ?? 'Loading...'}
                                    </p>
                                    <p className="mt-2 text-sm text-stone-300">
                                        Used automatically when no card is selected.
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto]">
                                <div>
                                    <label
                                        htmlFor="customer_name"
                                        className="text-xs font-semibold uppercase tracking-[0.24em] text-stone-500"
                                    >
                                        Optional customer name
                                    </label>
                                    <input
                                        id="customer_name"
                                        value={formData.customer_name}
                                        onChange={(event) => {
                                            setFormData((current) => ({
                                                ...current,
                                                customer_name: event.target.value,
                                            }))
                                            setErrors((current) => ({
                                                ...current,
                                                customer_name: undefined,
                                                submit: undefined,
                                            }))
                                        }}
                                        placeholder="Type a name only if needed"
                                        className="mt-2 min-h-12 w-full rounded-2xl border border-stone-300 bg-white px-4 text-sm text-stone-900 shadow-sm focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                    />
                                    <InputError className="mt-2" message={errors.customer_name} />
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData((current) => ({
                                            ...current,
                                            customer_name: '',
                                        }))
                                        setErrors((current) => ({
                                            ...current,
                                            customer_name: undefined,
                                            submit: undefined,
                                        }))
                                    }}
                                    className="min-h-12 rounded-2xl border border-stone-300 px-5 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-900"
                                >
                                    Clear name
                                </button>
                            </div>

                            <div className="mt-4 rounded-[1.5rem] border border-stone-200 bg-white px-5 py-4">
                                <p className="text-xs uppercase tracking-[0.24em] text-stone-400">
                                    Active customer
                                </p>
                                <p className="mt-2 text-lg font-semibold text-stone-900">
                                    {activeCustomerName}
                                </p>
                                <p className="mt-1 text-sm text-stone-500">
                                    {formData.customer_name.trim() === ''
                                        ? 'Walk-in guest without a recorded name.'
                                        : 'Saved as a quick note on this order.'}
                                </p>
                            </div>
                        </section>

                        <section className="rounded-[2rem] border border-stone-200 bg-stone-50/70 p-6">
                            <div className="mb-6 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">
                                        Drinks
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold text-stone-900">
                                        Tap to build the order fast
                                    </h3>
                                </div>
                                <div className="rounded-full bg-white px-4 py-2 text-sm text-stone-500 shadow-sm">
                                    {loading ? 'Loading menu...' : `${drinks.length} available drinks`}
                                </div>
                            </div>

                            <OrderDrinkPicker
                                categories={categories}
                                quantities={quantities}
                                onIncrement={incrementDrink}
                                onDecrement={decrementDrink}
                            />

                            <InputError className="mt-4" message={errors.items} />
                            <InputError className="mt-2" message={errors.submit} />
                        </section>
                    </div>

                    <OrderSummaryPanel
                        customerName={activeCustomerName}
                        totalItems={totalItems}
                        totalPrice={totalPrice}
                        lines={summaryLines}
                        processing={processing}
                    />
                </form>
            </PageSection>
        </AuthenticatedLayout>
    )
}
