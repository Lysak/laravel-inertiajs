import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'
import PageSection from '@/Components/PageSection'
import SurfaceCard from '@/Components/SurfaceCard'
import { Head } from '@inertiajs/react'
import DeleteUserForm from './Partials/DeleteUserForm'
import UpdatePasswordForm from './Partials/UpdatePasswordForm'
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm'

export default function Edit({ mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold leading-tight text-gray-800">Profile</h2>}
        >
            <Head title="Profile" />

            <PageSection className="space-y-6">
                <SurfaceCard className="p-4 sm:rounded-lg sm:p-8">
                    <UpdateProfileInformationForm
                        mustVerifyEmail={mustVerifyEmail}
                        status={status}
                        className="max-w-xl"
                    />
                </SurfaceCard>

                <SurfaceCard className="p-4 sm:rounded-lg sm:p-8">
                    <UpdatePasswordForm className="max-w-xl" />
                </SurfaceCard>

                <SurfaceCard className="p-4 sm:rounded-lg sm:p-8">
                    <DeleteUserForm className="max-w-xl" />
                </SurfaceCard>
            </PageSection>
        </AuthenticatedLayout>
    )
}
