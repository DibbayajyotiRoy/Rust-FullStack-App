import { CalendarDays } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

// Mock Data
const UPCOMING_BIRTHDAYS = [
    { name: "Sarah Williams", date: "Dec 29", isToday: false },
    { name: "Alex Johnson", date: "Today", isToday: true },
    { name: "Michael Chen", date: "Jan 03", isToday: false },
    { name: "Emily Davis", date: "Jan 12", isToday: false },
]

export function BirthdayCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % UPCOMING_BIRTHDAYS.length)
        }, 4000)
        return () => clearInterval(timer)
    }, [])

    const current = UPCOMING_BIRTHDAYS[currentIndex]

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-start gap-3 min-h-[40px] transition-all duration-300 ease-in-out">
                <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                    current.isToday ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                )}>
                    <CalendarDays className="h-4 w-4" />
                </div>
                <div className="flex-1 space-y-0.5">
                    <div className="text-sm font-medium leading-none">{current.name}</div>
                    <div className="text-xs text-muted-foreground">{current.date}</div>
                </div>
            </div>

            {/* Dots Navigation */}
            <div className="flex gap-1 pl-[44px]"> {/* Align with text, 32px icon + 12px gap */}
                {UPCOMING_BIRTHDAYS.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-300",
                            idx === currentIndex ? "w-4 bg-foreground" : "w-1.5 bg-foreground/20"
                        )}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    )
}
