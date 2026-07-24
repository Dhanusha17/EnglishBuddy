"use client"

import { Card, CardContent } from "@/components/ui/card"

interface ProgressRingProps {
  score: number
  level: string
  percentile: string
}

export function ProgressRing({ score, level, percentile }: ProgressRingProps) {
  // Assuming max score is 1000 for calculation
  const percentage = Math.min((score / 1000) * 100, 100)
  const dashArray = 276 // 2 * PI * r (where r = 44)
  const dashOffset = dashArray - (dashArray * percentage) / 100

  return (
    <Card className="shadow-sm border-none text-center bg-primary text-primary-foreground relative overflow-hidden">
      <CardContent className="pt-6 relative z-10">
        <div className="relative mx-auto w-32 h-32 mb-4">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="transparent" stroke="rgba(255,255,255,0.2)" strokeWidth="8" />
            <circle 
              cx="50" cy="50" r="44" 
              fill="transparent" 
              stroke="white" 
              strokeWidth="8" 
              strokeDasharray={dashArray} 
              strokeDashoffset={dashOffset} 
              className="transition-all duration-1000 ease-out drop-shadow-md" 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-sm font-bold opacity-80 uppercase tracking-widest">Score</span>
            <span className="text-4xl font-black">{score}</span>
          </div>
        </div>
        <h3 className="font-bold text-lg">{level}</h3>
        <p className="text-sm text-primary-foreground/80 mb-4">{percentile}</p>
      </CardContent>
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </Card>
  )
}
