"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, User, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface EventCardProps {
  title: string
  date: string
  duration: string
  speaker: string
  type: string
}

export function EventCard({ title, date, duration, speaker, type }: EventCardProps) {
  
  // Simple logic to parse mock date string to distinct block
  // e.g. "Jul 25, 10:00 AM"
  const [monthDay, time] = date.split(", ")
  const [month, day] = monthDay.split(" ")

  return (
    <Card className="shadow-sm border-2 overflow-hidden flex flex-col group hover:border-primary/30 transition-colors">
      <CardContent className="p-0 flex flex-1 flex-col sm:flex-row">
        
        {/* Date Block */}
        <div className="bg-primary/10 p-6 flex flex-col items-center justify-center min-w-[120px] border-b sm:border-b-0 sm:border-r border-primary/10">
          <span className="text-sm font-bold text-primary uppercase tracking-wider">{month}</span>
          <span className="text-4xl font-black text-primary">{day}</span>
        </div>

        {/* Content Block */}
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <Badge variant="outline" className="mb-2 bg-background">{type}</Badge>
          </div>
          
          <h3 className="text-xl font-bold mb-4 line-clamp-2">{title}</h3>
          
          <div className="space-y-2 mb-6 flex-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-2" /> {time} • {duration}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <User className="h-4 w-4 mr-2" /> by <span className="font-medium ml-1 text-foreground">{speaker}</span>
            </div>
          </div>

          <Button variant="outline" className="w-full sm:w-auto shadow-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            Register Now <ArrowUpRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}
