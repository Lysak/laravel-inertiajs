import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react'

type SurfaceCardProps<T extends ElementType = 'div'> = {
    as?: T
    children?: ReactNode
    className?: string
} & ComponentPropsWithoutRef<T>

export default function SurfaceCard<T extends ElementType = 'div'>({
    as,
    children,
    className = '',
    ...props
}: SurfaceCardProps<T>) {
    const Component = as || 'div'

    return (
        <Component {...props} className={`rounded-lg bg-white shadow-sm ${className}`}>
            {children}
        </Component>
    )
}
