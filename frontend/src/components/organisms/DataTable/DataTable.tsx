import * as React from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { PaginationBar } from "./PaginationBar"
import { TableToolbar } from "./TableToolbar"
import { EmptyState } from "@/components/ui/empty-state"
import { FileQuestion } from "lucide-react"

export interface Column<T> {
    header: React.ReactNode
    cell: (item: T) => React.ReactNode
    accessorKey?: string // Optional, for simple sorting/filtering later if needed
    className?: string
}

interface DataTableProps<T> {
    data: T[]
    columns: Column<T>[]
    total?: number
    page?: number
    pageSize?: number
    onPageChange?: (page: number) => void
    onPageSizeChange?: (pageSize: number) => void
    isLoading?: boolean
    searchQuery?: string
    onSearchChange?: (value: string) => void
    filterActions?: React.ReactNode
    mainActions?: React.ReactNode
    onRowClick?: (item: T) => void
}

export function DataTable<T extends { id?: string | number }>({
    data,
    columns,
    total = 0,
    page = 1,
    pageSize = 10,
    onPageChange,
    onPageSizeChange,
    isLoading,
    searchQuery,
    onSearchChange,
    filterActions,
    mainActions,
    onRowClick,
}: DataTableProps<T>) {

    return (
        <div className="space-y-4">
            <TableToolbar
                searchQuery={searchQuery}
                onSearchChange={onSearchChange}
                filterActions={filterActions}
                mainActions={mainActions}
            />

            <div className="rounded-md border bg-card">
                <div className="relative w-full overflow-auto max-h-[600px]">
                    <Table>
                        <TableHeader className="sticky top-0 bg-card z-10 shadow-sm">
                            <TableRow>
                                {columns.map((col, index) => (
                                    <TableHead key={index} className={col.className}>
                                        {col.header}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : data.length > 0 ? (
                                data.map((item, rowIndex) => (
                                    <TableRow
                                        key={item.id || rowIndex}
                                        onClick={() => onRowClick?.(item)}
                                        className={onRowClick ? "cursor-pointer hover:bg-muted/50 transition-colors" : ""}
                                    >
                                        {columns.map((col, colIndex) => (
                                            <TableCell key={colIndex} className={col.className}>
                                                {col.cell(item)}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-[300px] text-center">
                                        <EmptyState
                                            icon={FileQuestion}
                                            title="No results found"
                                            description="Try adjusting your filters or search query."
                                        />
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {onPageChange && onPageSizeChange && (
                <PaginationBar
                    total={total}
                    page={page}
                    pageSize={pageSize}
                    onPageChange={onPageChange}
                    onPageSizeChange={onPageSizeChange}
                />
            )}
        </div>
    )
}
