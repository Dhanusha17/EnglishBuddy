"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  ArrowLeft, CheckCircle2, ChevronRight, Lock, 
  PlayCircle, Star, Target, BookOpen, BrainCircuit
} from "lucide-react"
import Link from "next/link"

const levelData = {
  A0: {
    title: "Absolute Beginner",
    description: "Start your English journey from scratch. Learn the alphabet, basic sounds, and everyday vocabulary.",
    progress: 45,
    modules: [
      { id: 1, title: "Alphabet & Sounds", type: "foundation", status: "completed", xp: 100 },
      { id: 2, title: "Numbers 1-100", type: "vocabulary", status: "completed", xp: 100 },
      { id: 3, title: "Colors & Shapes", type: "vocabulary", status: "completed", xp: 100 },
      { id: 4, title: "Basic Greetings", type: "speaking", status: "in-progress", xp: 150 },
      { id: 5, title: "Family Members", type: "vocabulary", status: "locked", xp: 150 },
      { id: 6, title: "Daily Sentences", type: "grammar", status: "locked", xp: 200 },
      { id: 7, title: "Level A0 Final Assessment", type: "quiz", status: "locked", xp: 500 },
    ]
  }
}

export default function LevelModulesPage() {
  const params = useParams()
  const levelId = params.level as string
  
  // Fallback if not A0 for demo purposes
  const data = levelData[levelId as keyof typeof levelData] || levelData["A0"]

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/learning" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Roadmap
        </Link>
        
        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="text-lg px-3 py-1 bg-primary text-primary-foreground">{levelId}</Badge>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">{data.title}</h1>
              </div>
              <p className="text-muted-foreground">{data.description}</p>
            </div>
            <div className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-xl shrink-0">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
              <span className="font-bold">1,250 XP earned</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-medium">
              <span>Overall Progress</span>
              <span className="text-primary">{data.progress}%</span>
            </div>
            <Progress value={data.progress} className="h-3" />
          </div>
        </div>
      </div>

      {/* Modules Path */}
      <div className="relative py-8">
        {/* Connecting line for the path */}
        <div className="absolute left-8 top-16 bottom-16 w-1 bg-muted-foreground/20 rounded-full -z-10" />
        
        <div className="space-y-6">
          {data.modules.map((mod, idx) => {
            const isCompleted = mod.status === "completed"
            const isInProgress = mod.status === "in-progress"
            const isLocked = mod.status === "locked"

            const getIcon = () => {
              if (mod.type === 'speaking') return <BrainCircuit className="h-5 w-5" />
              if (mod.type === 'quiz') return <Target className="h-5 w-5" />
              return <BookOpen className="h-5 w-5" />
            }

            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="flex items-center gap-6 group"
              >
                {/* Node Icon */}
                <div className={`
                  h-16 w-16 rounded-full border-4 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 z-10
                  ${isCompleted ? 'bg-green-500 border-green-100 text-white' 
                  : isInProgress ? 'bg-primary border-primary/20 text-white shadow-glow' 
                  : 'bg-muted border-background text-muted-foreground'}
                `}>
                  {isCompleted ? <CheckCircle2 className="h-8 w-8" /> 
                   : isLocked ? <Lock className="h-6 w-6" /> 
                   : getIcon()}
                </div>

                {/* Module Card */}
                <Card className={`flex-1 overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-70 bg-muted/30 border-transparent' : 'hover:shadow-md hover:border-primary/50'}`}>
                  <CardContent className="p-0">
                    <Link href={isLocked ? '#' : `/learning/lesson/${mod.id}`} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-6 ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Module {mod.id}</span>
                          {isInProgress && <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/10">In Progress</Badge>}
                        </div>
                        <h3 className={`text-xl font-bold ${isLocked ? 'text-muted-foreground' : 'text-foreground'}`}>{mod.title}</h3>
                        <div className="flex items-center gap-4 mt-3 text-sm font-medium">
                          <span className={`flex items-center ${isCompleted ? 'text-green-600' : 'text-muted-foreground'}`}>
                            <Star className={`h-4 w-4 mr-1 ${isCompleted ? 'fill-green-600' : ''}`} /> {mod.xp} XP
                          </span>
                          <span className="capitalize text-muted-foreground flex items-center">
                            • {mod.type}
                          </span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 shrink-0">
                        {isCompleted ? (
                          <Button variant="outline" className="w-full sm:w-auto text-green-600 border-green-600/30 hover:bg-green-50">
                            Review <PlayCircle className="ml-2 h-4 w-4" />
                          </Button>
                        ) : isInProgress ? (
                          <Button className="w-full sm:w-auto shadow-soft">
                            Start Lesson <ChevronRight className="ml-2 h-4 w-4" />
                          </Button>
                        ) : (
                          <Button variant="secondary" disabled className="w-full sm:w-auto">
                            Locked
                          </Button>
                        )}
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
