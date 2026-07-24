"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, ThumbsUp, Bookmark, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DiscussionCardProps {
  title: string
  author: string
  avatarInitials: string
  timeAgo: string
  category: string
  contentPreview: string
  upvotes: number
  replies: number
  isPinned?: boolean
}

export function DiscussionCard({
  title, author, avatarInitials, timeAgo, category, contentPreview, upvotes, replies, isPinned
}: DiscussionCardProps) {
  return (
    <Card className={`shadow-sm border transition-colors hover:border-primary/30 ${isPinned ? 'border-l-4 border-l-yellow-500 bg-yellow-500/5' : ''}`}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isPinned && <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-700 hover:bg-yellow-500/20">Pinned</Badge>}
              <Badge variant="outline" className="bg-background">{category}</Badge>
              <span className="text-xs text-muted-foreground">• Posted by {author} {timeAgo}</span>
            </div>
            
            <h3 className="text-lg font-bold mb-2 leading-tight hover:text-primary cursor-pointer transition-colors line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{contentPreview}</p>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <ThumbsUp className="h-4 w-4" /> {upvotes}
              </button>
              <button className="flex items-center gap-1.5 hover:text-primary transition-colors">
                <MessageSquare className="h-4 w-4" /> {replies} Replies
              </button>
            </div>
          </div>

          <div className="flex flex-col items-end justify-between h-full">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><MoreHorizontal className="h-4 w-4" /></Button>
            <div className="mt-8 flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Bookmark className="h-4 w-4" /></Button>
              <Avatar className="h-8 w-8 border bg-background">
                <AvatarImage src="" />
                <AvatarFallback className="text-[10px]">{avatarInitials}</AvatarFallback>
              </Avatar>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}
