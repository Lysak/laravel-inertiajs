export type OrderListItem = {
    id: number
    customer_name: string
    status: string
    items_count: number
    total: number
    created_at: string | null
}

export type OrderCreateDrink = {
    id: number
    name: string
    price: number
}

export type OrderCreateCategory = {
    id: number
    name: string
    drinks: OrderCreateDrink[]
}

export type OrderItem = {
    id: number
    drink_name: string
    quantity: number
    unit_price: number
    line_total: number
}

export type OrderDetails = {
    id: number
    customer_name: string
    customer_email: string | null
    status: string
    total: number
    items: OrderItem[]
}

export type OrderShowPageProps = {
    orderId: number
}

export type ProfileEditProps = {
    mustVerifyEmail: boolean
    status?: string
}

export type UpdateProfileInformationFormProps = {
    mustVerifyEmail: boolean
    status?: string
    className?: string
}
