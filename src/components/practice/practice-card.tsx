"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Star, ChevronRight, LucideIcon } from "lucide-react"
import Link from "next/link"

interface PracticeCardProps {
  id: string
  title: string
  icon: LucideIcon
  color: string
  progress: number
  level: string
  completed: number
  time: string
  goal: string
  xp: number
  delay?: number
}

export function PracticeCard({ 
  id, title, icon: Icon, color, progress, 
  level, completed, time, goal, xp, delay = 0 
}: PracticeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
    >
      <Card className="shadow-sm border-none bg-card hover:shadow-md transition-all h-full flex flex-col overflow-hidden group">
        <CardContent className="p-6 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white shadow-glow transition-transform group-hover:scale-105 ${color}`}>
              <Icon className="h-7 w-7" />
            </div>
            <Badge variant="secondary" className="font-bold bg-primary/10 text-primary hover:bg-primary/20">
              Level {level}
            </Badge>
          </div>
          
          <h2 className="text-2xl font-bold mb-1">{title}</h2>
          <p className="text-muted-foreground text-sm mb-6 flex items-center gap-4">
            <span>{completed} Exercises</span>
            <span className="flex items-center"><Star className="h-3.5 w-3.5 mr-1 text-yellow-500 fill-yellow-500" /> +{xp} XP</span>
          </p>

          <div className="mt-auto space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span>Progress to next level</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm">
                <p className="text-muted-foreground text-xs uppercase font-bold tracking-wider mb-0.5">Daily Goal</p>
                <p className="font-medium">{goal} ({time})</p>
              </div>
              <Link href={`/dashboard/practice/${id}`}>
                <Button className="shadow-soft">Continue <ChevronRight className="ml-1 h-4 w-4" /></Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
