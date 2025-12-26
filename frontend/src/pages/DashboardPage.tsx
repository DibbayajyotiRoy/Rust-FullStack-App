import { Users, UserPlus, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { BirthdayCarousel } from "@/components/dashboard/BirthdayCarousel"

export default function DashboardPage() {
  return (
    <div className="h-full space-y-4">
      {/* HEADER */}
      <div>
        <h1 className="text-lg font-semibold type-header">Dashboard</h1>
        <p className="type-secondary">
          Workforce overview & daily signals
        </p>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* CARD 1 — WORKFORCE SNAPSHOT */}
        <Card className="border-none shadow-none bg-muted/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm type-header">Workforce</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <Stat label="Total Employees" value="354" />
            <Stat label="Added (8 mo)" value="+459" positive className="text-right" />
            <Stat label="Removed (8 mo)" value="-105" negative />
            <Stat label="Net Growth" value="+354" positive className="text-right" />
          </div>
        </Card>

        {/* CARD 2 — ATTENDANCE */}
        <Card className="border-none shadow-none bg-muted/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm type-header">Today’s Attendance</div>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-sm">
            <Stat label="Present" value="312" />
            <Stat label="Absent" value="18" className="text-right" />
            <Stat label="On Leave" value="21" />
            <Stat label="Late Check-ins" value="7" negative className="text-right" />
          </div>
        </Card>

        {/* CARD 3 — ALERTS */}
        <Card className="border-none shadow-none bg-muted/40 p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm type-header">Alerts & Events</div>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </div>

          <div className="pt-1">
            <div className="mb-3 uppercase tracking-wider type-secondary font-bold">Upcoming Birthdays</div>
            <BirthdayCarousel />
          </div>
        </Card>

      </div>
    </div>
  )
}

function Stat({
  label,
  value,
  positive,
  negative,
  className,
}: {
  label: string
  value: string
  positive?: boolean
  negative?: boolean
  className?: string
}) {
  return (
    <div className={className}>
      <div className="mb-0.5 type-secondary">{label}</div>
      <div
        className={`type-normal ${positive
          ? "text-emerald-600"
          : negative
            ? "text-rose-500"
            : ""
          }`}
      >
        {value}
      </div>
    </div>
  )
}
