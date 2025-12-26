import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface InlineIconTextProps {
    icon: LucideIcon
    text: string | React.ReactNode
    className?: string
    iconClassName?: string
}

export function InlineIconText({ icon: Icon, text, className, iconClassName }: InlineIconTextProps) {
    return (
        <div className={cn("flex items-center gap-2 text-sm text-muted-foreground", className)}>
            <Icon className={cn("h-4 w-4", iconClassName)} />
            <span className="truncate">{text}</span>
        </div>
    )
}
