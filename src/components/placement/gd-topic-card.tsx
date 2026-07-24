"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"

interface GDTopicCardProps {
  topic: string
  category: string
  difficulty: string
  pointsFor: string[]
  pointsAgainst: string[]
}

export function GDTopicCard({ topic, category, difficulty, pointsFor, pointsAgainst }: GDTopicCardProps) {
  return (
    <Card className="shadow-sm border-2 overflow-hidden">
      <CardContent className="p-0">
        <div className="bg-primary/5 p-6 border-b">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="bg-background">{category}</Badge>
            <Badge variant={difficulty === 'Hard' ? 'destructive' : difficulty === 'Medium' ? 'default' : 'secondary'}>{difficulty}</Badge>
          </div>
          <h3 className="text-xl font-bold flex items-start gap-3">
            <Users className="h-6 w-6 text-primary shrink-0 mt-1" />
            {topic}
          </h3>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x">
          <div className="p-6 bg-green-500/5">
            <h4 className="font-bold text-green-700 dark:text-green-400 mb-4 uppercase text-xs tracking-wider">Points For (Pros)</h4>
            <ul className="space-y-3">
              {pointsFor.map((point, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-green-500 font-bold mt-0.5">+</span> {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="p-6 bg-destructive/5">
            <h4 className="font-bold text-destructive mb-4 uppercase text-xs tracking-wider">Points Against (Cons)</h4>
            <ul className="space-y-3">
              {pointsAgainst.map((point, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-destructive font-bold mt-0.5">-</span> {point}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
