import { useState } from "react"
import { Plus, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type Column } from "@/components/organisms/DataTable/DataTable"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

interface LeaveRequest {
    id: string
    leaveType: "Casual" | "Sick" | "Unpaid"
    startDate: string
    endDate: string
    reason: string
    status: "Pending" | "Approved" | "Rejected"
    approver?: string
    createdAt: string
}

// Mock data
const mockLeaveRequests: LeaveRequest[] = [
    {
        id: "lr-1",
        leaveType: "Casual",
        startDate: "2026-01-20",
        endDate: "2026-01-21",
        reason: "Family function to attend this weekend",
        status: "Pending",
        createdAt: "2026-01-15"
    },
    {
        id: "lr-2",
        leaveType: "Sick",
        startDate: "2026-01-10",
        endDate: "2026-01-11",
        reason: "Had severe fever and body ache",
        status: "Approved",
        approver: "John Manager",
        createdAt: "2026-01-09"
    },
    {
        id: "lr-3",
        leaveType: "Unpaid",
        startDate: "2025-12-25",
        endDate: "2025-12-31",
        reason: "Extended vacation for year end travel",
        status: "Rejected",
        approver: "John Manager",
        createdAt: "2025-12-20"
    }
]

const leaveColumns: Column<LeaveRequest>[] = [
    {
        header: "Type",
        accessorKey: "leaveType",
        cell: (item) => {
            const colors: Record<string, string> = {
                Casual: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                Sick: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                Unpaid: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            }
            return <Badge variant="secondary" className={colors[item.leaveType]}>{item.leaveType}</Badge>
        }
    },
    {
        header: "From",
        accessorKey: "startDate",
        cell: (item) => new Date(item.startDate).toLocaleDateString()
    },
    {
        header: "To",
        accessorKey: "endDate",
        cell: (item) => new Date(item.endDate).toLocaleDateString()
    },
    {
        header: "Reason",
        accessorKey: "reason",
        cell: (item) => (
            <span className="truncate max-w-[200px] block">{item.reason}</span>
        )
    },
    {
        header: "Status",
        accessorKey: "status",
        cell: (item) => {
            const colors: Record<string, string> = {
                Pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
                Approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
                Rejected: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400"
            }
            return <Badge variant="secondary" className={colors[item.status]}>{item.status}</Badge>
        }
    },
    {
        header: "Approver",
        accessorKey: "approver",
        cell: (item) => item.approver || "—"
    }
]

function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

export default function LeaveRequest() {
    const [requests, setRequests] = useState<LeaveRequest[]>(mockLeaveRequests)
    const [activeTab, setActiveTab] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form state
    const [leaveType, setLeaveType] = useState<"Casual" | "Sick" | "Unpaid">("Casual")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [reason, setReason] = useState("")

    const handleSubmit = () => {
        // Validate 5 words minimum
        if (countWords(reason) < 5) {
            toast.error("Reason must be at least 5 words")
            return
        }

        if (!startDate || !endDate) {
            toast.error("Please select start and end dates")
            return
        }

        if (new Date(startDate) > new Date(endDate)) {
            toast.error("End date must be after start date")
            return
        }

        const newRequest: LeaveRequest = {
            id: `lr-${Date.now()}`,
            leaveType,
            startDate,
            endDate,
            reason,
            status: "Pending",
            createdAt: new Date().toISOString().split('T')[0]
        }

        setRequests([newRequest, ...requests])
        setIsDialogOpen(false)
        setLeaveType("Casual")
        setStartDate("")
        setEndDate("")
        setReason("")
        toast.success("Leave request submitted successfully")
    }

    const filteredRequests = activeTab === "all"
        ? requests
        : requests.filter(r => r.status.toLowerCase() === activeTab)

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">Leave Requests</h1>
                    <p className="type-secondary">Submit and track your leave requests</p>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-2">
                            <Plus className="h-4 w-4" />
                            New Request
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Submit Leave Request</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label>Leave Type</Label>
                                <Select value={leaveType} onValueChange={(v) => setLeaveType(v as typeof leaveType)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Casual">Casual Leave</SelectItem>
                                        <SelectItem value="Sick">Sick Leave</SelectItem>
                                        <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label>End Date</Label>
                                    <Input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label>
                                    Reason <span className="text-muted-foreground">(min. 5 words)</span>
                                </Label>
                                <Textarea
                                    placeholder="Please provide a detailed reason for your leave..."
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    rows={3}
                                />
                                <span className={`text-xs ${countWords(reason) < 5 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                    {countWords(reason)} / 5 words minimum
                                </span>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleSubmit}>Submit Request</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Leave Balance */}
            <div className="grid grid-cols-3 gap-4">
                <Card className="p-4 border-none bg-blue-500/10">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <div>
                            <div className="text-xl font-bold text-blue-600">8</div>
                            <div className="text-xs type-secondary">Casual Available</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-none bg-amber-500/10">
                    <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-amber-600" />
                        <div>
                            <div className="text-xl font-bold text-amber-600">5</div>
                            <div className="text-xs type-secondary">Sick Available</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 border-none bg-gray-500/10">
                    <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-600" />
                        <div>
                            <div className="text-xl font-bold text-gray-600">∞</div>
                            <div className="text-xs type-secondary">Unpaid (No Limit)</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Requests Table */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <TabsList>
                    <TabsTrigger value="all">All Requests</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                    <TabsTrigger value="approved">Approved</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>
                <TabsContent value={activeTab} className="flex-1 mt-4">
                    <DataTable
                        data={filteredRequests}
                        columns={leaveColumns}
                        total={filteredRequests.length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
