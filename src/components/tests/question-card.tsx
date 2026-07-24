"use client"

import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

interface QuestionCardProps {
  questionId: string
  type: "mcq" | "fill-blanks" | "true-false"
  questionText: string
  options?: string[]
  value?: string
  onChange: (val: string) => void
}

export function QuestionCard({ type, questionText, options, value, onChange }: QuestionCardProps) {
  return (
    <Card className="border-2 shadow-sm">
      <CardContent className="p-8">
        <h3 className="text-xl font-medium leading-relaxed mb-8">{questionText}</h3>
        
        {type === "mcq" && options && (
          <RadioGroup value={value} onValueChange={onChange} className="space-y-3">
            {options.map((opt, i) => (
              <div 
                key={i}
                className={`flex items-center space-x-3 border-2 p-4 rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${value === opt ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => onChange(opt)}
              >
                <RadioGroupItem value={opt} id={`opt-${i}`} />
                <Label htmlFor={`opt-${i}`} className="flex-1 cursor-pointer text-base font-medium">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {type === "true-false" && (
          <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
            {["True", "False"].map((opt, i) => (
              <div 
                key={i}
                className={`flex-1 flex items-center justify-center space-x-2 border-2 p-4 rounded-xl cursor-pointer transition-all hover:bg-muted/50 ${value === opt ? 'border-primary bg-primary/5' : 'border-border'}`}
                onClick={() => onChange(opt)}
              >
                <RadioGroupItem value={opt} id={`tf-${i}`} className="hidden" />
                <Label htmlFor={`tf-${i}`} className="cursor-pointer text-lg font-bold">{opt}</Label>
              </div>
            ))}
          </RadioGroup>
        )}

        {type === "fill-blanks" && (
          <Input 
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer here..."
            className="text-lg p-6 border-2 focus-visible:ring-primary focus-visible:border-primary rounded-xl shadow-inner"
          />
        )}
      </CardContent>
    </Card>
  )
}
