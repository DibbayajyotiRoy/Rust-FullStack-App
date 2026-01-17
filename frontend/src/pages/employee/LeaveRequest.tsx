import { useState, useEffect } from "react"
import { Plus, Calendar as CalendarIcon, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type Column } from "@/components/organisms/DataTable/DataTable"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

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

// Helper to count words
function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length
}

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
            // Ensure fallback key if backend sends something unexpected
            const colorClass = colors[item.leaveType] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
            return <Badge variant="secondary" className={colorClass}>{item.leaveType}</Badge>
        }
    },
    {
        header: "From",
        accessorKey: "startDate",
        cell: (item) => format(new Date(item.startDate), "MMM dd, yyyy")
    },
    {
        header: "To",
        accessorKey: "endDate",
        cell: (item) => format(new Date(item.endDate), "MMM dd, yyyy")
    },
    {
        header: "Reason",
        accessorKey: "reason",
        cell: (item) => (
            <span className="truncate max-w-[200px] block" title={item.reason}>{item.reason}</span>
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
            const colorClass = colors[item.status] || "bg-gray-100 text-gray-700"
            return <Badge variant="secondary" className={colorClass}>{item.status}</Badge>
        }
    },
    {
        header: "Approver",
        accessorKey: "approver",
        cell: (item) => item.approver || "—"
    }
]

export default function LeaveRequest() {
    const [requests, setRequests] = useState<LeaveRequest[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("all")
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    // Form state
    const [leaveType, setLeaveType] = useState<"Casual" | "Sick" | "Unpaid">("Casual")
    const [startDate, setStartDate] = useState<Date | undefined>(undefined)
    const [endDate, setEndDate] = useState<Date | undefined>(undefined)
    const [reason, setReason] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Fetch Requests
    useEffect(() => {
        fetchRequests()
    }, [])

    const fetchRequests = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/leave-requests')
            if (res.ok) {
                const data = await res.json()
                // Map backend snake_case to frontend camelCase if needed, 
                // but checking rust model, status/leave_type are serialized as strings.
                // Assuming backend returns array of objects with snake_case keys:
                // leave_type, start_date, etc.
                const mapped = data.map((d: any) => ({
                    id: d.id,
                    leaveType: d.leave_type, // "Casual", "Sick", etc.
                    startDate: d.start_date,
                    endDate: d.end_date,
                    reason: d.reason,
                    status: d.status,
                    approver: d.approver_name, // Backend provides joined name
                    createdAt: d.created_at
                }))
                setRequests(mapped)
            } else {
                toast.error("Failed to fetch leave requests")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async () => {
        // Validate 5 words minimum
        if (countWords(reason) < 5) {
            toast.error("Reason must be at least 5 words")
            return
        }

        if (!startDate || !endDate) {
            toast.error("Please select start and end dates")
            return
        }

        if (startDate > endDate) {
            toast.error("End date must be after start date")
            return
        }

        setIsSubmitting(true)
        try {
            const payload = {
                leave_type: leaveType,
                start_date: format(startDate, 'yyyy-MM-dd'),
                end_date: format(endDate, 'yyyy-MM-dd'),
                reason
            }

            const res = await fetch('/api/leave-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (res.ok) {
                toast.success("Leave request submitted successfully")
                setIsDialogOpen(false)
                // Reset form
                setLeaveType("Casual")
                setStartDate(undefined)
                setEndDate(undefined)
                setReason("")
                // Refresh list
                fetchRequests()
            } else {
                toast.error("Failed to submit request")
            }
        } catch (error) {
            toast.error("Error submitting request")
        } finally {
            setIsSubmitting(false)
        }
    }

    const filteredRequests = activeTab === "all"
        ? requests
        : requests.filter(r => r.status.toLowerCase() === activeTab)

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading your requests...</div>
    }

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
                    {/* Increased z-index for DialogContent to ensure it sits above everything, 
                        though Shadcn Dialog usually handles this. The issue might be Select z-index. */}
                    <DialogContent className="sm:max-w-[500px]">
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
                                    <SelectContent className="z-[9999]">
                                        <SelectItem value="Casual">Casual Leave</SelectItem>
                                        <SelectItem value="Sick">Sick Leave</SelectItem>
                                        <SelectItem value="Unpaid">Unpaid Leave</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label>Start Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !startDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={startDate}
                                                onSelect={setStartDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="grid gap-2">
                                    <Label>End Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !endDate && "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0 z-[9999]" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={endDate}
                                                onSelect={setEndDate}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
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
                            <Button onClick={handleSubmit} disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Leave Balance - Static for now, can be fetched if API provided balance endpoint */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Card className="p-4 border-none bg-blue-500/10">
                    <div className="flex items-center gap-3">
                        <CalendarIcon className="h-5 w-5 text-blue-600" />
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
                        <CalendarIcon className="h-5 w-5 text-gray-600" />
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
