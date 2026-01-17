import { useState } from "react"
import { Download, Eye, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DataTable, type Column } from "@/components/organisms/DataTable/DataTable"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Payslip {
    id: string
    periodStart: string
    periodEnd: string
    grossSalary: number
    deductions: number
    netSalary: number
    createdAt: string
}

// Mock data
const mockPayslips: Payslip[] = [
    {
        id: "ps-1",
        periodStart: "2026-01-01",
        periodEnd: "2026-01-31",
        grossSalary: 75000,
        deductions: 12500,
        netSalary: 62500,
        createdAt: "2026-01-31"
    },
    {
        id: "ps-2",
        periodStart: "2025-12-01",
        periodEnd: "2025-12-31",
        grossSalary: 75000,
        deductions: 12000,
        netSalary: 63000,
        createdAt: "2025-12-31"
    },
    {
        id: "ps-3",
        periodStart: "2025-11-01",
        periodEnd: "2025-11-30",
        grossSalary: 72000,
        deductions: 11800,
        netSalary: 60200,
        createdAt: "2025-11-30"
    }
]

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount)
}

const formatPeriod = (start: string) => {
    const startDate = new Date(start)
    return startDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

export default function Payslips() {
    const [payslips] = useState<Payslip[]>(mockPayslips)
    const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null)
    const [yearFilter, setYearFilter] = useState<string>("all")

    const years = [...new Set(payslips.map(p => new Date(p.periodStart).getFullYear().toString()))]

    const filteredPayslips = yearFilter === "all"
        ? payslips
        : payslips.filter(p => new Date(p.periodStart).getFullYear().toString() === yearFilter)

    const payslipColumns: Column<Payslip>[] = [
        {
            header: "Period",
            accessorKey: "periodStart",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                        {formatPeriod(item.periodStart)}
                    </span>
                </div>
            )
        },
        {
            header: "Gross",
            accessorKey: "grossSalary",
            cell: (item) => formatCurrency(item.grossSalary)
        },
        {
            header: "Deductions",
            accessorKey: "deductions",
            cell: (item) => (
                <span className="text-rose-500">
                    -{formatCurrency(item.deductions)}
                </span>
            )
        },
        {
            header: "Net Salary",
            accessorKey: "netSalary",
            cell: (item) => (
                <span className="font-semibold text-emerald-600">
                    {formatCurrency(item.netSalary)}
                </span>
            )
        },
        {
            header: "",
            cell: (item) => (
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                            e.stopPropagation()
                            setSelectedPayslip(item)
                        }}
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                            e.stopPropagation()
                            // In real implementation, download PDF
                            console.log("Download payslip:", item.id)
                        }}
                    >
                        <Download className="h-4 w-4" />
                    </Button>
                </div>
            )
        }
    ]

    // Calculate totals for current year
    const currentYearPayslips = payslips.filter(
        p => new Date(p.periodStart).getFullYear() === new Date().getFullYear()
    )
    const totalEarned = currentYearPayslips.reduce((acc, p) => acc + p.netSalary, 0)
    const totalDeductions = currentYearPayslips.reduce((acc, p) => acc + p.deductions, 0)

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">My Payslips</h1>
                    <p className="type-secondary">View and download your salary slips</p>
                </div>
                <Select value={yearFilter} onValueChange={setYearFilter}>
                    <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Filter by year" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Years</SelectItem>
                        {years.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Card className="p-4 border-none bg-emerald-500/10">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        <div>
                            <div className="text-xl font-bold text-emerald-600">
                                {formatCurrency(totalEarned)}
                            </div>
                            <div className="text-xs type-secondary">Total Earned (YTD)</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-none bg-rose-500/10">
                    <div className="flex items-center gap-3">
                        <DollarSign className="h-5 w-5 text-rose-500" />
                        <div>
                            <div className="text-xl font-bold text-rose-500">
                                {formatCurrency(totalDeductions)}
                            </div>
                            <div className="text-xs type-secondary">Total Deductions (YTD)</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-none bg-blue-500/10">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                            <div className="text-xl font-bold text-blue-600">
                                {currentYearPayslips.length}
                            </div>
                            <div className="text-xs type-secondary">Payslips This Year</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Payslips Table */}
            <Card className="flex-1 p-4 border-none bg-muted/30">
                <DataTable
                    data={filteredPayslips}
                    columns={payslipColumns}
                    total={filteredPayslips.length}
                    page={1}
                    pageSize={12}
                />
            </Card>

            {/* Payslip Detail Dialog */}
            <Dialog open={!!selectedPayslip} onOpenChange={() => setSelectedPayslip(null)}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>
                            Payslip - {selectedPayslip && formatPeriod(selectedPayslip.periodStart)}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedPayslip && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-lg bg-muted/50 space-y-3">
                                <div className="flex justify-between items-center">
                                    <span className="type-secondary">Gross Salary</span>
                                    <span className="font-medium">{formatCurrency(selectedPayslip.grossSalary)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="type-secondary">Deductions</span>
                                    <span className="text-rose-500">-{formatCurrency(selectedPayslip.deductions)}</span>
                                </div>
                                <hr className="border-border" />
                                <div className="flex justify-between items-center">
                                    <span className="font-medium">Net Salary</span>
                                    <span className="font-bold text-lg text-emerald-600">
                                        {formatCurrency(selectedPayslip.netSalary)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button className="flex-1 gap-2" variant="outline">
                                    <Download className="h-4 w-4" />
                                    Download PDF
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
