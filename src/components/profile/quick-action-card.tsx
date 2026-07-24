"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight } from "lucide-react"

interface QuickActionCardProps {
  title: string
  description: string
  icon: React.ElementType
  colorClass: string
}

export function QuickActionCard({ title, description, icon: Icon, colorClass }: QuickActionCardProps) {
  return (
    <Card className="shadow-sm border border-transparent hover:border-primary/20 transition-all cursor-pointer group bg-card">
      <CardContent className="p-4 flex items-center gap-4">
        <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shrink-0 ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold group-hover:text-primary transition-colors">{title}</h4>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
      </CardContent>
    </Card>
  )
}
