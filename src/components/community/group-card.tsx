"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface GroupCardProps {
  title: string
  description: string
  category: string
  membersCount: number
  weeklyGoal: string
  colorClass: string
}

export function GroupCard({ title, description, category, membersCount, weeklyGoal, colorClass }: GroupCardProps) {
  return (
    <Card className="shadow-sm border hover:border-primary/30 transition-all group overflow-hidden">
      <div className={`h-2 w-full ${colorClass}`} />
      <CardContent className="p-6">
        <Badge variant="secondary" className="mb-3">{category}</Badge>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{description}</p>
        
        <div className="space-y-3 mb-6">
          <div className="flex items-center text-sm">
            <Users className="h-4 w-4 mr-2 text-muted-foreground" />
            <span className="font-medium">{membersCount} Active Members</span>
          </div>
          <div className="flex items-start text-sm bg-muted/50 p-2 rounded-lg border">
            <Target className="h-4 w-4 mr-2 text-primary shrink-0 mt-0.5" />
            <span className="text-muted-foreground"><strong className="text-foreground">Goal:</strong> {weeklyGoal}</span>
          </div>
        </div>

        <Button className="w-full shadow-soft group-hover:bg-primary/90 transition-all">
          Join Group <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}
