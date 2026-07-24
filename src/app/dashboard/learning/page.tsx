"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Award, BookOpen, BrainCircuit, Calendar, CheckCircle2, 
  ChevronRight, Clock, Flame, Lock, Play, Search, Star, Trophy, Sparkles 
} from "lucide-react"
import Link from "next/link"

const levels = [
  { id: "A0", title: "Absolute Beginner", hours: 20, progress: 100, lessons: 24, totalLessons: 24, unlocked: true, xp: 500 },
  { id: "A1", title: "Beginner", hours: 40, progress: 45, lessons: 18, totalLessons: 40, unlocked: true, xp: 1200 },
  { id: "A2", title: "Elementary", hours: 60, progress: 0, lessons: 0, totalLessons: 55, unlocked: false, xp: 2000 },
  { id: "B1", title: "Intermediate", hours: 80, progress: 0, lessons: 0, totalLessons: 70, unlocked: false, xp: 3500 },
  { id: "B2", title: "Upper Intermediate", hours: 100, progress: 0, lessons: 0, totalLessons: 85, unlocked: false, xp: 5000 },
  { id: "C1", title: "Advanced", hours: 120, progress: 0, lessons: 0, totalLessons: 100, unlocked: false, xp: 7500 },
  { id: "C2", title: "Proficient", hours: 150, progress: 0, lessons: 0, totalLessons: 120, unlocked: false, xp: 10000 },
]

export default function LearningRoadmapPage() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* Main Learning Area */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
        
        {/* Header & Search/Filters */}
        <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card p-4 rounded-xl shadow-sm border border-border/50">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search topics, grammar, vocabulary..." 
              className="pl-9 bg-muted/50 border-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Tabs defaultValue="all" className="w-full md:w-auto">
            <TabsList className="grid grid-cols-4 bg-muted/50 w-full">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unlocked">Unlocked</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
              <TabsTrigger value="completed">Done</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Daily Recommendation */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border-primary/20 shadow-sm relative overflow-hidden group cursor-pointer">
            <CardContent className="p-6 flex items-center justify-between z-10 relative">
              <div className="flex gap-5 items-center">
                <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform shrink-0">
                  <Sparkles className="h-7 w-7" />
                </div>
                <div>
                  <Badge variant="secondary" className="mb-2 bg-background text-primary hover:bg-background">Daily Pick for You</Badge>
                  <h3 className="text-xl font-bold mb-1">A1: Present Continuous Tense</h3>
                  <p className="text-sm text-muted-foreground">Focus on your weak spot in grammar based on yesterday's quiz.</p>
                </div>
              </div>
              <Button className="hidden md:flex shadow-soft">
                Start Lesson <Play className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
            {/* Background decoration */}
            <div className="absolute right-0 top-0 w-64 h-full bg-gradient-to-l from-primary/10 to-transparent -z-10" />
          </Card>
        </motion.div>

        {/* Learning Roadmap */}
        <div>
          <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-primary" />
            Your Learning Journey
          </h2>
          
          <div className="space-y-6 relative">
            {/* Connecting line */}
            <div className="absolute left-8 top-10 bottom-10 w-0.5 bg-border -z-10 hidden md:block" />

            {levels.map((level, idx) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card className={`relative overflow-hidden border-2 transition-all ${level.unlocked ? 'border-primary/20 hover:border-primary/50 shadow-sm hover:shadow-md' : 'border-border/50 bg-muted/30 opacity-80'}`}>
                  {/* Status Indicator circle for desktop line */}
                  <div className={`absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full border-4 border-background flex items-center justify-center z-10 hidden md:flex ${level.progress === 100 ? 'bg-green-500' : level.unlocked ? 'bg-primary' : 'bg-muted-foreground'}`}>
                    {level.progress === 100 ? <CheckCircle2 className="h-3 w-3 text-white" /> : level.unlocked ? <div className="h-2 w-2 rounded-full bg-white" /> : <Lock className="h-3 w-3 text-white" />}
                  </div>

                  <CardContent className="p-0 flex flex-col md:flex-row">
                    {/* Left Section - Identity */}
                    <div className={`p-6 md:w-1/3 flex flex-col justify-center border-b md:border-b-0 md:border-r ${level.progress === 100 ? 'bg-green-500/5' : level.unlocked ? 'bg-primary/5' : 'bg-muted/50'}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant={level.unlocked ? "default" : "secondary"} className="font-bold text-sm h-8 w-8 p-0 flex items-center justify-center rounded-lg">
                          {level.id}
                        </Badge>
                        <h3 className="font-bold text-lg leading-tight">{level.title}</h3>
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground gap-3 mt-2 font-medium">
                        <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {level.hours} hrs</span>
                        <span className="flex items-center"><Star className="h-3.5 w-3.5 mr-1 text-yellow-500" /> {level.xp} XP</span>
                      </div>
                    </div>

                    {/* Right Section - Progress & Action */}
                    <div className="p-6 md:w-2/3 flex flex-col justify-between bg-card">
                      <div className="mb-6">
                        <div className="flex justify-between text-sm font-medium mb-2">
                          <span className={level.unlocked ? 'text-foreground' : 'text-muted-foreground'}>
                            {level.progress === 100 ? 'Completed' : level.unlocked ? 'In Progress' : 'Locked'}
                          </span>
                          <span className={level.unlocked ? 'text-primary' : 'text-muted-foreground'}>
                            {level.lessons} / {level.totalLessons} Lessons
                          </span>
                        </div>
                        <Progress value={level.progress} className={`h-2.5 ${!level.unlocked && 'opacity-50'}`} />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {level.progress === 100 && (
                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
                              <Award className="h-3.5 w-3.5 mr-1" /> Certificate Earned
                            </Badge>
                          )}
                        </div>
                        {level.progress === 100 ? (
                          <Link href={`/dashboard/learning/${level.id}`}>
                            <Button variant="outline">Review</Button>
                          </Link>
                        ) : level.unlocked ? (
                          <Link href={`/dashboard/learning/${level.id}`}>
                            <Button className="shadow-soft">Continue <ChevronRight className="ml-1 h-4 w-4" /></Button>
                          </Link>
                        ) : (
                          <Button variant="secondary" disabled>
                            <Lock className="mr-2 h-4 w-4" /> Locked
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Progress Panel */}
      <div className="flex flex-col gap-6">
        {/* Today's Goal */}
        <Card className="shadow-sm border-none bg-card text-center">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-bold">Today's Goal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mx-auto w-32 h-32 mb-4">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-muted/50" />
                <circle cx="50" cy="50" r="44" fill="transparent" stroke="var(--color-primary)" strokeWidth="8" strokeDasharray="276" strokeDashoffset="120" className="transition-all duration-1000 ease-out text-primary" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-black">45</span>
                <span className="text-xs font-bold text-muted-foreground uppercase">Mins</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">15 mins left to hit your daily goal!</p>
          </CardContent>
        </Card>

        {/* Streak & Achievements */}
        <Card className="shadow-sm border-none">
          <CardContent className="p-0">
            <div className="flex border-b divide-x">
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Flame className="h-6 w-6 text-orange-500 mb-2" />
                <span className="text-xl font-bold">12</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Day Streak</span>
              </div>
              <div className="flex-1 p-4 flex flex-col items-center justify-center text-center hover:bg-muted/50 transition-colors cursor-pointer">
                <Trophy className="h-6 w-6 text-yellow-500 mb-2" />
                <span className="text-xl font-bold">4</span>
                <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Badges</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar */}
        <Card className="shadow-sm border-none">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold flex items-center">
                <Calendar className="mr-2 h-4 w-4 text-primary" /> Learning Calendar
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground mb-2">
              <div>M</div><div>T</div><div>W</div><div>T</div><div>F</div><div>S</div><div>S</div>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center text-sm">
              {[...Array(30)].map((_, i) => {
                const isActive = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].includes(i)
                const isToday = i === 14
                return (
                  <div 
                    key={i} 
                    className={`aspect-square flex items-center justify-center rounded-md text-xs font-semibold
                      ${isActive ? 'bg-primary/20 text-primary' : 'hover:bg-muted text-muted-foreground'}
                      ${isToday ? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}
                    `}
                  >
                    {i + 1}
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
