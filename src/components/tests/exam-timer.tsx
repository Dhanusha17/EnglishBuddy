"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

interface ExamTimerProps {
  initialMinutes: number
  onTimeUp: () => void
}

export function ExamTimer({ initialMinutes, onTimeUp }: ExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp()
      return
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, onTimeUp])

  const mins = Math.floor(timeLeft / 60)
  const secs = timeLeft % 60
  
  const isWarning = timeLeft < 300 // less than 5 mins

  return (
    <div className={`flex items-center gap-2 font-mono font-bold text-lg px-4 py-2 rounded-lg border shadow-sm ${isWarning ? 'bg-destructive/10 text-destructive border-destructive/20 animate-pulse' : 'bg-card text-foreground'}`}>
      <Clock className={`h-5 w-5 ${isWarning ? 'text-destructive' : 'text-muted-foreground'}`} />
      <span>{mins.toString().padStart(2, '0')}:{secs.toString().padStart(2, '0')}</span>
    </div>
  )
}
