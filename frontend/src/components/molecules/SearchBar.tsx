import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

interface SearchBarProps {
    value: string
    onChange: (value: string) => void
}

export function SearchBar({ value, onChange }: SearchBarProps) {
    return (
        <div className="relative w-full max-w-xl group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
                placeholder="Search users by name or email..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-11 pr-4 py-6 bg-card border-border/50 hover:border-primary/50 focus-visible:ring-primary/20 rounded-2xl shadow-sm transition-all text-lg"
            />
        </div>
    )
}
