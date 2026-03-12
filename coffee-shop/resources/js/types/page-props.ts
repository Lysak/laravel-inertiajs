export type DashboardStats = {
    orders: number
    drinks: number
    customers: number
    revenue: number
}

export type DashboardOrder = {
    id: number
    customer_name: string
    status: string
    items_count: number
    total: number
}

export type DashboardProps = {
    stats: DashboardStats
    recentOrders: DashboardOrder[]
    graphqlEndpoint: string
}

export type OrderListItem = {
    id: number
    customer_name: string
    status: string
    items_count: number
    total: number
    created_at: string
}

export type OrdersIndexProps = {
    orders: OrderListItem[]
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
    customer_email: string
    status: string
    total: number
    items: OrderItem[]
}

export type OrderShowProps = {
    order: OrderDetails
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

export type DrinkRow = {
    id: number
    name: string
    category: string | null
    price: number
    is_available: boolean
    total_sold: number
    revenue: number
}

export type DrinkCategory = {
    id: number
    name: string
}

export type DrinksIndexProps = {
    drinks: DrinkRow[]
    categories: DrinkCategory[]
}

export type CreateDrinkFormProps = {
    categories: DrinkCategory[]
}
