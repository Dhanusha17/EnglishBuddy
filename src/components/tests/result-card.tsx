"use client"

import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2, XCircle, Clock, Star, Target, MinusCircle } from "lucide-react"

interface ResultCardProps {
  score: number
  total: number
  correct: number
  wrong: number
  skipped: number
  timeTaken: string
  xpEarned: number
  rank?: string
}

export function ResultCard({ score, total, correct, wrong, skipped, timeTaken, xpEarned, rank }: ResultCardProps) {
  const percentage = Math.round((score / total) * 100)
  const passed = percentage >= 60

  return (
    <Card className={`border-2 overflow-hidden shadow-lg ${passed ? 'border-green-500/20' : 'border-destructive/20'}`}>
      <div className={`p-8 text-center border-b ${passed ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
        <div className="relative w-32 h-32 mx-auto mb-4">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="opacity-10" />
            <circle 
              cx="50" cy="50" r="44" 
              fill="transparent" 
              stroke="currentColor" 
              strokeWidth="8" 
              strokeDasharray="276" 
              strokeDashoffset={276 - (276 * percentage) / 100} 
              className={`transition-all duration-1000 ease-out ${passed ? 'text-green-500' : 'text-destructive'}`} 
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-3xl font-black">{percentage}%</span>
          </div>
        </div>
        <h2 className={`text-2xl font-bold mb-2 ${passed ? 'text-green-700 dark:text-green-400' : 'text-destructive'}`}>
          {passed ? 'Congratulations! You Passed' : 'Test Failed. Keep Practicing!'}
        </h2>
        <p className="text-muted-foreground font-medium">You scored {score} out of {total} points.</p>
      </div>

      <CardContent className="p-6 grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-500">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Correct</p>
            <p className="text-xl font-bold">{correct}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
            <XCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Wrong</p>
            <p className="text-xl font-bold">{wrong}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500">
            <MinusCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Skipped</p>
            <p className="text-xl font-bold">{skipped}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time Taken</p>
            <p className="text-xl font-bold">{timeTaken}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
          <div className="h-10 w-10 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-500">
            <Star className="h-5 w-5 fill-yellow-500" />
          </div>
          <div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">XP Earned</p>
            <p className="text-xl font-bold">+{xpEarned}</p>
          </div>
        </div>

        {rank && (
          <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-xl border">
            <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-500">
              <Target className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Rank</p>
              <p className="text-xl font-bold">{rank}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
