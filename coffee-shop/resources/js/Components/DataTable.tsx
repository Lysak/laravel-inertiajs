function DataTable({ children, className = '' }) {
    return (
        <div className={`overflow-x-auto ${className}`}>
            <table className="min-w-full divide-y divide-gray-200">{children}</table>
        </div>
    )
}

function Head({ columns }) {
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

function Body({ children }) {
    return <tbody className="divide-y divide-gray-100 bg-white">{children}</tbody>
}

function Row({ children }) {
    return <tr>{children}</tr>
}

function HeaderCell({ children }) {
    return (
        <th className="px-3 py-2 text-left text-xs font-semibold uppercase text-gray-500">
            {children}
        </th>
    )
}

function Cell({ children, className = '', emphasis = false }) {
    const textColor = emphasis ? 'font-medium text-gray-900' : 'text-gray-700'

    return <td className={`px-3 py-2 text-sm ${textColor} ${className}`}>{children}</td>
}

DataTable.Head = Head
DataTable.Body = Body
DataTable.Row = Row
DataTable.HeaderCell = HeaderCell
DataTable.Cell = Cell

export default DataTable
