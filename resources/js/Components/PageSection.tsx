import type { ReactNode } from 'react'

type PageSectionProps = {
    children: ReactNode
    className?: string
}

export default function PageSection({ children, className = '' }: PageSectionProps) {
    return (
        <div className="py-12">
            <div className={`mx-auto max-w-7xl sm:px-6 lg:px-8 ${className}`}>{children}</div>
        </div>
    )
}
