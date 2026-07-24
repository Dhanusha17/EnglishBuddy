"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Maximize2, Download, Bookmark } from "lucide-react"

interface ReadingCardProps {
  title: string
  meta: string
  content: React.ReactNode
  questions: { question: string; options: string[]; answerIndex: number }[]
  onProgress?: (val: number) => void
}

export function ReadingCard({ title, meta, content, questions, onProgress }: ReadingCardProps) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-end border-b pb-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">{title}</h1>
          <p className="text-muted-foreground">{meta}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon"><Bookmark className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon"><Download className="h-5 w-5" /></Button>
          <Button variant="outline" size="sm"><Maximize2 className="h-4 w-4 mr-2" /> Expand</Button>
        </div>
      </div>

      <div className="prose dark:prose-invert max-w-none text-lg leading-loose space-y-6">
        {content}
      </div>

      {questions.map((q, qIdx) => (
        <Card key={qIdx} className="bg-muted/30 border-2 mt-8">
          <CardHeader>
            <CardTitle className="text-xl">Comprehension Check {qIdx + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-medium text-lg">{q.question}</p>
            <div className="space-y-2">
              {q.options.map((opt, i) => (
                <div 
                  key={i} 
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-colors border-border hover:bg-muted hover:border-primary/50`} 
                  onClick={() => {
                    if (onProgress) onProgress(100 / questions.length)
                  }}
                >
                  {opt}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
