"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ResumeCardProps {
  title: string
  description: string
  tips: string[]
  actionVerbs: string[]
}

export function ResumeCard({ title, description, tips, actionVerbs }: ResumeCardProps) {
  return (
    <Card className="shadow-sm border-2">
      <CardHeader className="bg-primary/5 border-b pb-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>{title}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        
        <div>
          <h4 className="font-bold uppercase tracking-wider text-xs text-muted-foreground mb-3">Expert Tips</h4>
          <ul className="space-y-2">
            {tips.map((tip, i) => (
              <li key={i} className="text-sm flex items-start gap-2">
                <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" /> {tip}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold uppercase tracking-wider text-xs text-muted-foreground">Power Action Verbs</h4>
            <Button variant="ghost" size="sm" className="h-6 text-xs text-primary"><Copy className="h-3 w-3 mr-1" /> Copy All</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {actionVerbs.map(verb => (
              <Badge key={verb} variant="secondary" className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                {verb}
              </Badge>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
