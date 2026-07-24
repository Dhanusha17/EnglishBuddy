"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, FileText, BrainCircuit, Users, Download, Sparkles, BookOpen, Mic } from "lucide-react"
import { Button } from "@/components/ui/button"

import { ProfileCard } from "@/components/profile/profile-card"
import { ActivityTimeline } from "@/components/profile/activity-timeline"
import { QuickActionCard } from "@/components/profile/quick-action-card"
import { AchievementCard } from "@/components/profile/achievement-card"
import { MetricsCard } from "@/components/progress/metrics-card"

export default function ProfileDashboardPage() {
  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto">
      
      {/* Hero Section */}
      <ProfileCard />

      <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 xl:col-span-3">
          <Tabs defaultValue="achievements" className="w-full space-y-6">
            
            <div className="overflow-x-auto pb-2 custom-scrollbar">
              <TabsList className="bg-background border h-12 p-1 min-w-max">
                <TabsTrigger value="achievements" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><Trophy className="h-4 w-4 mr-2" /> Achievements</TabsTrigger>
                <TabsTrigger value="learning" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><BookOpen className="h-4 w-4 mr-2" /> Learning Profile</TabsTrigger>
                <TabsTrigger value="exams" className="h-full px-6 data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-lg font-medium"><FileText className="h-4 w-4 mr-2" /> Exam History</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="achievements" className="mt-0">
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                <AchievementCard title="7-Day Streak" description="Completed learning tasks for 7 consecutive days." icon={Flame} colorClass="bg-orange-500" />
                <AchievementCard title="Grammar Master" description="Scored 90%+ in 5 Advanced Grammar tests." icon={Sparkles} colorClass="bg-purple-500" />
                <AchievementCard title="Speaking Star" description="Practiced speaking for 10 hours with AI." icon={Mic} progress={75} colorClass="bg-rose-500" />
                <AchievementCard title="Community Hero" description="Received 50 upvotes on forum answers." icon={Users} progress={42} colorClass="bg-blue-500" />
                <AchievementCard title="Placement Ready" description="Achieve >80% Readiness Score." icon={Trophy} isLocked colorClass="bg-violet-500" />
                <AchievementCard title="30-Day Streak" description="Completed learning tasks for 30 consecutive days." icon={Flame} isLocked colorClass="bg-orange-500" />
              </div>
            </TabsContent>

            <TabsContent value="learning" className="mt-0 space-y-6">
              <MetricsCard 
                title="Learning & Practice Summary"
                description="Your complete history of study sessions."
                metrics={[
                  { label: "Levels Completed", value: "3 (A1-B1)", change: "", positive: true },
                  { label: "Lessons Finished", value: "142", change: "", positive: true },
                  { label: "Avg Session Accuracy", value: "88%", change: "", positive: true },
                  { label: "Study Hours", value: "128h", change: "", positive: true },
                ]}
              />
              <div className="flex justify-end">
                <Button variant="outline"><Download className="h-4 w-4 mr-2" /> Export Learning History</Button>
              </div>
            </TabsContent>
            
            <TabsContent value="exams" className="mt-0 h-48 flex items-center justify-center border-2 border-dashed rounded-xl text-muted-foreground">
              Detailed Exam History View
            </TabsContent>

          </Tabs>
        </div>

        {/* Right Panel */}
        <div className="flex flex-col gap-6">
          <div className="space-y-4">
            <h3 className="font-bold text-lg">Quick Actions</h3>
            <QuickActionCard title="Continue Learning" description="B2 Module 4: Conditionals" icon={Play} colorClass="bg-primary" />
            <QuickActionCard title="Resume Practice" description="Mock HR Interview" icon={BrainCircuit} colorClass="bg-purple-500" />
            <QuickActionCard title="View Discussions" description="Community Forums" icon={Users} colorClass="bg-orange-500" />
          </div>

          <ActivityTimeline />
        </div>

      </div>
    </div>
  )
}

function Trophy(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>
}

function Flame(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
}
