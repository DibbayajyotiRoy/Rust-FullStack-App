import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"

interface TableCheckboxProps extends React.ComponentProps<typeof Checkbox> {
    containerClassName?: string
}

export function TableCheckbox({ className, containerClassName, ...props }: TableCheckboxProps) {
    return (
        <div className={cn("flex h-full w-full items-center justify-center p-2", containerClassName)}>
            <Checkbox
                className={cn("translate-y-[2px]", className)}
                {...props}
            />
        </div>
    )
}
