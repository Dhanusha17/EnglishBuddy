"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Trophy } from "lucide-react"

interface LeaderboardEntry {
  id: string
  name: string
  score: number
  rank: number
  avatarUrl?: string
  isCurrentUser?: boolean
}

interface LeaderboardCardProps {
  title: string
  entries: LeaderboardEntry[]
}

export function LeaderboardCard({ title, entries }: LeaderboardCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-4 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-base flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-500" /> {title}
        </CardTitle>
        <span className="text-xs text-muted-foreground">This Week</span>
      </CardHeader>
      <CardContent className="pt-4 p-0">
        <div className="divide-y">
          {entries.map((entry) => (
            <div key={entry.id} className={`flex items-center justify-between p-4 ${entry.isCurrentUser ? 'bg-primary/5' : ''}`}>
              <div className="flex items-center gap-3">
                <span className={`w-5 text-center font-bold text-sm ${entry.rank <= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
                  {entry.rank}
                </span>
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={entry.avatarUrl} />
                  <AvatarFallback className="text-xs">{entry.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className={`text-sm font-medium ${entry.isCurrentUser ? 'text-primary font-bold' : ''}`}>
                  {entry.isCurrentUser ? "You" : entry.name}
                </span>
              </div>
              <span className="text-sm font-bold">{entry.score} pts</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
