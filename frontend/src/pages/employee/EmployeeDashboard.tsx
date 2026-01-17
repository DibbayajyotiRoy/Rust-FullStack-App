import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    Legend
} from "recharts"
import { useAuth } from "@/contexts/auth.context"

// Mock data - replace with API call
const generateMonthlyData = () => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return months.map(month => ({
        month,
        present: Math.floor(Math.random() * 22) + 1,
        absent: Math.floor(Math.random() * 3),
        late: Math.floor(Math.random() * 5),
        leave: Math.floor(Math.random() * 3)
    }))
}

const generateYearlyData = () => {
    const years = ["2022", "2023", "2024", "2025", "2026"]
    return years.map(year => ({
        year,
        attendanceRate: Math.floor(Math.random() * 15) + 85, // 85-100%
        totalDays: Math.floor(Math.random() * 50) + 200
    }))
}

export default function EmployeeDashboard() {
    const { user } = useAuth()
    const [period, setPeriod] = useState<"monthly" | "yearly">("monthly")
    const [monthlyData] = useState(generateMonthlyData())
    const [yearlyData] = useState(generateYearlyData())

    // Calculate summary stats
    const totalPresent = monthlyData.reduce((acc, curr) => acc + curr.present, 0)
    const totalAbsent = monthlyData.reduce((acc, curr) => acc + curr.absent, 0)
    const totalLate = monthlyData.reduce((acc, curr) => acc + curr.late, 0)
    const totalLeave = monthlyData.reduce((acc, curr) => acc + curr.leave, 0)

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-lg font-semibold type-header">My Dashboard</h1>
                    <p className="type-secondary">
                        Welcome back, {user?.username || "Employee"}
                    </p>
                </div>
                <a href="/employee/leave-requests" className="hidden sm:block">
                    <Button size="sm" className="gap-2">
                        <Plus className="h-4 w-4" />
                        Apply for Leave
                    </Button>
                </a>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 border-none bg-emerald-500/10">
                    <div className="text-2xl font-bold text-emerald-600">{totalPresent}</div>
                    <div className="text-sm type-secondary">Days Present</div>
                </Card>
                <Card className="p-4 border-none bg-rose-500/10">
                    <div className="text-2xl font-bold text-rose-500">{totalAbsent}</div>
                    <div className="text-sm type-secondary">Days Absent</div>
                </Card>
                <Card className="p-4 border-none bg-amber-500/10">
                    <div className="text-2xl font-bold text-amber-600">{totalLate}</div>
                    <div className="text-sm type-secondary">Late Arrivals</div>
                </Card>
                <Card className="p-4 border-none bg-blue-500/10">
                    <div className="text-2xl font-bold text-blue-600">{totalLeave}</div>
                    <div className="text-sm type-secondary">Leave Days</div>
                </Card>
            </div>

            {/* Charts Section */}
            <Card className="flex-1 p-4 border-none bg-muted/40">
                <Tabs value={period} onValueChange={(v) => setPeriod(v as "monthly" | "yearly")}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-medium type-header">Attendance Overview</h3>
                        <TabsList>
                            <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            <TabsTrigger value="yearly">Yearly</TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="monthly" className="h-[300px] mt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--color-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Bar dataKey="present" name="Present" fill="#10b981" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="absent" name="Absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="late" name="Late" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="leave" name="Leave" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </TabsContent>

                    <TabsContent value="yearly" className="h-[300px] mt-0">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={yearlyData}>
                                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                                <XAxis
                                    dataKey="year"
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 12 }}
                                    tickLine={false}
                                    axisLine={false}
                                    domain={[0, 100]}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'var(--color-card)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="attendanceRate"
                                    name="Attendance Rate (%)"
                                    stroke="#10b981"
                                    strokeWidth={2}
                                    dot={{ fill: '#10b981' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </TabsContent>
                </Tabs>
            </Card>
        </div>
    )
}
