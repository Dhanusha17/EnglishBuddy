"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Calendar as CalendarIcon } from "lucide-react"

export function ActivityCalendarCard() {
  // Generate mock calendar data for the last 30 days
  const today = new Date()
  const days = []
  
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    
    // Mock intensity: 0 (missed), 1 (partial), 2 (completed), 3 (over-achieved)
    const intensity = i < 5 ? (i % 2 === 0 ? 2 : 1) : (i % 4)
    
    days.push({
      date: d,
      intensity,
      label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    })
  }

  const getColor = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted" // Missed
      case 1: return "bg-yellow-400/80" // Partial
      case 2: return "bg-green-500" // Completed
      case 3: return "bg-green-600 dark:bg-green-400" // Over-achieved
      default: return "bg-muted"
    }
  }

  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-base flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" /> 30-Day Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
            <div key={i} className="text-center text-xs font-bold text-muted-foreground">{day}</div>
          ))}
          
          {/* Pad the start of the grid if necessary (simplified for mock) */}
          {Array.from({ length: days[0].date.getDay() }).map((_, i) => (
            <div key={`pad-${i}`} className="aspect-square rounded-sm" />
          ))}

          {days.map((day, i) => (
            <div 
              key={i} 
              className={`aspect-square rounded-sm ${getColor(day.intensity)} transition-all hover:ring-2 hover:ring-offset-2 hover:ring-offset-background hover:ring-primary cursor-pointer`}
              title={`${day.label}: ${day.intensity === 0 ? 'Missed' : day.intensity === 1 ? 'Partial' : 'Completed'}`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="h-3 w-3 rounded-sm bg-muted" />
            <div className="h-3 w-3 rounded-sm bg-yellow-400/80" />
            <div className="h-3 w-3 rounded-sm bg-green-500" />
            <div className="h-3 w-3 rounded-sm bg-green-600" />
          </div>
          <span>More</span>
        </div>

      </CardContent>
    </Card>
  )
}
