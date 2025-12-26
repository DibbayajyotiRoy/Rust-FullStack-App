import { useState } from "react"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { DataTable } from "@/components/organisms/DataTable/DataTable"
import { DateRangeFilter } from "@/components/organisms/DataTable/DateRangeFilter"
import { attendanceColumns, type AttendanceRecord } from "@/components/organisms/AttendanceTable/columns"

// Mock Data Generation
const generateMockData = (): AttendanceRecord[] => {
    return Array.from({ length: 15 }).map((_, i) => ({
        id: `att-${i}`,
        date: new Date().toISOString(),
        employee: {
            name: i % 3 === 0 ? "John Doe" : i % 3 === 1 ? "Sarah Connor" : "Kyle Reese",
        },
        checkIn: "09:00 AM",
        checkOut: "06:00 PM",
        status: i % 5 === 0 ? "Late" : i % 7 === 0 ? "Absent" : "Present",
        isOverride: i % 4 === 0
    }))
}

export default function AttendancePage() {
    const [date, setDate] = useState<DateRange | undefined>({
        from: new Date(),
        to: addDays(new Date(), 7),
    })

    const [data] = useState<AttendanceRecord[]>(generateMockData())

    // Mock stats
    const stats = [
        { label: "Present Today", value: "42", color: "text-emerald-600" },
        { label: "Late / Partial", value: "3", color: "text-amber-500" },
        { label: "Absent", value: "1", color: "text-rose-500" },
    ]

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header & Stats */}
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">
                        Attendance
                    </h1>
                    <p className="type-secondary">
                        Daily logs, overrides, and timesheets
                    </p>
                </div>

                <div className="flex flex-wrap gap-4">
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col px-4 py-2 bg-card border rounded-md min-w-[120px]">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</span>
                            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Table Area */}
            <div className="flex-1">
                <DataTable
                    data={data}
                    columns={attendanceColumns}
                    filterActions={
                        <DateRangeFilter date={date} onDateChange={setDate} />
                    }
                    onRowClick={() => { }} // Placeholder for modal override
                    total={data.length}
                    pageSize={10}
                    page={1}
                />
            </div>
        </div>
    )
}
