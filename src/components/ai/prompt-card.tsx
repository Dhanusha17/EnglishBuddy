"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

interface PromptCardProps {
  title: string
  description: string
  icon: React.ElementType
  onClick?: () => void
}

export function PromptCard({ title, description, icon: Icon, onClick }: PromptCardProps) {
  return (
    <Card 
      className="shadow-sm border border-border hover:border-primary/30 transition-all cursor-pointer group bg-muted/20"
      onClick={onClick}
    >
      <CardContent className="p-4 flex items-start gap-4">
        <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center shrink-0 group-hover:text-primary transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-bold text-sm mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
            {title}
            <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
