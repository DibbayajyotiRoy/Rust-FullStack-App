import { Activity, useState } from "react"
import { useParams } from "react-router-dom"
import { useUsers } from "@/state/user.store"
import { ProfileHeader } from "@/components/organisms/Profile/ProfileHeader"
import { KeyValueGrid } from "@/components/molecules/KeyValueGrid"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Clock, ShieldCheck } from "lucide-react"

export default function UserProfilePage() {
    const { id } = useParams<{ id: string }>()
    const { users } = useUsers()
    const [activeTab, setActiveTab] = useState("overview")

    // Real app would fetch specific user by ID if not in store
    const user = users.find(u => u.id === id)

    if (!user) {
        return (
            <div className="flex items-center justify-center h-[50vh] text-muted-foreground">
                User not found
            </div>
        )
    }

    return (
        <div className="space-y-6 max-w-5xl mx-auto pb-10">
            <ProfileHeader user={user} />

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-transparent p-0 border-b w-full justify-start rounded-none h-auto">
                    <TabsTrigger
                        value="overview"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Overview
                    </TabsTrigger>
                    <TabsTrigger
                        value="documents"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        Documents
                    </TabsTrigger>
                    <TabsTrigger
                        value="history"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-2"
                    >
                        History
                    </TabsTrigger>
                </TabsList>

                <Activity mode={activeTab === 'overview' ? 'visible' : 'hidden'}>
                    <TabsContent value="overview" forceMount className="space-y-6 pt-6">
                        {/* Personal Info Section */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                <h2>Personal & Employment</h2>
                            </div>
                            <div className="p-6 bg-card border rounded-lg">
                                <KeyValueGrid
                                    items={[
                                        { label: "Full Name", value: user.username },
                                        { label: "Email Address", value: user.email },
                                        { label: "Employee ID", value: user.id.slice(0, 8).toUpperCase() }, // Mock ID format
                                        { label: "Department", value: "Engineering" }, // Mock
                                        { label: "Reports To", value: "Sarah Connor" }, // Mock
                                        { label: "Date Joined", value: new Date(user.created_at).toLocaleDateString() },
                                    ]}
                                />
                            </div>
                        </section>

                        {/* Attendance Summary Section (Mock) */}
                        <section className="space-y-4">
                            <div className="flex items-center gap-2 text-lg font-semibold text-foreground">
                                <Clock className="h-5 w-5 text-muted-foreground" />
                                <h2>Attendance Summary</h2>
                            </div>
                            <div className="p-6 bg-card border rounded-lg">
                                <KeyValueGrid
                                    columns={3}
                                    items={[
                                        { label: "Work Schedule", value: "Mon-Fri (9:00 - 18:00)" },
                                        { label: "Avg. Check-in", value: "09:04 AM" },
                                        { label: "Avg. Check-out", value: "06:15 PM" },
                                    ]}
                                />
                            </div>
                        </section>
                    </TabsContent>
                </Activity>

                <Activity mode={activeTab === 'documents' ? 'visible' : 'hidden'}>
                    <TabsContent value="documents" forceMount className="pt-6">
                        <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg text-muted-foreground">
                            <FileText className="h-10 w-10 mb-4 opacity-50" />
                            <p>No documents uploaded yet.</p>
                        </div>
                    </TabsContent>
                </Activity>

                <Activity mode={activeTab === 'history' ? 'visible' : 'hidden'}>
                    <TabsContent value="history" forceMount className="pt-6">
                        <div className="p-6 bg-muted/30 rounded-lg text-center text-muted-foreground">
                            Audit log implementation pending...
                        </div>
                    </TabsContent>
                </Activity>
            </Tabs>
        </div>
    )
}
