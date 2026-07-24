"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, Lock, ArrowDown } from "lucide-react"

interface Stage {
  number: number
  title: string
  description: string
  status: "completed" | "active" | "locked"
}

interface RoadmapCardProps {
  stages: Stage[]
}

export function RoadmapCard({ stages }: RoadmapCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card overflow-hidden">
      <CardContent className="p-8 overflow-x-auto custom-scrollbar">
        <div className="flex min-w-[800px] justify-between relative py-4">
          
          {/* Connecting Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 z-0" />
          <div 
            className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-1000" 
            style={{ width: `${(stages.filter(s => s.status === 'completed').length / (stages.length - 1)) * 100}%` }}
          />

          {stages.map((stage, idx) => (
            <div key={stage.number} className="relative z-10 flex flex-col items-center group w-32">
              <div className="mb-4 text-center">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Stage {stage.number}</p>
                <p className={`text-sm font-bold line-clamp-2 ${stage.status === 'active' ? 'text-primary' : stage.status === 'completed' ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {stage.title}
                </p>
              </div>
              
              <div className={`h-12 w-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 shadow-sm
                ${stage.status === 'completed' ? 'bg-primary border-primary/20 text-primary-foreground shadow-glow' : 
                  stage.status === 'active' ? 'bg-background border-primary text-primary animate-pulse' : 
                  'bg-muted border-muted-foreground/20 text-muted-foreground'}
              `}>
                {stage.status === 'completed' && <CheckCircle2 className="h-6 w-6" />}
                {stage.status === 'active' && <span className="font-bold">{stage.number}</span>}
                {stage.status === 'locked' && <Lock className="h-5 w-5" />}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
