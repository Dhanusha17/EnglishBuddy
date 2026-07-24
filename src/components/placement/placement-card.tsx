"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Clock, Star, PlayCircle, BookOpen } from "lucide-react"
import Link from "next/link"

interface PlacementCardProps {
  id: string
  title: string
  icon: React.ElementType
  progress: number
  lessonsCompleted: number
  totalLessons: number
  timeEstimate: string
  xpReward: number
  colorClass: string
}

export function PlacementCard({
  id, title, icon: Icon, progress, lessonsCompleted, totalLessons, timeEstimate, xpReward, colorClass
}: PlacementCardProps) {
  
  return (
    <Card className="shadow-sm border border-transparent hover:border-primary/20 hover:shadow-md transition-all h-full flex flex-col group bg-card overflow-hidden relative">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6 z-10">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-glow ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold">{progress}%</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-4 z-10">{title}</h3>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mb-6 z-10">
          <span className="flex items-center gap-1.5"><BookOpen className="h-4 w-4" /> {lessonsCompleted}/{totalLessons} Lessons</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {timeEstimate}</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {xpReward} XP</span>
        </div>

        <div className="mt-auto space-y-4 z-10">
          <Progress value={progress} className="h-2 bg-muted" />
          <Link href={`/dashboard/placement/${id}`} className="block w-full">
            <Button className="w-full shadow-soft group-hover:bg-primary/90" size="lg">
              {progress > 0 ? "Continue" : "Start"} <PlayCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </CardContent>
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-[0.03] pointer-events-none ${colorClass}`} />
    </Card>
  )
}
