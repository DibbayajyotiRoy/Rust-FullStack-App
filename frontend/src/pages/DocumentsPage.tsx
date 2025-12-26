import { useState } from "react"
import { Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/organisms/DataTable/DataTable"
import { documentColumns, type DocumentRecord } from "@/components/organisms/DocumentTable/columns"

const generateMockDocs = (): DocumentRecord[] => {
    return [
        { id: "1", name: "Employee Handbook 2024", category: "Policy", uploadedBy: "HR Admin", date: new Date().toISOString(), acknowledged: true },
        { id: "2", name: "Safety Guidelines", category: "Compliance", uploadedBy: "Safety Officer", date: new Date().toISOString(), acknowledged: false },
        { id: "3", name: "Offer Letter", category: "Contract", uploadedBy: "HR Admin", date: "2024-01-15", acknowledged: true },
    ]
}

export default function DocumentsPage() {
    const [data] = useState<DocumentRecord[]>(generateMockDocs())

    return (
        <div className="flex flex-col gap-6 h-full">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">Documents</h1>
                    <p className="type-secondary">Central repository for policies and contracts</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Document
                </Button>
            </div>

            <DataTable
                data={data}
                columns={documentColumns}
                total={data.length}
                page={1}
                pageSize={10}
            />
        </div>
    )
}
