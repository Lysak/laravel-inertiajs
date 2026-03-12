import SurfaceCard from '@/Components/SurfaceCard'

export default function StatCard({ label, value }) {
    return (
        <SurfaceCard className="p-6">
            <p className="text-sm text-gray-500">{label}</p>
            <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </SurfaceCard>
    )
}
