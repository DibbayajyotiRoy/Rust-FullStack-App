import { useState } from "react"
import { Download, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/organisms/DataTable/DataTable"
import { reportColumns, type ReportRecord } from "@/components/organisms/ReportTable/columns"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const generateMockReports = (): ReportRecord[] => {
    return [
        { id: "1", name: "Monthly Attendance Summary", type: "CSV", dateGenerated: new Date().toISOString(), size: "2.4 MB", status: "Ready" },
        { id: "2", name: "Q4 Leave Balance Report", type: "PDF", dateGenerated: new Date(Date.now() - 86400000).toISOString(), size: "1.1 MB", status: "Ready" },
        { id: "3", name: "Employee Onboarding Log", type: "XLSX", dateGenerated: new Date().toISOString(), size: "-", status: "Processing" },
        { id: "4", name: "Payroll Audit Log", type: "CSV", dateGenerated: new Date(Date.now() - 172800000).toISOString(), size: "5.8 MB", status: "Failed" },
    ]
}

export default function ReportsPage() {
    const [data] = useState<ReportRecord[]>(generateMockReports())

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">Reports & Exports</h1>
                    <p className="type-secondary">Generate and download system audits</p>
                </div>
                <div className="flex items-center gap-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="gap-2">
                                <Download className="h-4 w-4" />
                                Export Data
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>Export Users (CSV)</DropdownMenuItem>
                            <DropdownMenuItem>Export Attendance (CSV)</DropdownMenuItem>
                            <DropdownMenuItem>Export Logs (JSON)</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <DataTable
                data={data}
                columns={reportColumns}
                total={data.length}
                page={1}
                pageSize={10}
                filterActions={
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Filter Type
                    </Button>
                }
            />
        </div>
    )
}
