import type { Column } from "@/components/organisms/DataTable/DataTable"
import { InlineIconText } from "@/components/ui/inline-icon-text"
import { StatusPill } from "@/components/ui/status-pill"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, FileText, Download } from "lucide-react"

export interface DocumentRecord {
    id: string
    name: string
    category: string
    uploadedBy: string
    date: string
    acknowledged: boolean
}

export const documentColumns: Column<DocumentRecord>[] = [
    {
        header: "Document Name",
        cell: (row) => (
            <div className="flex items-center gap-2">
                <div className="p-2 bg-muted rounded-md">
                    <FileText className="h-4 w-4 text-primary" />
                </div>
                <span className="font-medium">{row.name}</span>
            </div>
        ),
        className: "min-w-[250px]",
    },
    {
        header: "Category",
        cell: (row) => (
            <span className="text-muted-foreground">{row.category}</span>
        ),
        className: "min-w-[150px]",
    },
    {
        header: "Uploaded By",
        cell: (row) => (
            <InlineIconText icon={FileText} text={row.uploadedBy} iconClassName="hidden" />
        ),
        className: "min-w-[150px]",
    },
    {
        header: "Date",
        cell: (row) => (
            <span className="text-muted-foreground text-sm">
                {new Date(row.date).toLocaleDateString()}
            </span>
        ),
        className: "min-w-[120px]",
    },
    {
        header: "Status",
        cell: (row) => (
            <StatusPill variant={row.acknowledged ? "success" : "warning"}>
                {row.acknowledged ? "Acknowledged" : "Pending Action"}
            </StatusPill>
        ),
        className: "min-w-[140px]",
    },
    {
        header: (<span className="sr-only">Actions</span>),
        cell: () => (
            <div className="flex items-center justify-end gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </div>
        ),
        className: "w-[80px]",
    },
]
