import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const statusPillVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                success:
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
                warning:
                    "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400",
                error:
                    "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
                neutral:
                    "bg-muted text-muted-foreground",
                default:
                    "bg-primary text-primary-foreground hover:bg-primary/80",
            },
        },
        defaultVariants: {
            variant: "neutral",
        },
    }
)

export interface StatusPillProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusPillVariants> { }

function StatusPill({ className, variant, ...props }: StatusPillProps) {
    return (
        <div className={cn(statusPillVariants({ variant }), className)} {...props} />
    )
}

export { StatusPill, statusPillVariants }
