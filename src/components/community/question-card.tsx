"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, ThumbsUp, CheckCircle2, ChevronUp } from "lucide-react"

interface QuestionCardProps {
  title: string
  author: string
  timeAgo: string
  topic: string
  upvotes: number
  answers: number
  hasBestAnswer: boolean
}

export function QuestionCard({ title, author, timeAgo, topic, upvotes, answers, hasBestAnswer }: QuestionCardProps) {
  return (
    <Card className={`shadow-sm border transition-colors hover:border-primary/30 ${hasBestAnswer ? 'border-l-4 border-l-green-500 bg-green-500/5' : ''}`}>
      <CardContent className="p-4 sm:p-5 flex gap-4 sm:gap-6">
        
        {/* Voting block hidden on small mobile, flex otherwise */}
        <div className="hidden sm:flex flex-col items-center gap-1 shrink-0 bg-muted/50 p-2 rounded-lg border h-fit">
          <button className="text-muted-foreground hover:text-primary"><ChevronUp className="h-6 w-6" /></button>
          <span className="font-bold text-lg">{upvotes}</span>
          <span className="text-[10px] uppercase text-muted-foreground font-bold">Votes</span>
        </div>

        <div className="flex-1 min-w-0 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {hasBestAnswer && <Badge variant="secondary" className="bg-green-500/20 text-green-700 hover:bg-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Answered</Badge>}
              <Badge variant="outline" className="bg-background">{topic}</Badge>
            </div>
            <h3 className="text-base sm:text-lg font-bold mb-3 leading-tight hover:text-primary cursor-pointer transition-colors">{title}</h3>
          </div>
          
          <div className="flex items-center justify-between mt-2 flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6 border">
                <AvatarFallback className="text-[8px]">{author.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground font-medium">{author} asked {timeAgo}</span>
            </div>

            <div className="flex items-center gap-4 text-sm font-medium">
              <span className="sm:hidden text-muted-foreground flex items-center gap-1"><ThumbsUp className="h-4 w-4" /> {upvotes}</span>
              <span className={`flex items-center gap-1.5 ${answers > 0 ? (hasBestAnswer ? 'text-green-600 dark:text-green-500' : 'text-primary') : 'text-muted-foreground'}`}>
                <MessageCircle className="h-4 w-4" /> {answers} Answers
              </span>
            </div>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
