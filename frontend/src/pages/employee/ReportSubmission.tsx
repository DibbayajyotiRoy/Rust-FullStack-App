import { useState, useRef } from "react"
import { Plus, Paperclip, FileText, X, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type Column } from "@/components/organisms/DataTable/DataTable"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Report {
    id: string
    title: string
    content: string
    attachmentName?: string
    status: "Submitted" | "Reviewed"
    createdAt: string
}

// Mock data
const mockReports: Report[] = [
    {
        id: "rpt-1",
        title: "Weekly Progress Report - Week 3",
        content: "Completed the user authentication module and started work on the dashboard components.",
        status: "Submitted",
        createdAt: "2026-01-15"
    },
    {
        id: "rpt-2",
        title: "Project Milestone Report",
        content: "Phase 1 of the employee portal has been completed. All core features are functional.",
        attachmentName: "milestone_report.pdf",
        status: "Reviewed",
        createdAt: "2026-01-10"
    }
]

const reportColumns: Column<Report>[] = [
    {
        header: "Title",
        accessorKey: "title",
        cell: (item) => (
            <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{item.title}</span>
            </div>
        )
    },
    {
        header: "Summary",
        accessorKey: "content",
        cell: (item) => (
            <span className="truncate max-w-[300px] block type-secondary">
                {item.content}
            </span>
        )
    },
    {
        header: "Attachment",
        accessorKey: "attachmentName",
        cell: (item) => item.attachmentName ? (
            <Badge variant="secondary" className="gap-1">
                <Paperclip className="h-3 w-3" />
                {item.attachmentName}
            </Badge>
        ) : (
            <span className="type-secondary">—</span>
        )
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: (item) => {
            const colors: Record<string, string> = {
                Submitted: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                Reviewed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            }
            return <Badge variant="secondary" className={colors[item.status]}>{item.status}</Badge>
        }
    },
    {
        header: "Submitted",
        accessorKey: "createdAt",
        cell: (item) => new Date(item.createdAt).toLocaleDateString()
    }
]

export default function ReportSubmission() {
    const [reports, setReports] = useState<Report[]>(mockReports)
    const [activeTab, setActiveTab] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Form state
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [attachment, setAttachment] = useState<File | null>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Max 10MB
            if (file.size > 10 * 1024 * 1024) {
                toast.error("File size must be less than 10MB")
                return
            }
            setAttachment(file)
        }
    }

    const handleSubmit = () => {
        if (!title.trim()) {
            toast.error("Please enter a title")
            return
        }

        if (!content.trim()) {
            toast.error("Please enter report content")
            return
        }

        const newReport: Report = {
            id: `rpt-${Date.now()}`,
            title,
            content,
            attachmentName: attachment?.name,
            status: "Submitted",
            createdAt: new Date().toISOString().split('T')[0]
        }

        // In real implementation, upload file to server here
        setReports([newReport, ...reports])
        setIsDialogOpen(false)
        setTitle("")
        setContent("")
        setAttachment(null)
        toast.success("Report submitted successfully")
    }

    const filteredReports = activeTab === "all"
        ? reports
        : reports.filter(r => r.status.toLowerCase() === activeTab)

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">Reports</h1>
                    <p className="type-secondary">Submit and track your work reports</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Report
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                        <DialogHeader>
                            <DialogTitle>Submit Report</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Title</Label>
                                <Input
                                    placeholder="Report title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Content</Label>
                                <Textarea
                                    placeholder="Describe your report in detail..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    rows={5}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Attachment (Optional)</Label>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileSelect}
                                    className="hidden"
                                    accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                />
                                {attachment ? (
                                    <div className="flex items-center gap-2 p-3 rounded-lg border bg-muted/30">
                                        <Paperclip className="h-4 w-4 text-muted-foreground" />
                                        <span className="flex-1 truncate text-sm">{attachment.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6"
                                            onClick={() => setAttachment(null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="gap-2"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Upload className="h-4 w-4" />
                                        Choose File
                                    </Button>
                                )}
                                <span className="text-xs type-secondary">
                                    Max 10MB. Supports PDF, DOC, XLS, PNG, JPG
                                </span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>Submit Report</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 border-none bg-blue-500/10">
                    <div className="text-2xl font-bold text-blue-600">
                        {reports.filter(r => r.status === "Submitted").length}
                    </div>
                    <div className="text-sm type-secondary">Pending Review</div>
                </Card>
                <Card className="p-4 border-none bg-emerald-500/10">
                    <div className="text-2xl font-bold text-emerald-600">
                        {reports.filter(r => r.status === "Reviewed").length}
                    </div>
                    <div className="text-sm type-secondary">Reviewed</div>
                </Card>
            </div>

            {/* Reports Table */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="all">All Reports</TabsTrigger>
                    <TabsTrigger value="submitted">Pending</TabsTrigger>
                    <TabsTrigger value="reviewed">Reviewed</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="flex-1 mt-4">
                    <DataTable
                        data={filteredReports}
                        columns={reportColumns}
                        total={filteredReports.length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
