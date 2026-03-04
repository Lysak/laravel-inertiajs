import type { SVGProps } from 'react'

export default function ApplicationLogo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg {...props} viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18 26h24a2 2 0 0 1 2 2v13a12 12 0 0 1-12 12h-4a12 12 0 0 1-12-12V28a2 2 0 0 1 2-2Z"
                fill="currentColor"
            />
            <path
                d="M44 31h4a6 6 0 0 1 0 12h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M24 18c0-2 1-3 2-4m6 4c0-2 1-3 2-4"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
            />
        </svg>
    )
}
