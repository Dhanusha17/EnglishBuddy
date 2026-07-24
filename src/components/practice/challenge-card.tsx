"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, Trophy, Star } from "lucide-react"

interface ChallengeCardProps {
  type: "daily" | "weekly"
  title: string
  description: string
  progress: number
  total: number
  xpReward: number
  timeLeft?: string
}

export function ChallengeCard({ type, title, description, progress, total, xpReward, timeLeft }: ChallengeCardProps) {
  const isDaily = type === "daily"
  const Icon = isDaily ? Zap : Trophy
  const colorClass = isDaily ? "text-primary" : "text-yellow-500"
  const percentage = Math.round((progress / total) * 100)

  return (
    <Card className={`relative overflow-hidden shadow-sm ${isDaily ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20' : 'bg-card border-none'}`}>
      <CardContent className="p-6 z-10 relative h-full flex flex-col justify-between">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
              <Icon className={`h-5 w-5 ${colorClass}`} /> {title}
            </h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="outline" className={isDaily ? 'border-primary/30 text-primary bg-background' : ''}>
            {progress} / {total} Done
          </Badge>
        </div>
        
        <div className="space-y-4 mb-6">
          <Progress value={percentage} className={`h-2.5 ${isDaily ? 'bg-background' : ''}`} />
        </div>
        
        <div className={`flex items-center justify-between text-sm font-medium border-t pt-4 mt-auto ${isDaily ? 'border-primary/10' : ''}`}>
          <span className="flex items-center"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" /> +{xpReward} XP</span>
          {isDaily ? (
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 -mr-2">Start Challenge</Button>
          ) : (
            <span className="text-muted-foreground">{timeLeft} left</span>
          )}
        </div>
      </CardContent>
      {isDaily && <div className="absolute right-0 top-0 w-32 h-full bg-primary/5 rounded-full blur-3xl -z-10" />}
    </Card>
  )
}
