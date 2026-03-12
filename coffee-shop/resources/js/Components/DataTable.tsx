import type { ReactNode } from 'react'

type DataTableProps = {
    children: ReactNode
    className?: string
}

type HeadProps = {
    columns: string[]
}

type RowProps = {
    children: ReactNode
}

type CellProps = {
    children: ReactNode
    className?: string
    colSpan?: number
    emphasis?: boolean
}

type DataTableComponent = ((props: DataTableProps) => ReactNode) & {
    Head: (props: HeadProps) => ReactNode
    Body: (props: RowProps) => ReactNode
    Row: (props: RowProps) => ReactNode
    HeaderCell: (props: RowProps) => ReactNode
    Cell: (props: CellProps) => ReactNode
}

function DataTableRoot({ children, className = '' }: DataTableProps) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">{children}</table>
        </div>
    )
}

function Head({ columns }: HeadProps) {
    return (
        <thead>
            <tr>
                {columns.map((column) => (
                    <HeaderCell key={column}>{column}</HeaderCell>
                ))}
            </tr>
        </thead>
    )
}

function Body({ children }: RowProps) {
    return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
}

function Row({ children }: RowProps) {
    return <tr>{children}</tr>
}

function HeaderCell({ children }: RowProps) {
    return (
        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
            {children}
        </th>
    )
}

function Cell({ children, className = '', colSpan, emphasis = false }: CellProps) {
    const textColor = emphasis ? 'font-medium text-gray-900' : 'text-gray-700'

    return (
        <td className={`px-3 py-2 text-sm ${textColor} ${className}`} colSpan={colSpan}>
            {children}
        </td>
    )
}

const DataTable: DataTableComponent = Object.assign(DataTableRoot, {
    Head,
    Body,
    Row,
    HeaderCell,
    Cell,
})

export default DataTable
