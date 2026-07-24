"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mic, Square, RotateCcw, Volume2, UserCircle, Settings2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface ConversationCardProps {
  mode: string
  scenario: string
}

export function ConversationCard({ mode, scenario }: ConversationCardProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)

  const handleRecordToggle = () => {
    if (isRecording) {
      setIsRecording(false)
      setHasRecorded(true)
    } else {
      setIsRecording(true)
      setHasRecorded(false)
    }
  }

  return (
    <Card className="border-2 shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px] flex flex-col">
      {/* Header */}
      <div className="bg-muted/50 p-6 border-b flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20">
            <UserCircle className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-bold text-lg">AI Partner ({mode})</h3>
            <p className="text-sm text-muted-foreground">Scenario: {scenario}</p>
          </div>
        </div>
        <Button variant="outline" size="icon"><Settings2 className="h-4 w-4" /></Button>
      </div>

      {/* Visualization Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-muted/20 relative">
        
        {/* Placeholder AI Avatar / Voice visualizer */}
        <div className="relative mb-12">
          {!isRecording && !hasRecorded ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="h-32 w-32 rounded-full bg-primary/5 border-4 border-primary/20 flex items-center justify-center relative z-10"
            >
              <Volume2 className="h-12 w-12 text-primary opacity-50" />
            </motion.div>
          ) : isRecording ? (
            <div className="flex items-center gap-2 h-32 relative z-10">
              {[...Array(9)].map((_, i) => (
                <motion.div 
                  key={i}
                  className="w-3 rounded-full bg-orange-500"
                  animate={{ height: ((i % 5) * 15) + 30 }}
                  transition={{ repeat: Infinity, duration: 0.2, repeatType: "mirror", delay: i * 0.05 }}
                />
              ))}
            </div>
          ) : (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center space-y-4 relative z-10"
            >
              <h4 className="text-xl font-bold text-green-600 dark:text-green-500">Analysis Complete</h4>
              <div className="flex gap-4 justify-center">
                <div className="bg-background p-3 rounded-xl border shadow-sm text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Fluency</p>
                  <p className="text-lg font-black text-primary">85%</p>
                </div>
                <div className="bg-background p-3 rounded-xl border shadow-sm text-center">
                  <p className="text-[10px] uppercase font-bold text-muted-foreground mb-1">Pronunciation</p>
                  <p className="text-lg font-black text-primary">92%</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Background Glow */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none transition-colors duration-500 ${isRecording ? 'bg-orange-500' : 'bg-primary'}`} />
        </div>

        <p className="text-lg font-medium text-center text-muted-foreground max-w-md h-16">
          {isRecording ? "Listening to your response..." : hasRecorded ? "Great job! Click below to try again or continue the conversation." : "Click the microphone to start speaking with your AI partner."}
        </p>
      </div>

      {/* Controls */}
      <div className="p-6 border-t bg-card flex justify-center items-center gap-6">
        {hasRecorded && (
          <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={() => setHasRecorded(false)}>
            <RotateCcw className="h-6 w-6" />
          </Button>
        )}
        
        <Button 
          size="icon" 
          className={`h-20 w-20 rounded-full shadow-glow transition-all ${isRecording ? 'bg-destructive hover:bg-destructive/90 scale-110' : ''}`}
          onClick={handleRecordToggle}
        >
          {isRecording ? <Square className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
        </Button>
      </div>
    </Card>
  )
}
