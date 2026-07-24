"use client"

import { Users, BookOpen, BrainCircuit, Activity, DollarSign, Award } from "lucide-react"
import { AdminKpiCard } from "@/components/admin/admin-kpi-card"
import { DataTable } from "@/components/admin/data-table"
import { AnalyticsChartCard } from "@/components/progress/analytics-chart-card"

const recentActivityCols = [
  { key: "admin", label: "Admin Name", type: "text" as const },
  { key: "action", label: "Action Taken", type: "text" as const },
  { key: "module", label: "Module", type: "badge" as const },
  { key: "time", label: "Timestamp", type: "text" as const }
]

const recentActivityData = [
  { admin: "Super Admin", action: "Published new lesson 'Advanced Conditionals'", module: "Courses", time: "10 mins ago" },
  { admin: "Moderator_Sarah", action: "Deleted reported forum post #492", module: "Community", time: "1 hour ago" },
  { admin: "Content_Rahul", action: "Updated Mock Interview Rubric", module: "Exams", time: "2 hours ago" },
  { admin: "Super Admin", action: "Manually triggered daily XP calculation", module: "System", time: "5 hours ago" }
]

const growthData = [
  { day: 'Mon', users: 1200 }, { day: 'Tue', users: 1350 }, { day: 'Wed', users: 1400 },
  { day: 'Thu', users: 1520 }, { day: 'Fri', users: 1800 }, { day: 'Sat', users: 2100 }, { day: 'Sun', users: 2450 }
]

export default function AdminDashboardPage() {
  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of platform metrics, content status, and recent administrative actions.</p>
      </div>

      {/* KPI Row */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <AdminKpiCard title="Total Users" value="14,205" change="+12%" isPositive={true} icon={Users} />
        <AdminKpiCard title="Active Sessions" value="1,402" change="+5%" isPositive={true} icon={Activity} />
        <AdminKpiCard title="Published Lessons" value="342" change="+12" isPositive={true} icon={BookOpen} />
        <AdminKpiCard title="AI Conversations" value="45.2k" change="+18%" isPositive={true} icon={BrainCircuit} />
        <AdminKpiCard title="Certs Issued" value="8,920" change="+2%" isPositive={true} icon={Award} />
        <AdminKpiCard title="Est. Revenue" value="$42,500" change="-4%" isPositive={false} icon={DollarSign} />
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        <AnalyticsChartCard 
          title="New User Registrations (Last 7 Days)" 
          icon={Users} 
          data={growthData} 
          dataKey="users" 
          xAxisKey="day" 
          color="hsl(221.2, 83.2%, 53.3%)" // blue
        />
        <AnalyticsChartCard 
          title="Daily Active AI Sessions" 
          icon={BrainCircuit} 
          data={growthData.map(d => ({ ...d, sessions: d.users * 2.4 }))} 
          dataKey="sessions" 
          xAxisKey="day" 
          color="hsl(262.1, 83.3%, 57.8%)" // purple
        />
      </div>

      {/* Recent Activity Table */}
      <DataTable 
        title="Recent Administrative Activity"
        columns={recentActivityCols}
        data={recentActivityData}
      />

    </div>
  )
}
