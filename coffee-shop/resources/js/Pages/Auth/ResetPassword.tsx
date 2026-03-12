import InputError from '@/Components/InputError'
import InputLabel from '@/Components/InputLabel'
import PrimaryButton from '@/Components/PrimaryButton'
import TextInput from '@/Components/TextInput'
import GuestLayout from '@/Layouts/GuestLayout'
import type { ResetPasswordFormData } from '@/types/forms'
import type { ResetPasswordPageProps } from '@/types/inertia'
import { Head, useForm } from '@inertiajs/react'
import type { ChangeEvent, SubmitEvent } from 'react'

export default function ResetPassword({ token, email }: ResetPasswordPageProps) {
    const { data, setData, post, processing, errors, reset } = useForm<ResetPasswordFormData>({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    })

    const submit = (event: SubmitEvent<HTMLFormElement>) => {
        event.preventDefault()

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        })
    }

    const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData('email', event.target.value)
    }

    const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData('password', event.target.value)
    }

    const handlePasswordConfirmationChange = (event: ChangeEvent<HTMLInputElement>) => {
        setData('password_confirmation', event.target.value)
    }

    return (
        <GuestLayout>
            <Head title="Reset Password" />

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full"
                        autoComplete="username"
                        onChange={handleEmailChange}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Password" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={handlePasswordChange}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password_confirmation" value="Confirm Password" />

                    <TextInput
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full"
                        autoComplete="new-password"
                        onChange={handlePasswordConfirmationChange}
                    />

                    <InputError message={errors.password_confirmation} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center justify-end">
                    <PrimaryButton className="ms-4" disabled={processing}>
                        Reset Password
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    )
}
