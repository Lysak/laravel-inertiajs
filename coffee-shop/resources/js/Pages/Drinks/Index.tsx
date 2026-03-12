import DataTable from '@/Components/DataTable'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import { Head } from '@inertiajs/react'

export default function DrinksIndex({ drinks }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Drinks</h2>}
        >
            <Head title="Drinks" />

            <PageSection>
                <SurfaceCard className="overflow-hidden p-6">
                    <DataTable>
                        <DataTable.Head
                            columns={['Drink', 'Category', 'Price', 'Available', 'Sold', 'Revenue']}
                        />
                        <DataTable.Body>
                            {drinks.map((drink) => (
                                <DataTable.Row key={drink.id}>
                                    <DataTable.Cell>{drink.name}</DataTable.Cell>
                                    <DataTable.Cell>{drink.category}</DataTable.Cell>
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
                        </DataTable.Body>
                    </DataTable>
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
