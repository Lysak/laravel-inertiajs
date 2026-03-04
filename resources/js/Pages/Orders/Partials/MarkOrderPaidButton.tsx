import { useMutation } from '@apollo/client/react'
import { getGraphQLSubmissionMessage } from '@/graphql/errors'
import { MARK_ORDER_PAID_MUTATION } from '@/graphql/queries/orders'
import { useState } from 'react'

type MarkOrderPaidButtonProps = {
    orderId: number
    status: string
    className?: string
    errorClassName?: string
    wrapperClassName?: string
}

export default function MarkOrderPaidButton({
    orderId,
    status,
    className = '',
    errorClassName = 'text-xs text-red-600',
    wrapperClassName = 'space-y-2',
}: MarkOrderPaidButtonProps) {
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [markOrderPaid, { loading }] = useMutation(MARK_ORDER_PAID_MUTATION, {
        update(cache, { data }) {
            const paidOrder = data?.markOrderPaid

            if (!paidOrder) {
                return
            }

            const cacheId = cache.identify({
                __typename: 'Order',
                id: paidOrder.id,
            })

            if (!cacheId) {
                return
            }

            cache.modify({
                id: cacheId,
                fields: {
                    status: () => paidOrder.status,
                    customer_name: () => paidOrder.customer_name,
                    items_count: () => paidOrder.items_count,
                    total: () => paidOrder.total,
                    created_at: (existingValue) => paidOrder.created_at ?? existingValue,
                },
            })
        },
    })

    const canMarkPaid = status === 'new' || status === 'in_progress'

    if (!canMarkPaid) {
        return null
    }

    const handleMarkPaid = async () => {
        setSubmitError(null)

        try {
            await markOrderPaid({
                variables: {
                    orderId,
                },
            })
        } catch (error) {
            setSubmitError(
                getGraphQLSubmissionMessage(error) ?? 'Failed to mark order as paid.',
            )
        }
    }

    return (
        <div className={wrapperClassName}>
            <button
                type="button"
                onClick={handleMarkPaid}
                disabled={loading}
                className={className}
            >
                {loading ? 'Marking...' : 'Mark as paid'}
            </button>
            {submitError ? <p className={errorClassName}>{submitError}</p> : null}
        </div>
    )
}
