"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Save } from "lucide-react"
import { Button } from "@/components/ui/button"

interface WritingEditorProps {
  title: string
  prompt: string
  onProgress?: (val: number) => void
}

export function WritingEditor({ title, prompt, onProgress }: WritingEditorProps) {
  const [text, setText] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    if (onProgress) {
      const words = e.target.value.split(/\s+/).filter(w => w.length > 0).length
      // Simulate progress based on word count (cap at 100)
      onProgress(Math.min((words / 20) * 100, 100))
    }
  }

  const wordCount = text.split(/\s+/).filter(w => w.length > 0).length

  return (
    <div className="space-y-6 max-w-4xl mx-auto flex flex-col h-[calc(100vh-250px)]">
      <div>
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-2xl font-bold">{title}</h1>
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
            <Save className="h-4 w-4 mr-2" /> Save Draft
          </Button>
        </div>
        <Card className="bg-primary/5 border-primary/20 shadow-none">
          <CardContent className="p-4 text-sm font-medium">
            <span className="font-bold text-primary">Prompt:</span> {prompt}
          </CardContent>
        </Card>
      </div>

      <div className="flex-1 flex flex-col relative">
        <Textarea 
          placeholder="Start writing here..."
          className="flex-1 resize-none text-lg p-6 shadow-inner border-2 focus-visible:ring-primary focus-visible:border-primary rounded-xl"
          value={text}
          onChange={handleChange}
        />
        
        {/* Helper Toolbar overlay */}
        <div className="absolute bottom-4 left-4">
          <Button variant="secondary" size="sm" className="shadow-md bg-background/80 backdrop-blur border">
            <Sparkles className="h-4 w-4 mr-2 text-yellow-500" /> AI Suggestions (Placeholder)
          </Button>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-wider bg-background/80 backdrop-blur px-3 py-1.5 rounded-lg border shadow-sm">
          <span>{wordCount} Words</span>
          <span>{text.length} Chars</span>
        </div>
      </div>
    </div>
  )
}
