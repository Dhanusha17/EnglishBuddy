"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Trophy, Clock, Star, TrendingUp, Download, LayoutDashboard,
  BrainCircuit, BookOpen, Target, FileText, Briefcase
} from "lucide-react"
import { Button } from "@/components/ui/button"

import { StatCard } from "@/components/progress/stat-card"
import { AnalyticsChartCard } from "@/components/progress/analytics-chart-card"
import { GoalTrackerCard } from "@/components/progress/goal-tracker-card"
import { ActivityCalendarCard } from "@/components/progress/activity-calendar-card"
import { SkillRadarCard } from "@/components/progress/skill-radar-card"
import { LeaderboardCard } from "@/components/tests/leaderboard-card"
import { CertificateCard } from "@/components/tests/certificate-card"
import { MetricsCard } from "@/components/progress/metrics-card" // Reusable generic stat list
import { ProgressRing } from "@/components/practice/progress-ring"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/store/useAppStore"

// Mock Data
const studyTimeData = [
  { day: 'Mon', hours: 1.2 }, { day: 'Tue', hours: 2.5 }, { day: 'Wed', hours: 1.8 },
  { day: 'Thu', hours: 3.0 }, { day: 'Fri', hours: 2.1 }, { day: 'Sat', hours: 4.5 }, { day: 'Sun', hours: 3.2 }
]
const xpGrowthData = [
  { day: 'Mon', xp: 500 }, { day: 'Tue', xp: 1200 }, { day: 'Wed', xp: 1800 },
  { day: 'Thu', xp: 3000 }, { day: 'Fri', xp: 3800 }, { day: 'Sat', xp: 5500 }, { day: 'Sun', xp: 6200 }
]
const radarData = [
  { skill: 'Listening', score: 85, fullMark: 100 },
  { skill: 'Speaking', score: 65, fullMark: 100 },
  { skill: 'Reading', score: 90, fullMark: 100 },
  { skill: 'Writing', score: 70, fullMark: 100 },
  { skill: 'Grammar', score: 80, fullMark: 100 },
  { skill: 'Vocabulary', score: 75, fullMark: 100 },
]

export default function ProgressDashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAppStore()

  return (
    <div className="flex flex-col gap-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Progress & Analytics</h1>
          <p className="text-muted-foreground">Your central hub for learning metrics, AI insights, and placement readiness.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="shadow-sm">
            <Download className="mr-2 h-4 w-4" /> Export PDF Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-6" onValueChange={setActiveTab}>
        
        {/* Navigation Tabs */}
        <div className="overflow-x-auto pb-2 custom-scrollbar">
          <TabsList className="bg-background border h-12 p-1 min-w-max">
            <TabsTrigger value="overview" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><LayoutDashboard className="h-4 w-4 mr-2" /> Overview</TabsTrigger>
            <TabsTrigger value="learning" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><BookOpen className="h-4 w-4 mr-2" /> Learning</TabsTrigger>
            <TabsTrigger value="exams" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><FileText className="h-4 w-4 mr-2" /> Exams & Certs</TabsTrigger>
            <TabsTrigger value="ai" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><BrainCircuit className="h-4 w-4 mr-2" /> AI Usage</TabsTrigger>
            <TabsTrigger value="placement" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><Briefcase className="h-4 w-4 mr-2" /> Placement</TabsTrigger>
          </TabsList>
        </div>

        {/* Tab Content: OVERVIEW */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {/* Left Main Area */}
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
              
              {/* High-level Stats */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total XP" value={user.xp.toLocaleString()} icon={Star} colorClass="bg-yellow-500" trend={{ value: "+1,200", isPositive: true, label: "this week" }} />
                <StatCard title="Study Hours" value="128h" icon={Clock} colorClass="bg-blue-500" trend={{ value: "+5h", isPositive: true, label: "this week" }} />
                <StatCard title="Current Streak" value={`${user.streak} Days`} icon={TrendingUp} colorClass="bg-orange-500" />
                <StatCard title="Placement Ready" value="68%" icon={Target} colorClass="bg-violet-500" trend={{ value: "+2%", isPositive: true, label: "from last mock" }} />
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6">
                <AnalyticsChartCard 
                  title="Study Time (Last 7 Days)" 
                  icon={Clock} 
                  data={studyTimeData} 
                  dataKey="hours" 
                  xAxisKey="day" 
                  color="hsl(var(--primary))" 
                />
                <SkillRadarCard data={radarData} />
              </div>

              {/* Activity Calendar */}
              <ActivityCalendarCard />

            </div>

            {/* Right Panel */}
            <div className="flex flex-col gap-6">
              <GoalTrackerCard />
                <LeaderboardCard 
                  title="Weekly Top Learners"
                  entries={[
                    { id: "1", name: "Rahul S.", score: 1540, rank: 1 },
                    { id: "2", name: "Priya M.", score: 1200, rank: 2 },
                    { id: "3", name: "You", score: 890, rank: 3, isCurrentUser: true }
                  ]}
                />
              
              {/* Personal Insights */}
              <Card className="shadow-sm border-none bg-primary/5">
                <CardHeader className="pb-3 border-b border-primary/10">
                  <CardTitle className="text-base text-primary flex items-center gap-2">
                    <BrainCircuit className="h-4 w-4" /> Personal Insights
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Best Study Time</p>
                    <p className="text-sm font-medium">Evening (8 PM - 10 PM)</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Weakest Skill</p>
                    <p className="text-sm font-medium text-destructive">Speaking (Fluency)</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-muted-foreground uppercase">Recommendation</p>
                    <p className="text-sm font-medium">Try a 10-minute AI Speaking Session today.</p>
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </TabsContent>

        {/* Tab Content: EXAMS & CERTS */}
        <TabsContent value="exams" className="mt-0">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Reusing AnalyticsCard from Tests module for breakdown */}
              <MetricsCard 
                title="Exam & Assessment Summary"
                description="Your complete history of assessments."
                metrics={[
                  { label: "Tests Taken", value: "24", change: "", positive: true },
                  { label: "Avg Score", value: "82%", change: "+5%", positive: true },
                  { label: "Highest Score", value: "98%", change: "", positive: true },
                  { label: "Certificates", value: "3", change: "+1", positive: true },
                ]}
              />

              <div className="grid sm:grid-cols-2 gap-6">
                <CertificateCard title="B2 Upper Intermediate" level="B2" isUnlocked={true} />
                <CertificateCard title="Business English Pro" level="Specialization" isUnlocked={true} />
                <CertificateCard title="C1 Advanced Mastery" level="C1" isUnlocked={false} progress={40} />
              </div>

            </div>
            
            <div className="space-y-6">
              <Card className="shadow-sm border-none bg-card overflow-hidden relative">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base text-center text-muted-foreground">Overall Exam Average</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center pb-6">
                  <ProgressRing score={450} level="Intermediate" percentile="Top 40%" />
                  <p className="text-sm font-medium text-center mt-4 px-4 text-muted-foreground">
                    You score higher than <strong className="text-foreground">75%</strong> of users at your level.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab Content: AI USAGE (Mock) */}
        <TabsContent value="ai" className="mt-0">
          <div className="grid lg:grid-cols-2 gap-6">
             <AnalyticsChartCard 
                title="AI Mentor Usage (Tokens/Interactions)" 
                icon={BrainCircuit} 
                data={xpGrowthData} 
                dataKey="xp" 
                xAxisKey="day" 
                color="hsl(280, 100%, 60%)" 
              />
              
              <MetricsCard 
                title="AI Usage Metrics"
                description="How AI has improved your metrics."
                metrics={[
                  { label: "Chats Initiated", value: "142", change: "", positive: true },
                  { label: "Words Corrected", value: "840", change: "+120", positive: true },
                  { label: "Speaking Hrs", value: "14h", change: "", positive: true },
                  { label: "Vocabulary Added", value: "312", change: "+45", positive: true },
                ]}
              />
          </div>
        </TabsContent>

        {/* Other tabs would follow similar patterns */}
        <TabsContent value="learning" className="mt-0 h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
          Detailed Learning Analytics View (Similar to Overview)
        </TabsContent>

        <TabsContent value="placement" className="mt-0 h-64 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
          Detailed Placement Readiness View (Similar to Overview)
        </TabsContent>

      </Tabs>
    </div>
  )
}
