import DataTable from '@/Components/DataTable'
import InputError from '@/Components/InputError'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
import {
    getGraphQLSubmissionMessage,
    getGraphQLValidationMessages,
} from '@/graphql/errors'
import {
    CREATE_DRINK_MUTATION,
    DRINKS_INDEX_QUERY,
} from '@/graphql/queries/drinks'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import CreateDrinkForm from '@/Pages/Drinks/Partials/CreateDrinkForm'
import { useMutation, useQuery } from '@apollo/client/react'
import { Head } from '@inertiajs/react'
import { useState } from 'react'

type CreateDrinkFormErrors = {
    category_id?: string
    name?: string
    price?: string
    is_available?: string
    submit?: string
}

function extractFormErrors(error: unknown): CreateDrinkFormErrors {
    const validation = getGraphQLValidationMessages(error)

    return {
        category_id: validation?.category_id?.[0],
        name: validation?.name?.[0],
        price: validation?.price?.[0],
        is_available: validation?.is_available?.[0],
        submit: getGraphQLSubmissionMessage(error),
    }
}

export default function DrinksIndex() {
    const [formErrors, setFormErrors] = useState<CreateDrinkFormErrors>({})
    const { data, error, loading } = useQuery(DRINKS_INDEX_QUERY)
    const [createDrink, { loading: processing }] = useMutation(CREATE_DRINK_MUTATION, {
        refetchQueries: [{ query: DRINKS_INDEX_QUERY }],
        awaitRefetchQueries: true,
    })

    const categories =
        data?.categories.map((category) => ({
            id: String(category.id),
            name: category.name,
        })) ?? []

    const drinks =
        data?.drinks.map((drink) => ({
            id: String(drink.id),
            name: drink.name,
            category: drink.category?.name ?? null,
            price: drink.price,
            is_available: drink.is_available,
            total_sold: drink.stats?.total_sold ?? 0,
            revenue: drink.stats?.revenue ?? 0,
        })) ?? []

    const handleCreateDrink = async (input: {
        category_id: string
        name: string
        price: string
        is_available: boolean
    }): Promise<boolean> => {
        setFormErrors({})

        try {
            await createDrink({
                variables: {
                    input: {
                        category_id: input.category_id,
                        name: input.name.trim(),
                        price: Number(input.price),
                        is_available: input.is_available,
                    },
                },
            })

            return true
        } catch (mutationError) {
            setFormErrors(extractFormErrors(mutationError))

            return false
        }
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Drinks</h2>}
        >
            <Head title="Drinks" />

            <PageSection>
                <CreateDrinkForm
                    categories={categories}
                    errors={formErrors}
                    onSubmit={handleCreateDrink}
                    processing={processing}
                />
            </PageSection>

            <PageSection>
                {error ? <InputError message="Failed to load drinks catalog." /> : null}

                <SurfaceCard className="overflow-hidden p-6">
                    <DataTable>
                        <DataTable.Head
                            columns={['Drink', 'Category', 'Price', 'Available', 'Sold', 'Revenue']}
                        />
                        <DataTable.Body>
                            {loading && drinks.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={6}>Loading drinks...</DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                            {drinks.map((drink) => (
                                <DataTable.Row key={drink.id}>
                                    <DataTable.Cell>{drink.name}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {drink.category ?? 'Uncategorized'}
                                    </DataTable.Cell>
                                    <DataTable.Cell>${drink.price.toFixed(2)}</DataTable.Cell>
                                    <DataTable.Cell>
                                        {drink.is_available ? 'Yes' : 'No'}
                                    </DataTable.Cell>
                                    <DataTable.Cell>{drink.total_sold}</DataTable.Cell>
                                    <DataTable.Cell emphasis>
                                        ${drink.revenue.toFixed(2)}
                                    </DataTable.Cell>
                                </DataTable.Row>
                            ))}
                            {!loading && drinks.length === 0 ? (
                                <DataTable.Row>
                                    <DataTable.Cell colSpan={6}>No drinks yet.</DataTable.Cell>
                                </DataTable.Row>
                            ) : null}
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
