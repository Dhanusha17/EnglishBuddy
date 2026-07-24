"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, Share2, Target, Trophy, Flame } from "lucide-react"
import { useAppStore } from "@/store/useAppStore"

export function ProfileCard() {
  const { user } = useAppStore()
  return (
    <Card className="shadow-sm border-none bg-gradient-to-r from-primary/10 via-background to-background relative overflow-hidden">
      <CardContent className="p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 z-10 relative">
        
        <div className="relative">
          <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-background shadow-md">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback className="text-3xl bg-primary/20 text-primary font-bold">{user.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-2 -right-2 bg-background p-1 rounded-full shadow-sm">
            <div className="bg-green-500 h-4 w-4 rounded-full border-2 border-background" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <Badge variant="secondary" className="w-fit mx-auto md:mx-0">{user.level}</Badge>
          </div>
          <p className="text-muted-foreground mb-4 font-medium">@{user.name.split(' ')[0].toLowerCase()}_learns • Joined May 2026</p>
          <p className="text-sm max-w-xl mx-auto md:mx-0 mb-6">
            Software engineering student preparing for campus placements. Passionate about improving English fluency and acing technical interviews.
          </p>

          <div className="flex flex-wrap justify-center md:justify-start gap-6 mb-6">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Total XP</p>
                <p className="font-bold">{user.xp.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Streak</p>
                <p className="font-bold">{user.streak} Days</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-violet-500" />
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Placement</p>
                <p className="font-bold text-violet-600 dark:text-violet-400">68% Ready</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto">
          <Button variant="outline" className="flex-1 md:flex-none bg-background shadow-sm"><Edit className="mr-2 h-4 w-4" /> Edit Profile</Button>
          <Button variant="ghost" className="flex-1 md:flex-none"><Share2 className="mr-2 h-4 w-4" /> Share</Button>
        </div>
      </CardContent>
      <div className="absolute right-0 top-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
    </Card>
  )
}
