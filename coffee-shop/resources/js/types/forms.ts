export type ConfirmPasswordFormData = {
    password: string
}

export type ForgotPasswordFormData = {
    email: string
}

export type LoginFormData = {
    email: string
    password: string
    remember: boolean
}

export type RegisterFormData = {
    name: string
    email: string
    password: string
    password_confirmation: string
}

export type ResetPasswordFormData = {
    token: string
    email: string
    password: string
    password_confirmation: string
}

export type DeleteUserFormData = {
    password: string
}

export type UpdatePasswordFormData = {
    current_password: string
    password: string
    password_confirmation: string
}

export type UpdateProfileInformationFormData = {
    name: string
    email: string
}
