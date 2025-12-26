
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

interface PaginationBarProps {
    total: number
    page: number
    pageSize: number
    onPageChange: (page: number) => void
    onPageSizeChange: (pageSize: number) => void
    pageSizeOptions?: number[]
}

export function PaginationBar({
    total,
    page,
    pageSize,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [10, 20, 50, 100],
}: PaginationBarProps) {
    const totalPages = Math.ceil(total / pageSize)
    const start = (page - 1) * pageSize + 1
    const end = Math.min(page * pageSize, total)

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-4 px-2 border-t mt-auto">
            <div className="text-sm text-muted-foreground type-secondary">
                Viewing {total > 0 ? start : 0}–{end} of {total} results
            </div>

            <div className="flex items-center gap-6 lg:gap-8">
                <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium type-secondary hidden sm:block">Rows per page</p>
                    <Select
                        value={`${pageSize}`}
                        onValueChange={(value: string) => onPageSizeChange(Number(value))}
                    >
                        <SelectTrigger className="h-8 w-[70px]">
                            <SelectValue placeholder={pageSize} />
                        </SelectTrigger>
                        <SelectContent side="top">
                            {pageSizeOptions.map((size) => (
                                <SelectItem key={size} value={`${size}`}>
                                    {size}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(1)}
                        disabled={page === 1}
                    >
                        <span className="sr-only">Go to first page</span>
                        <ChevronsLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page - 1)}
                        disabled={page === 1}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center justify-center text-sm font-medium w-[20px]">
                        {page}
                    </div>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(page + 1)}
                        disabled={page === totalPages || total === 0}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => onPageChange(totalPages)}
                        disabled={page === totalPages || total === 0}
                    >
                        <span className="sr-only">Go to last page</span>
                        <ChevronsRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
