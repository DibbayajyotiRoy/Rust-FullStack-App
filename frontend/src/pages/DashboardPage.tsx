import { useState } from "react";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { BirthdayCarousel } from "@/components/dashboard/BirthdayCarousel";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users } from "lucide-react";


type TimeFilter = "weekly" | "monthly" | "yearly";

const weeklyData = [
  { period: "Week 1", added: 12, removed: 3 },
  { period: "Week 2", added: 15, removed: 5 },
  { period: "Week 3", added: 18, removed: 4 },
  { period: "Week 4", added: 14, removed: 6 },
  { period: "Week 5", added: 20, removed: 2 },
  { period: "Week 6", added: 16, removed: 7 },
];

const monthlyData = [
  { period: "Jan", added: 45, removed: 12 },
  { period: "Feb", added: 52, removed: 15 },
  { period: "Mar", added: 48, removed: 10 },
  { period: "Apr", added: 61, removed: 18 },
  { period: "May", added: 55, removed: 14 },
  { period: "Jun", added: 68, removed: 9 },
  { period: "Jul", added: 58, removed: 16 },
  { period: "Aug", added: 72, removed: 11 },
];

const yearlyData = [
  { period: "2019", added: 420, removed: 85 },
  { period: "2020", added: 520, removed: 120 },
  { period: "2021", added: 680, removed: 95 },
  { period: "2022", added: 750, removed: 140 },
  { period: "2023", added: 890, removed: 110 },
  { period: "2024", added: 960, removed: 130 },
];

const chartConfig = {
  added: {
    label: "Users Added",
    color: "hsl(142, 76%, 36%)",
  },
  removed: {
    label: "Users Removed",
    color: "hsl(0, 84%, 60%)",
  },
} satisfies ChartConfig;

export default function DashboardPage() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("monthly");

  const getData = () => {
    switch (timeFilter) {
      case "weekly":
        return weeklyData;
      case "monthly":
        return monthlyData;
      case "yearly":
        return yearlyData;
    }
  };

  const getTimeRange = () => {
    switch (timeFilter) {
      case "weekly":
        return "Last 6 weeks";
      case "monthly":
        return "Last 8 months";
      case "yearly":
        return "Last 6 years";
    }
  };

  const chartData = getData();

  const totalAdded = chartData.reduce((sum, item) => sum + item.added, 0);
  const totalRemoved = chartData.reduce((sum, item) => sum + item.removed, 0);
  const netGrowth = totalAdded - totalRemoved;
  const growthPercentage = ((netGrowth / totalAdded) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track employee growth and activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Added</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalAdded}</div>
            <p className="text-xs text-muted-foreground">{getTimeRange()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Removed</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalRemoved}</div>
            <p className="text-xs text-muted-foreground">{getTimeRange()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Growth</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">+{netGrowth}</div>
            <p className="text-xs text-muted-foreground">{growthPercentage}% growth rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee Activity & Birthdays Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Card - Takes up 2 columns */}
        <Card className="lg:col-span-2 flex flex-col">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Employee Activity
                  <Badge
                    variant="outline"
                    className="text-green-600 bg-green-600/10 border-green-600/20"
                  >
                    <TrendingUp className="h-3 w-3 mr-1" />
                    <span>+{growthPercentage}%</span>
                  </Badge>
                </CardTitle>
                <CardDescription>{getTimeRange()}</CardDescription>
              </div>

              {/* Time Filter Tabs */}
              <div className="flex gap-1 p-1 bg-muted rounded-lg self-start sm:self-auto">
                <button
                  onClick={() => setTimeFilter("weekly")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeFilter === "weekly"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                    }`}
                >
                  Weekly
                </button>
                <button
                  onClick={() => setTimeFilter("monthly")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeFilter === "monthly"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                    }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setTimeFilter("yearly")}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${timeFilter === "yearly"
                    ? "bg-background shadow-sm"
                    : "hover:bg-background/50"
                    }`}
                >
                  Yearly
                </button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 min-h-[300px]">
            <ChartContainer config={chartConfig} className="h-full w-full">
              <LineChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 12,
                  right: 12,
                  top: 12,
                  bottom: 12,
                }}
              >
                <CartesianGrid vertical={false} strokeDasharray="3 3" opacity={0.3} />
                <XAxis
                  dataKey="period"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fontSize: 12 }}
                />
                <ChartTooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={<ChartTooltipContent />}
                />
                <defs>
                  <filter
                    id="glow-green"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <filter
                    id="glow-red"
                    x="-50%"
                    y="-50%"
                    width="200%"
                    height="200%"
                  >
                    <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <Line
                  dataKey="added"
                  type="monotone"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "hsl(142, 76%, 36%)",
                  }}
                  filter="url(#glow-green)"
                />
                <Line
                  dataKey="removed"
                  type="monotone"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{
                    r: 6,
                    fill: "hsl(0, 84%, 60%)",
                  }}
                  filter="url(#glow-red)"
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Birthday Carousel - Takes up 1 column */}
        <div className="lg:col-span-1 h-full min-h-[350px]">
          <BirthdayCarousel />
        </div>
      </div>
    </div>
  );
}