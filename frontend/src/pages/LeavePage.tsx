import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable, type Column } from "@/components/organisms/DataTable/DataTable"
import { KeyValueGrid } from "@/components/molecules/KeyValueGrid"
import { toast } from "sonner"
import { AvatarBadge } from "@/components/ui/avatar-badge"
import { StatusPill } from "@/components/ui/status-pill"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"
import { useAuth } from "@/contexts/auth.context"
import LeaveRequest from "./employee/LeaveRequest"

// Define Admin Leave Interface
interface LeaveRequestAdmin {
    id: string
    employee: { name: string; avatar?: string }
    leaveType: "Sick" | "Vacation" | "Personal" | "Maternity" | "Casual" | "Unpaid"
    startDate: string
    endDate: string
    duration: string
    status: "Pending" | "Approved" | "Rejected"
    approver?: string
}

export default function LeavePage() {
    const { user, loading: authLoading } = useAuth()

    // Admin View State
    const [data, setData] = useState<LeaveRequestAdmin[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState("requests")

    // Determine if user is Admin/Manager based on role_name
    // Adjust these string checks based on your actual role names
    const isAdmin = user?.role_name === "Superadmin" || user?.role_name === "Manager" || user?.role_name === "Admin"

    if (authLoading) {
        return <div>Loading session...</div>
    }

    // Unconditionally render Employee View if not admin
    if (!isAdmin) {
        return <LeaveRequest />
    }

    // --- Admin View Logic Below ---

    const handleStatusUpdate = async (id: string, status: "Approved" | "Rejected") => {
        try {
            const res = await fetch(`/api/leave-requests/${id}/status`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            })

            if (res.ok) {
                toast.success(`Leave request ${status}`)
                fetchLeaves() // Refresh data
            } else {
                toast.error("Failed to update status")
            }
        } catch (error) {
            console.error(error)
            toast.error("Error connecting to server")
        }
    }

    const columns: Column<LeaveRequestAdmin>[] = [
        {
            header: "Employee",
            cell: (row) => (
                <AvatarBadge
                    name={row.employee.name}
                    src={row.employee.avatar}
                />
            ),
            className: "min-w-[200px]",
        },
        {
            header: "Leave Type",
            cell: (row) => (
                <span className="font-medium">{row.leaveType}</span>
            ),
            className: "min-w-[120px]",
        },
        {
            header: "Date Range",
            cell: (row) => (
                <div className="flex flex-col text-sm">
                    <span className="text-muted-foreground">
                        {new Date(row.startDate).toLocaleDateString()} - {new Date(row.endDate).toLocaleDateString()}
                    </span>
                </div>
            ),
            className: "min-w-[180px]",
        },
        {
            header: "Status",
            cell: (row) => {
                let variant: "success" | "warning" | "error" | "neutral" = "neutral"
                switch (row.status) {
                    case "Approved": variant = "success"; break;
                    case "Pending": variant = "warning"; break;
                    case "Rejected": variant = "error"; break;
                }
                return <StatusPill variant={variant}>{row.status}</StatusPill>
            },
            className: "w-[120px]",
        },
        {
            header: "Approver",
            cell: (row) => (
                <span className="text-muted-foreground text-sm">{row.approver || "-"}</span>
            ),
            className: "min-w-[150px]",
        },
        {
            header: <div className="text-right">Actions</div>,
            cell: (row) => (
                <div className="flex gap-2 justify-end">
                    {row.status === "Pending" && (
                        <>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 border-emerald-200"
                                onClick={() => handleStatusUpdate(row.id, "Approved")}
                                title="Approve"
                            >
                                <Check className="h-4 w-4" />
                            </Button>
                            <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 text-rose-600 hover:text-rose-700 hover:bg-rose-50 border-rose-200"
                                onClick={() => handleStatusUpdate(row.id, "Rejected")}
                                title="Reject"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </>
                    )}
                </div>
            ),
            className: "min-w-[100px]",
        }
    ]

    const fetchLeaves = async () => {
        try {
            setLoading(true)
            // Fetch ALL requests for admin view
            const res = await fetch('/api/leave-requests/all')
            if (res.ok) {
                const json = await res.json()
                const mapped = json.map((d: any) => ({
                    id: d.id,
                    employee: { name: d.username || d.email || "Employee" },
                    leaveType: d.leave_type,
                    startDate: d.start_date,
                    endDate: d.end_date,
                    duration: "N/A",
                    status: d.status,
                    approver: d.approved_by ? "Admin" : undefined
                }))
                setData(mapped)
            }
        } catch (err) {
            console.error(err)
            toast.error("Failed to fetch leave requests")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        // Only fetch if admin
        if (isAdmin) {
            fetchLeaves()
        }
    }, [isAdmin]) // Re-run if role changes

    if (loading) {
        return <div className="p-8 text-center text-muted-foreground">Loading request data...</div>
    }

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">Leave Management</h1>
                    <p className="type-secondary">Manage requests and balances</p>
                </div>
            </div>

            {/* Balance Section (Mini Table styled as Grid for now) */}
            <section className="p-4 bg-muted/30 rounded-lg border">
                <h3 className="text-sm font-medium mb-3">My Balances</h3>
                <KeyValueGrid
                    columns={3}
                    items={[
                        { label: "Vacation", value: "12 Days Available" },
                        { label: "Sick Leave", value: "5 Days Available" },
                        { label: "Personal", value: "2 Days Available" },
                    ]}
                />
            </section>

            {/* Main Content */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="requests">All Requests</TabsTrigger>
                        <TabsTrigger value="pending">Pending Approval</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="requests" className="flex-1 mt-4">
                    <DataTable
                        data={data}
                        columns={columns}
                        total={data.length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
                <TabsContent value="pending" className="flex-1 mt-4">
                    <DataTable
                        data={data.filter(d => d.status === "Pending")}
                        columns={columns}
                        total={data.filter(d => d.status === "Pending").length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
                <TabsContent value="history" className="flex-1 mt-4">
                    <DataTable
                        data={data.filter(d => d.status !== "Pending")}
                        columns={columns}
                        total={data.filter(d => d.status !== "Pending").length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
