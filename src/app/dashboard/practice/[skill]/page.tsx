"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Headphones, Mic, BookOpen, Target, 
  ArrowLeft, ChevronRight, PlayCircle, Star, Clock, FileText
} from "lucide-react"
import Link from "next/link"

const skillConfig = {
  listening: {
    title: "Listening Practice",
    icon: Headphones,
    color: "bg-blue-500",
    categories: [
      "Daily Listening", "Beginner Listening", "Intermediate Listening", 
      "Advanced Listening", "Conversation Practice", "Dictation Practice", 
      "Listening Quiz", "Audio Library", "Listening Challenge"
    ]
  },
  speaking: {
    title: "Speaking Practice",
    icon: Mic,
    color: "bg-orange-500",
    categories: [
      "Read Aloud", "Daily Speaking Topic", "Picture Description", 
      "Self Introduction", "Storytelling", "Role Play", 
      "Interview Speaking", "Public Speaking", "Pronunciation Practice", 
      "Shadowing Practice", "Conversation Builder"
    ]
  },
  reading: {
    title: "Reading Practice",
    icon: BookOpen,
    color: "bg-green-500",
    categories: [
      "Daily Reading", "Short Stories", "Reading Comprehension", 
      "News Reading", "Paragraph Reading"
    ]
  },
  writing: {
    title: "Writing Practice",
    icon: Target,
    color: "bg-purple-500",
    categories: [
      "Sentence Writing", "Paragraph Writing", "Essay Writing", 
      "Email Writing", "Letter Writing", "Story Writing", 
      "Resume Writing", "Journal Writing"
    ]
  }
}

const mockExercises = [
  { id: 1, title: "Ordering Coffee at a Cafe", difficulty: "Beginner", time: "5 mins", xp: 50, completed: true },
  { id: 2, title: "Job Interview Introductions", difficulty: "Intermediate", time: "10 mins", xp: 100, completed: false },
  { id: 3, title: "Debating Global Warming", difficulty: "Advanced", time: "15 mins", xp: 150, completed: false },
  { id: 4, title: "Describing Your Hometown", difficulty: "Beginner", time: "8 mins", xp: 75, completed: false },
]

export default function SkillModulePage() {
  const params = useParams()
  const skillId = params.skill as string
  const config = skillConfig[skillId as keyof typeof skillConfig] || skillConfig.listening
  const Icon = config.icon

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/practice" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Practice Hub
        </Link>
        
        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-6 z-10">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-glow shrink-0 ${config.color}`}>
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{config.title}</h1>
              <p className="text-muted-foreground">Select a category and start practicing to earn XP.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            <Button className="shadow-soft" size="lg">Daily Recommendation <PlayCircle className="ml-2 h-5 w-5" /></Button>
            <Button variant="outline" size="lg">Bookmarks <FileText className="ml-2 h-4 w-4" /></Button>
          </div>
          
          <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-10 ${config.color}`} />
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8">
        
        {/* Categories Sidebar */}
        <div className="md:col-span-1 space-y-2">
          <h3 className="font-bold text-lg mb-4">Categories</h3>
          {config.categories.map((cat, idx) => (
            <div 
              key={cat} 
              className={`p-3 rounded-lg text-sm font-medium cursor-pointer transition-colors ${idx === 0 ? 'bg-primary/10 text-primary border border-primary/20' : 'hover:bg-muted text-muted-foreground'}`}
            >
              {cat}
            </div>
          ))}
        </div>

        {/* Exercises List */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex justify-between items-end mb-4 border-b pb-2">
            <h2 className="text-xl font-bold">{config.categories[0]}</h2>
            <span className="text-sm text-muted-foreground font-medium">{mockExercises.length} Exercises</span>
          </div>

          <div className="grid gap-4">
            {mockExercises.map((ex, idx) => (
              <motion.div
                key={ex.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.1 }}
              >
                <Card className={`border overflow-hidden transition-all hover:shadow-md hover:border-primary/30 ${ex.completed ? 'bg-muted/30 border-transparent' : 'bg-card'}`}>
                  <CardContent className="p-0">
                    <Link href={`/practice/exercise/${skillId}/${ex.id}`} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 md:p-5">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge variant={ex.difficulty === "Beginner" ? "secondary" : ex.difficulty === "Intermediate" ? "default" : "destructive"} className="text-[10px] uppercase font-bold tracking-wider rounded-sm px-1.5 py-0">
                            {ex.difficulty}
                          </Badge>
                          {ex.completed && <span className="text-xs font-semibold text-green-600 flex items-center"><Star className="h-3 w-3 mr-1 fill-green-600" /> Done</span>}
                        </div>
                        <h3 className={`text-lg font-bold mb-2 ${ex.completed ? 'text-muted-foreground' : 'text-foreground'}`}>{ex.title}</h3>
                        <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                          <span className="flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> {ex.time}</span>
                          <span className="flex items-center"><Star className="h-3.5 w-3.5 mr-1 text-yellow-500" /> +{ex.xp} XP</span>
                        </div>
                      </div>
                      
                      <div className="mt-4 sm:mt-0 shrink-0">
                        <Button variant={ex.completed ? "outline" : "default"} className={!ex.completed ? "shadow-soft w-full sm:w-auto" : "w-full sm:w-auto"}>
                          {ex.completed ? "Review" : "Start"} 
                          {!ex.completed && <ChevronRight className="ml-1 h-4 w-4" />}
                        </Button>
                      </div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
