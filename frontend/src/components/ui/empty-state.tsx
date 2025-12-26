import { type LucideIcon } from "lucide-react"

interface EmptyStateProps {
    icon?: LucideIcon
    title: string
    description: string
    action?: React.ReactNode
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50">
            {Icon && (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-4">
                    <Icon className="h-6 w-6 text-muted-foreground" />
                </div>
            )}
            <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-sm">
                {description}
            </p>
            {action && <div>{action}</div>}
        </div>
    )
}
