"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmailTemplateCardProps {
  title: string
  subject: string
  body: string
  type: "Formal" | "Informal"
}

export function EmailTemplateCard({ title, subject, body, type }: EmailTemplateCardProps) {
  return (
    <Card className="shadow-sm border-2 overflow-hidden">
      <div className="bg-muted p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <span className="font-bold text-sm">{title}</span>
        </div>
        <Badge variant={type === "Formal" ? "default" : "secondary"}>{type}</Badge>
      </div>
      <CardContent className="p-0">
        <div className="p-4 border-b bg-background">
          <p className="text-sm">
            <span className="text-muted-foreground font-medium w-16 inline-block">To:</span> 
            <span className="text-muted-foreground italic">hr@company.com</span>
          </p>
          <p className="text-sm mt-2">
            <span className="text-muted-foreground font-medium w-16 inline-block">Subject:</span> 
            <span className="font-bold">{subject}</span>
          </p>
        </div>
        <div className="p-6 bg-background whitespace-pre-line text-sm leading-relaxed font-mono">
          {body}
        </div>
        <div className="p-4 bg-muted/50 border-t flex justify-end">
          <Button variant="outline" size="sm"><Copy className="h-4 w-4 mr-2" /> Copy Template</Button>
        </div>
      </CardContent>
    </Card>
  )
}
