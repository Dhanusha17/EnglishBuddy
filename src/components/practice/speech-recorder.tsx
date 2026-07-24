"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Pause, RotateCcw } from "lucide-react"

interface SpeechRecorderProps {
  title: string
  description: string
  content: string
  onProgress?: (val: number) => void
}

export function SpeechRecorder({ title, description, content, onProgress }: SpeechRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)

  const handleRecord = () => {
    const newState = !isRecording
    setIsRecording(newState)
    if (newState) {
      setHasRecorded(true)
      if (onProgress) onProgress(50) // Simulate half progress on start
    } else {
      if (onProgress) onProgress(100) // Simulate full progress on stop
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="max-w-2xl mx-auto shadow-md border-primary/10">
        <CardContent className="p-8 text-center text-xl font-medium leading-relaxed">
          &quot;{content}&quot;
        </CardContent>
      </Card>

      <div className="flex flex-col items-center justify-center space-y-6 max-w-md mx-auto">
        <div className="h-24 w-full flex items-center justify-center gap-1">
          {/* Animated Waveform Placeholder */}
          {[...Array(24)].map((_, i) => (
            <motion.div 
              key={i}
              className={`w-2 rounded-full ${isRecording ? 'bg-orange-500' : 'bg-muted'}`}
              animate={{ height: isRecording ? ((i % 5) / 5) * 60 + 10 : 10 }}
              transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror", delay: i * 0.05 }}
            />
          ))}
        </div>
        
        <div className="flex items-center gap-6">
          {hasRecorded && !isRecording && (
            <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={() => setHasRecorded(false)}>
              <RotateCcw className="h-5 w-5" />
            </Button>
          )}
          
          <Button 
            size="lg" 
            className={`h-20 w-20 rounded-full shadow-lg transition-all ${isRecording ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' : 'bg-primary hover:bg-primary/90'}`}
            onClick={handleRecord}
          >
            {isRecording ? <Pause className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
          </Button>
          
          {hasRecorded && !isRecording && (
            <div className="h-12 w-12" /> // Spacer for balance
          )}
        </div>
        
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
          {isRecording ? "Recording..." : hasRecorded ? "Tap to record again" : "Tap to record"}
        </p>

        {hasRecorded && !isRecording && (
          <div className="w-full mt-8 p-4 bg-card border rounded-xl space-y-3">
            <h4 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-2">AI Feedback (Placeholder)</h4>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Pronunciation</span>
              <span className="text-sm font-bold text-green-500">85%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Fluency</span>
              <span className="text-sm font-bold text-yellow-500">72%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
