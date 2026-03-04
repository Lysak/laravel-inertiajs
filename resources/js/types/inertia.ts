export type AppUser = {
    id?: number
    name: string
    email: string
    email_verified_at?: string | null
    [key: string]: unknown
}

export type AuthenticatedPageProps = {
    auth: {
        user: AppUser
    }
    [key: string]: unknown
}

export type StatusPageProps = {
    status?: string
}

export type LoginPageProps = StatusPageProps & {
    canResetPassword: boolean
}

export type ResetPasswordPageProps = {
    token: string
    email: string
}
