import type { Column } from "@/components/organisms/DataTable/DataTable"
import { StatusPill } from "@/components/ui/status-pill"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileDown, FileType } from "lucide-react"

export interface ReportRecord {
    id: string
    name: string
    type: "CSV" | "PDF" | "XLSX"
    dateGenerated: string
    size: string
    status: "Ready" | "Processing" | "Failed"
}

export const reportColumns: Column<ReportRecord>[] = [
    {
        header: "Report Name",
        cell: (row) => (
            <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-md">
                    <FileType className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{row.name}</span>
            </div>
        ),
        className: "min-w-[250px]",
    },
    {
        header: "Type",
        cell: (row) => (
            <span className="text-muted-foreground text-xs uppercase font-semibold">{row.type}</span>
        ),
        className: "w-[80px]",
    },
    {
        header: "Date Generated",
        cell: (row) => (
            <div className="flex flex-col text-sm">
                <span className="text-muted-foreground">
                    {new Date(row.dateGenerated).toLocaleDateString()}
                </span>
                <span className="text-xs text-muted-foreground/50">
                    {new Date(row.dateGenerated).toLocaleTimeString()}
                </span>
            </div>
        ),
        className: "min-w-[150px]",
    },
    {
        header: "Size",
        cell: (row) => (
            <span className="text-sm font-mono text-muted-foreground">{row.size}</span>
        ),
        className: "w-[100px]",
    },
    {
        header: "Status",
        cell: (row) => {
            let variant: "success" | "warning" | "error" | "neutral" = "neutral"
            switch (row.status) {
                case "Ready": variant = "success"; break;
                case "Processing": variant = "warning"; break;
                case "Failed": variant = "error"; break;
            }
            return <StatusPill variant={variant}>{row.status}</StatusPill>
        },
        className: "w-[120px]",
    },
    {
        header: (<span className="sr-only">Actions</span>),
        cell: (row) => (
            <div className="flex items-center justify-end gap-1">
                {row.status === "Ready" && (
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                        <FileDown className="h-4 w-4" />
                    </Button>
                )}
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        ),
        className: "w-[80px]",
    },
]
