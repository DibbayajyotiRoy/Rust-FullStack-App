import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DataTable } from "@/components/organisms/DataTable/DataTable"
import { leaveColumns, type LeaveRequest } from "@/components/organisms/LeaveTable/columns"
import { KeyValueGrid } from "@/components/molecules/KeyValueGrid"

// Mock Data
const generateMockLeaves = (): LeaveRequest[] => {
    return Array.from({ length: 8 }).map((_, i) => ({
        id: `leave-${i}`,
        employee: { name: i % 2 === 0 ? "John Doe" : "Sarah Connor" },
        leaveType: i % 3 === 0 ? "Sick" : "Vacation",
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        duration: "2 days",
        status: i === 0 ? "Pending" : i % 2 === 0 ? "Approved" : "Rejected",
        approver: i === 0 ? undefined : "Admin User"
    }))
}

export default function LeavePage() {
    const [data] = useState<LeaveRequest[]>(generateMockLeaves())
    const [activeTab, setActiveTab] = useState("requests")

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Header */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-lg font-semibold type-header">Leave Management</h1>
                    <p className="type-secondary">Manage requests and balances</p>
                </div>
                <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    New Request
                </Button>
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
                        columns={leaveColumns}
                        total={data.length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
                <TabsContent value="pending" className="flex-1 mt-4">
                    <DataTable
                        data={data.filter(d => d.status === "Pending")}
                        columns={leaveColumns}
                        total={data.filter(d => d.status === "Pending").length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
                <TabsContent value="history" className="flex-1 mt-4">
                    <DataTable
                        data={data.filter(d => d.status !== "Pending")}
                        columns={leaveColumns}
                        total={data.filter(d => d.status !== "Pending").length}
                        page={1}
                        pageSize={10}
                    />
                </TabsContent>
            </Tabs>
        </div>
    )
}
