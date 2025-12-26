import { cn } from "@/lib/utils"

interface KeyValueItem {
    label: string
    value: React.ReactNode
    className?: string
}

interface KeyValueGridProps {
    items: KeyValueItem[]
    columns?: 1 | 2 | 3
    className?: string
}

export function KeyValueGrid({ items, columns = 2, className }: KeyValueGridProps) {
    return (
        <div
            className={cn(
                "grid gap-4 sm:gap-6",
                columns === 1 && "grid-cols-1",
                columns === 2 && "grid-cols-1 sm:grid-cols-2",
                columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                className
            )}
        >
            {items.map((item, index) => (
                <div key={index} className={cn("flex flex-col gap-1", item.className)}>
                    <dt className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        {item.label}
                    </dt>
                    <dd className="text-sm font-medium text-foreground min-h-[20px]">
                        {item.value || "—"}
                    </dd>
                </div>
            ))}
        </div>
    )
}
