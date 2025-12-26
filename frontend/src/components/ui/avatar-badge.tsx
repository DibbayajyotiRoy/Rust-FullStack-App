import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AvatarBadgeProps {
    name: string
    src?: string | null
    size?: "sm" | "md" | "lg"
    className?: string
}

export function AvatarBadge({ name, src, size = "md", className }: AvatarBadgeProps) {
    const getInitials = (fullName: string) => {
        return fullName
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
    }

    const sizeClasses = {
        sm: "h-6 w-6 text-[10px]",
        md: "h-8 w-8 text-xs",
        lg: "h-10 w-10 text-sm",
    }

    return (
        <div className={cn("flex items-center gap-3", className)}>
            <Avatar className={cn(sizeClasses[size])}>
                <AvatarImage src={src || undefined} alt={name} />
                <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <span className="font-medium text-sm text-foreground">{name}</span>
        </div>
    )
}
