import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cake, Gift, CalendarDays } from "lucide-react";
import { useState, useEffect } from "react";

interface Employee {
    id: string;
    name: string;
    role: string;
    birthday: Date; // Keep as Date object for easier comparison
    avatar?: string;
}

// Mock Data - In a real app, this would come from an API
const MOCK_EMPLOYEES: Employee[] = [
    {
        id: "1",
        name: "Alex Johnson",
        role: "Senior Developer",
        birthday: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()), // Today
    },
    {
        id: "2",
        name: "Sarah Williams",
        role: "Product Manager",
        birthday: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 3), // In 3 days
    },
    {
        id: "3",
        name: "Michael Chen",
        role: "UX Designer",
        birthday: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 10), // In 10 days
    },
    {
        id: "4",
        name: "Emily Davis",
        role: "QA Engineer",
        birthday: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 20), // In 20 days (Should be filtered out)
    },
];

export function BirthdayCarousel() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [upcomingBirthdays, setUpcomingBirthdays] = useState<Employee[]>([]);

    useEffect(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const twoWeeksFromNow = new Date(today);
        twoWeeksFromNow.setDate(today.getDate() + 14);

        const filtered = MOCK_EMPLOYEES.filter((emp) => {

            // Handle birthdays at the end of the year wrapping to next year if needed, 
            // but for simplicity in this mock, we assume current year context mostly.
            // A more robust check would normalize years.

            const normalizedBirthday = new Date(today.getFullYear(), emp.birthday.getMonth(), emp.birthday.getDate());
            if (normalizedBirthday < today) {
                normalizedBirthday.setFullYear(today.getFullYear() + 1);
            }

            return normalizedBirthday >= today && normalizedBirthday <= twoWeeksFromNow;
        }).sort((a, b) => {
            const dateA = new Date(today.getFullYear(), a.birthday.getMonth(), a.birthday.getDate());
            if (dateA < today) dateA.setFullYear(today.getFullYear() + 1);

            const dateB = new Date(today.getFullYear(), b.birthday.getMonth(), b.birthday.getDate());
            if (dateB < today) dateB.setFullYear(today.getFullYear() + 1);

            return dateA.getTime() - dateB.getTime();
        });

        setUpcomingBirthdays(filtered);
    }, []);

    useEffect(() => {
        if (upcomingBirthdays.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % upcomingBirthdays.length);
        }, 4000); // Rotate every 4 seconds

        return () => clearInterval(timer);
    }, [upcomingBirthdays.length]);

    const isBirthdayToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() && date.getMonth() === today.getMonth();
    };

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
    };

    if (upcomingBirthdays.length === 0) {
        return (
            <Card className="h-full flex flex-col justify-center items-center p-6 text-center text-muted-foreground bg-gradient-to-br from-background to-muted/20">
                <div className="bg-muted p-3 rounded-full mb-3">
                    <CalendarDays className="h-6 w-6 opacity-50" />
                </div>
                <p className="text-sm">No upcoming birthdays in the next 2 weeks.</p>
            </Card>
        );
    }

    const currentEmployee = upcomingBirthdays[currentSlide];
    const isToday = isBirthdayToday(currentEmployee.birthday);

    return (
        <Card className={`h-full overflow-hidden relative transition-all duration-500 border-none ring-1 ring-border ${isToday ? 'bg-gradient-to-br from-primary/5 via-background to-background' : 'bg-background'}`}>
            {/* Decorative background elements */}
            {isToday && (
                <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                    <Gift className="w-24 h-24 rotate-12 text-primary" />
                </div>
            )}

            <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Cake className={`h-4 w-4 ${isToday ? 'text-primary' : 'text-muted-foreground'}`} />
                        Birthdays
                    </span>
                    {upcomingBirthdays.length > 1 && (
                        <div className="flex gap-1">
                            {upcomingBirthdays.map((_, idx) => (
                                <div
                                    key={idx}
                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-4 bg-foreground' : 'w-1.5 bg-muted'}`}
                                />
                            ))}
                        </div>
                    )}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col items-center text-center relative z-10">
                <div className={`relative mb-4 rounded-full p-1 ${isToday ? 'bg-gradient-to-br from-primary to-purple-400' : 'bg-muted'}`}>
                    <div className="h-16 w-16 rounded-full bg-background flex items-center justify-center overflow-hidden border-2 border-background">
                        {/* Placeholder Avatar */}
                        <span className="text-xl font-bold text-muted-foreground">
                            {currentEmployee.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                        </span>
                    </div>
                    {isToday && (
                        <div className="absolute -bottom-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm animate-bounce">
                            Today!
                        </div>
                    )}
                </div>

                <h3 className="font-bold text-lg leading-tight mb-1">{currentEmployee.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{currentEmployee.role}</p>

                <Badge variant={isToday ? "default" : "outline"} className={`mt-auto ${isToday ? 'bg-primary/90 hover:bg-primary' : 'text-muted-foreground'}`}>
                    {isToday ? (
                        <span className="flex items-center gap-1.5">
                            <Gift className="w-3 h-3" /> Happy Birthday!
                        </span>
                    ) : (
                        <span className="flex items-center gap-1.5">
                            <CalendarDays className="w-3 h-3" /> {formatDate(currentEmployee.birthday)}
                        </span>
                    )}
                </Badge>
            </CardContent>
        </Card>
    );
}
