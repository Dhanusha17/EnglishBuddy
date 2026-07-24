"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface SkillProgress {
  label: string
  val: number
  color: string
}

interface SkillProgressCardProps {
  skills: SkillProgress[]
}

export function SkillProgressCard({ skills }: SkillProgressCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-base">Skill Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-5">
        {skills.map(s => (
          <div key={s.label} className="space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-muted-foreground">{s.label}</span>
              <span className="font-bold">{s.val}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={`h-full ${s.color} rounded-full transition-all duration-1000`} 
                style={{ width: `${s.val}%` }} 
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
