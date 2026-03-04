import type { OrderCreateCategory } from '@/types/page-props'

type OrderDrinkPickerProps = {
    categories: OrderCreateCategory[]
    quantities: Record<number, number>
    onIncrement: (drinkId: number) => void
    onDecrement: (drinkId: number) => void
}

export default function OrderDrinkPicker({
    categories,
    quantities,
    onIncrement,
    onDecrement,
}: OrderDrinkPickerProps) {
    return (
        <div className="space-y-6">
            {categories.map((category) => (
                <section key={category.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-semibold uppercase tracking-[0.24em] text-stone-500">
                            {category.name}
                        </h3>
                        <span className="text-xs text-stone-400">{category.drinks.length} drinks</span>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {category.drinks.map((drink) => {
                            const quantity = quantities[drink.id] ?? 0

                            return (
                                <div
                                    key={drink.id}
                                    className="rounded-3xl border border-stone-200 bg-white p-4 shadow-[0_10px_35px_rgba(28,25,23,0.06)]"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <p className="text-base font-semibold text-stone-900">
                                                {drink.name}
                                            </p>
                                            <p className="mt-1 text-sm text-stone-500">
                                                Fast add for barista workflow
                                            </p>
                                        </div>
                                        <div className="rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-700">
                                            ${drink.price.toFixed(2)}
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-stone-100 p-1">
                                        <button
                                            type="button"
                                            onClick={() => onDecrement(drink.id)}
                                            disabled={quantity === 0}
                                            className="min-h-11 min-w-11 rounded-2xl bg-white text-lg font-semibold text-stone-700 transition hover:bg-stone-50 disabled:cursor-not-allowed disabled:opacity-40"
                                            aria-label={`Remove one ${drink.name}`}
                                        >
                                            -
                                        </button>
                                        <div className="text-center">
                                            <div className="text-xl font-semibold text-stone-900">
                                                {quantity}
                                            </div>
                                            <div className="text-xs uppercase tracking-[0.2em] text-stone-400">
                                                in order
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => onIncrement(drink.id)}
                                            className="min-h-11 min-w-11 rounded-2xl bg-stone-900 text-lg font-semibold text-white transition hover:bg-stone-800"
                                            aria-label={`Add one ${drink.name}`}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>
            ))}
        </div>
    )
}
