import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-lg group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
            <Input
                placeholder="Search users..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-9 pr-4 py-2 h-9 bg-input border-border/40 hover:border-primary/30 focus-visible:ring-primary/10 rounded-md transition-all text-sm"
            />
        </div>
    )
}
