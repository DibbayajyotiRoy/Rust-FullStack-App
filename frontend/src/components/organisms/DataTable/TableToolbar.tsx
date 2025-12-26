import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { FilterBar } from "./FilterBar"

interface TableToolbarProps {
    searchQuery?: string
    onSearchChange?: (value: string) => void
    searchPlaceholder?: string
    filterActions?: React.ReactNode
    mainActions?: React.ReactNode
}

export function TableToolbar({
    searchQuery,
    onSearchChange,
    searchPlaceholder = "Search...",
    filterActions,
    mainActions,
}: TableToolbarProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between py-4">
            <div className="flex flex-1 items-center gap-2">
                {filterActions && <FilterBar>{filterActions}</FilterBar>}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={searchQuery}
                        onChange={(event) => onSearchChange?.(event.target.value)}
                        className="h-9 w-[150px] lg:w-[250px] pl-8"
                    />
                </div>
                {mainActions}
            </div>
        </div>
    )
}
