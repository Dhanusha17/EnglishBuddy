"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Mic, CheckCircle2, Lightbulb, AlertTriangle } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

interface InterviewQuestionCardProps {
  question: string
  explanation: string
  sampleAnswer: string
  tips: string[]
  commonMistakes: string[]
  isCompleted?: boolean
}

export function InterviewQuestionCard({ 
  question, explanation, sampleAnswer, tips, commonMistakes, isCompleted = false 
}: InterviewQuestionCardProps) {
  
  const [completed, setCompleted] = useState(isCompleted)
  const [isRecording, setIsRecording] = useState(false)

  return (
    <Card className={`border-2 shadow-sm transition-colors ${completed ? 'border-green-500/30 bg-green-500/5' : 'border-border'}`}>
      <CardContent className="p-6 md:p-8 space-y-6">
        
        <div className="flex justify-between items-start gap-4">
          <div>
            <Badge className="mb-3">Interview Question</Badge>
            <h2 className="text-2xl font-bold leading-relaxed">{question}</h2>
          </div>
          {completed && (
            <div className="flex items-center text-green-600 dark:text-green-500 font-bold bg-green-500/10 px-3 py-1 rounded-full shrink-0">
              <CheckCircle2 className="h-4 w-4 mr-2" /> Done
            </div>
          )}
        </div>

        <p className="text-lg text-muted-foreground">{explanation}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-primary/5 rounded-xl p-5 border border-primary/10">
            <h4 className="font-bold flex items-center gap-2 mb-3 text-primary">
              <Lightbulb className="h-5 w-5" /> Expert Tips
            </h4>
            <ul className="space-y-2">
              {tips.map((tip, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-primary mt-1">•</span> {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-destructive/5 rounded-xl p-5 border border-destructive/10">
            <h4 className="font-bold flex items-center gap-2 mb-3 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Common Mistakes
            </h4>
            <ul className="space-y-2">
              {commonMistakes.map((mistake, i) => (
                <li key={i} className="text-sm flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span> {mistake}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-muted rounded-xl p-6 border">
          <h4 className="font-bold mb-3 uppercase text-xs tracking-wider text-muted-foreground">Sample Answer</h4>
          <p className="text-base italic leading-relaxed">&quot;{sampleAnswer}&quot;</p>
        </div>

        <div className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Button 
              variant={isRecording ? "destructive" : "outline"}
              className={`rounded-full h-12 px-6 shadow-sm flex-1 sm:flex-none ${isRecording ? 'animate-pulse' : ''}`}
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="h-5 w-5 mr-2" /> {isRecording ? "Stop Recording" : "Record Your Answer"}
            </Button>
            {isRecording && (
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <motion.div 
                    key={i}
                    className="w-1.5 bg-destructive rounded-full"
                    animate={{ height: ((i % 3) / 3) * 20 + 10 }}
                    transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror" }}
                  />
                ))}
              </div>
            )}
          </div>
          <Button 
            className="w-full sm:w-auto shadow-soft"
            onClick={() => setCompleted(true)}
            disabled={completed}
          >
            Mark as Complete
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
