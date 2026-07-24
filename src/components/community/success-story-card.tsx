"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Quote, Trophy } from "lucide-react"

interface SuccessStoryCardProps {
  name: string
  company: string
  story: string
  badge: string
}

export function SuccessStoryCard({ name, company, story, badge }: SuccessStoryCardProps) {
  return (
    <Card className="shadow-sm border-none bg-gradient-to-br from-card to-muted/20 relative overflow-hidden group">
      <CardContent className="p-6 md:p-8 relative z-10">
        
        <Quote className="h-10 w-10 text-primary/20 mb-4" />
        
        <p className="text-lg font-medium leading-relaxed italic mb-8 relative z-10">
          &quot;{story}&quot;
        </p>

        <div className="flex items-center justify-between pt-6 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary font-bold">{name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold">{name}</p>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                Placed at <span className="font-bold text-foreground">{company}</span>
              </p>
            </div>
          </div>
          
          <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 border-yellow-500/20 hidden sm:flex">
            <Trophy className="h-3 w-3 mr-1" /> {badge}
          </Badge>
        </div>

      </CardContent>
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50 pointer-events-none group-hover:scale-110 transition-transform duration-700" />
    </Card>
  )
}
