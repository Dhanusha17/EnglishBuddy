"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CheckCircle2, MessageSquare, BookOpen, Trophy } from "lucide-react"

const activities = [
  { id: 1, title: "Completed Grammar Quiz: Tenses", time: "2 hours ago", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-500/10" },
  { id: 2, title: "Practiced 15 mins with AI Tutor", time: "5 hours ago", icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
  { id: 3, title: "Read Article: Tech Trends 2026", time: "Yesterday", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
  { id: 4, title: "Earned B2 Level Certificate", time: "3 days ago", icon: Trophy, color: "text-yellow-500", bg: "bg-yellow-500/10" },
]

export function ActivityTimeline() {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="relative border-l-2 border-muted ml-3 space-y-8">
          {activities.map((activity) => (
            <div key={activity.id} className="relative pl-6">
              <span className={`absolute -left-[17px] top-1 h-8 w-8 rounded-full flex items-center justify-center border-4 border-card ${activity.bg} ${activity.color}`}>
                <activity.icon className="h-4 w-4" />
              </span>
              <p className="text-sm font-medium leading-tight">{activity.title}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
