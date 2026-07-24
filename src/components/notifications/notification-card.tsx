"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

interface NotificationCardProps {
  title: string
  message: string
  timeAgo: string
  category: string
  isUnread: boolean
  icon: React.ElementType
  colorClass: string
}

export function NotificationCard({ title, message, timeAgo, category, isUnread, icon: Icon, colorClass }: NotificationCardProps) {
  return (
    <Card className={`shadow-sm border-none transition-colors ${isUnread ? 'bg-primary/5' : 'bg-card'}`}>
      <CardContent className="p-4 flex gap-4 items-start">
        <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white shrink-0 mt-1 shadow-sm ${colorClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
            <h4 className={`text-sm ${isUnread ? 'font-bold' : 'font-medium'}`}>{title}</h4>
            <span className="text-xs text-muted-foreground whitespace-nowrap">{timeAgo}</span>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{message}</p>
          <Badge variant="outline" className="bg-background">{category}</Badge>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          {isUnread && <div className="h-2 w-2 rounded-full bg-primary" />}
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
