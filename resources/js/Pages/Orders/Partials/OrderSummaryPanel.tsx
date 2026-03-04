type OrderSummaryLine = {
    id: number
    name: string
    quantity: number
    unitPrice: number
}

type OrderSummaryPanelProps = {
    customerName: string
    totalItems: number
    totalPrice: number
    lines: OrderSummaryLine[]
    processing: boolean
}

export default function OrderSummaryPanel({
    customerName,
    totalItems,
    totalPrice,
    lines,
    processing,
}: OrderSummaryPanelProps) {
    return (
        <aside className="sticky top-6 rounded-[2rem] border border-stone-200 bg-stone-950 p-6 text-stone-50 shadow-[0_30px_80px_rgba(28,25,23,0.18)]">
            <div className="rounded-[1.5rem] bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-300">Customer</p>
                <p className="mt-2 text-lg font-semibold">{customerName}</p>
                <p className="mt-1 text-sm text-stone-300">
                    {totalItems === 0 ? 'No drinks added yet' : `${totalItems} item(s) queued`}
                </p>
            </div>

            <div className="mt-6 flex items-end justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-400">Total</p>
                    <p className="mt-2 text-4xl font-semibold">${totalPrice.toFixed(2)}</p>
                </div>
                <div className="rounded-full bg-emerald-400/15 px-3 py-2 text-sm font-medium text-emerald-300">
                    Start now
                </div>
            </div>

            <div className="mt-6 space-y-3">
                {lines.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-white/15 px-4 py-6 text-center text-sm text-stone-400">
                        Pick drinks on the left. The summary updates immediately.
                    </div>
                ) : (
                    lines.map((line) => (
                        <div
                            key={line.id}
                            className="flex items-center justify-between rounded-3xl bg-white/6 px-4 py-3"
                        >
                            <div>
                                <p className="font-medium text-white">{line.name}</p>
                                <p className="text-sm text-stone-300">
                                    {line.quantity} x ${line.unitPrice.toFixed(2)}
                                </p>
                            </div>
                            <div className="text-sm font-semibold text-white">
                                ${(line.quantity * line.unitPrice).toFixed(2)}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <button
                type="submit"
                disabled={processing || totalItems === 0}
                className="mt-6 min-h-12 w-full rounded-2xl bg-amber-400 px-5 text-sm font-semibold uppercase tracking-[0.24em] text-stone-950 transition hover:bg-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-200 focus:ring-offset-2 focus:ring-offset-stone-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {processing ? 'Creating...' : 'Create Order & Start'}
            </button>
        </aside>
    )
}
