"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { CheckCircle2, Circle, Target } from "lucide-react"
import { useState } from "react"

interface Goal {
  id: string
  title: string
  completed: boolean
}

export function GoalTrackerCard() {
  const [goals, setGoals] = useState<Goal[]>([
    { id: "1", title: "Listen to 1 podcast", completed: true },
    { id: "2", title: "Speak for 5 minutes", completed: true },
    { id: "3", title: "Read 1 article", completed: false },
    { id: "4", title: "Write a short paragraph", completed: false },
    { id: "5", title: "Learn 5 new words", completed: true },
    { id: "6", title: "Complete 1 Grammar Quiz", completed: false },
  ])

  const completedCount = goals.filter(g => g.completed).length
  const progressPercent = Math.round((completedCount / goals.length) * 100)

  const toggleGoal = (id: string) => {
    setGoals(goals.map(g => g.id === id ? { ...g, completed: !g.completed } : g))
  }

  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-base flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Daily Checklist
          </span>
          <span className="text-sm text-muted-foreground font-normal">{completedCount}/{goals.length}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        
        <div className="space-y-1">
          <div className="flex justify-between text-sm mb-1">
            <span className="font-medium text-muted-foreground">Progress</span>
            <span className="font-bold">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="space-y-2">
          {goals.map(goal => (
            <div 
              key={goal.id} 
              className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors"
              onClick={() => toggleGoal(goal.id)}
            >
              {goal.completed ? (
                <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground shrink-0" />
              )}
              <span className={`text-sm ${goal.completed ? 'text-muted-foreground line-through decoration-muted-foreground/30' : 'font-medium'}`}>
                {goal.title}
              </span>
            </div>
          ))}
        </div>

      </CardContent>
    </Card>
  )
}
