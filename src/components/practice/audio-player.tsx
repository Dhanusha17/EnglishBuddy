"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { PlayCircle, Pause, Volume2, Type, Download } from "lucide-react"

interface AudioPlayerProps {
  title: string
  description: string
  transcript: { speaker: string; text: string; highlight?: boolean }[]
}

export function AudioPlayer({ title, description, transcript }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [showTranscript, setShowTranscript] = useState(true)

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>

      <Card className="border-2 border-primary/20 shadow-lg overflow-hidden max-w-2xl mx-auto">
        <div className="bg-primary/5 p-8 flex flex-col items-center justify-center border-b border-primary/10">
          <div className="relative">
            <div className={`absolute inset-0 bg-primary/20 rounded-full blur-xl transition-all duration-1000 ${isPlaying ? 'scale-150 opacity-100' : 'scale-100 opacity-0'}`} />
            <Button 
              size="lg" 
              className="h-20 w-20 rounded-full shadow-glow relative z-10"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? <Pause className="h-8 w-8" /> : <PlayCircle className="h-8 w-8" />}
            </Button>
          </div>
          <div className="mt-8 w-full flex items-center gap-4">
            <span className="text-sm font-medium">0:45</span>
            <Slider defaultValue={[33]} max={100} step={1} className="flex-1" />
            <span className="text-sm font-medium">2:15</span>
          </div>
        </div>
        <CardContent className="p-6 bg-card space-y-4">
          <div className="flex justify-between items-center text-sm font-medium text-muted-foreground mb-2">
            <div className="flex gap-4">
              <span className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"><Volume2 className="h-4 w-4" /> 1x Speed</span>
              <span className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"><Download className="h-4 w-4" /> Download</span>
            </div>
            <span 
              className={`flex items-center gap-2 cursor-pointer transition-colors ${showTranscript ? 'text-primary font-bold' : 'hover:text-primary'}`}
              onClick={() => setShowTranscript(!showTranscript)}
            >
              <Type className="h-4 w-4" /> Transcript
            </span>
          </div>
          
          {showTranscript && (
            <div className="p-4 bg-muted/50 rounded-xl space-y-4 max-h-64 overflow-y-auto text-sm custom-scrollbar">
              {transcript.map((line, idx) => (
                <p key={idx} className={line.highlight ? "bg-yellow-500/10 p-2 rounded border-l-4 border-yellow-500" : "p-2"}>
                  <span className="font-bold text-primary">{line.speaker}:</span> {line.text}
                </p>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
