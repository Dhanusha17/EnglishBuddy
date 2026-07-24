"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Clock, HelpCircle, Star, Target, PlayCircle, Trophy } from "lucide-react"
import Link from "next/link"

interface ExamCardProps {
  id: string
  title: string
  type: string
  difficulty: "Beginner" | "Intermediate" | "Advanced" | string
  questions: number
  timeLimit: number // in minutes
  xpReward: number
  attempts: number
  bestScore?: number // percentage
  icon: React.ElementType
  colorClass: string
}

export function ExamCard({
  id, title, type, difficulty, questions, timeLimit, xpReward, attempts, bestScore, icon: Icon, colorClass
}: ExamCardProps) {
  
  return (
    <Card className="shadow-sm border border-transparent hover:border-primary/20 hover:shadow-md transition-all h-full flex flex-col group bg-card overflow-hidden relative">
      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-6 z-10">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-glow ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <Badge variant={difficulty === "Beginner" ? "secondary" : difficulty === "Intermediate" ? "default" : "destructive"} className="uppercase text-[10px] tracking-wider font-bold">
            {difficulty}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold mb-1 z-10">{title}</h3>
        <p className="text-sm text-muted-foreground font-medium mb-4 z-10">{type} Test</p>
        
        <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mb-6 z-10">
          <span className="flex items-center gap-1.5"><HelpCircle className="h-4 w-4" /> {questions} Qs</span>
          <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {timeLimit} mins</span>
          <span className="flex items-center gap-1.5"><Star className="h-4 w-4 text-yellow-500 fill-yellow-500" /> {xpReward} XP</span>
          <span className="flex items-center gap-1.5"><Target className="h-4 w-4" /> {attempts} Attempts</span>
        </div>

        <div className="mt-auto space-y-4 z-10">
          {bestScore !== undefined && (
            <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg border">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Best Score</span>
              <span className={`font-bold flex items-center gap-1 ${bestScore >= 80 ? 'text-green-500' : bestScore >= 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {bestScore >= 80 && <Trophy className="h-4 w-4" />} {bestScore}%
              </span>
            </div>
          )}
          
          <Link href={`/tests/session/${id}`} className="block w-full">
            <Button className="w-full shadow-soft group-hover:bg-primary/90" size="lg">
              {attempts > 0 ? "Retake Test" : "Start Test"} <PlayCircle className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </CardContent>
      <div className={`absolute -right-16 -top-16 w-48 h-48 rounded-full blur-3xl opacity-[0.03] pointer-events-none ${colorClass}`} />
    </Card>
  )
}
