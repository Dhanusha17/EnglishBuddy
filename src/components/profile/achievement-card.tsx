"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"

interface AchievementCardProps {
  title: string
  description: string
  icon: React.ElementType
  isLocked?: boolean
  progress?: number
  colorClass: string
}

export function AchievementCard({ title, description, icon: Icon, isLocked, progress, colorClass }: AchievementCardProps) {
  return (
    <Card className={`shadow-sm border overflow-hidden ${isLocked ? 'opacity-75 bg-muted/30 grayscale-[50%]' : 'bg-card'}`}>
      <CardContent className="p-5 flex flex-col items-center text-center h-full relative">
        {isLocked && <Lock className="absolute top-3 right-3 h-4 w-4 text-muted-foreground" />}
        
        <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white mb-4 shadow-sm ${isLocked ? 'bg-muted-foreground' : colorClass}`}>
          <Icon className="h-8 w-8" />
        </div>
        
        <h3 className="font-bold text-sm mb-1">{title}</h3>
        <p className="text-xs text-muted-foreground mb-4 flex-1">{description}</p>
        
        {progress !== undefined && (
          <div className="w-full mt-auto">
            <div className="flex justify-between text-[10px] font-bold mb-1 uppercase tracking-wider text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
