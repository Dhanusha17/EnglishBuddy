"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { 
  X, Heart, Zap, CheckCircle2, PlayCircle, Video, Image as ImageIcon, 
  BookMarked, Download, StickyNote, ArrowLeft, ArrowRight, BookOpen, Mic
} from "lucide-react"

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const [progress, setProgress] = useState(30) // Initial progress for demo
  const [completed, setCompleted] = useState(false)
  const [note, setNote] = useState("I need to practice the pronunciation of 'R' sounds more.")

  const triggerConfetti = () => {
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6']

    ;(function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      })
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }())
  }

  const handleComplete = () => {
    setProgress(100)
    setCompleted(true)
    triggerConfetti()
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Lesson Top Bar */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/learning/A0")} className="text-muted-foreground hover:bg-muted">
            <X className="h-6 w-6" />
          </Button>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Lesson {params.id}</span>
            <span className="font-bold">Basic Greetings & Introductions</span>
          </div>
        </div>
        
        <div className="flex-1 max-w-xl mx-8 flex items-center gap-4">
          <Progress value={progress} className="h-3 bg-secondary/50" />
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 font-bold text-rose-500">
            <Heart className="h-5 w-5 fill-rose-500" /> 5
          </div>
          <div className="hidden sm:flex items-center gap-1 font-bold text-yellow-500">
            <Zap className="h-5 w-5 fill-yellow-500" /> 120
          </div>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Main Learning Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-10 pb-24">
            
            <AnimatePresence>
              {completed && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-6 text-center shadow-lg"
                >
                  <div className="h-16 w-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white shadow-glow">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold text-green-700 dark:text-green-400 mb-2">Lesson Completed!</h2>
                  <p className="text-green-600 dark:text-green-500 mb-4 font-medium">You earned +150 XP and 20 Coins.</p>
                  <div className="flex justify-center gap-4">
                    <Button onClick={() => router.push("/dashboard/learning/A0")}>Return to Module</Button>
                    <Button variant="outline" className="border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/10">Next Lesson <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!completed && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-10">
                {/* Intro Section */}
                <section>
                  <h1 className="text-3xl lg:text-4xl font-bold tracking-tight mb-4">Hello! How are you?</h1>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    In this lesson, you will learn the most common ways to greet people in English, both formally and informally.
                  </p>
                </section>

                {/* Video Placeholder */}
                <Card className="overflow-hidden border-none shadow-md bg-muted/30">
                  <div className="aspect-video bg-black/5 flex items-center justify-center relative group cursor-pointer">
                    <Video className="h-16 w-16 text-muted-foreground/30 group-hover:scale-110 transition-transform" />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="h-16 w-16 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center backdrop-blur shadow-lg group-hover:bg-primary transition-colors">
                        <PlayCircle className="h-8 w-8" />
                      </div>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-sm font-medium text-muted-foreground">Watch: Formal vs Informal Greetings (2:45)</p>
                  </CardContent>
                </Card>

                {/* Explanation & Examples */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold border-b pb-2">1. Formal Greetings</h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-primary/20 bg-primary/5 shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-2">Good morning</h3>
                        <p className="text-muted-foreground text-sm mb-4">Used before 12:00 PM.</p>
                        <div className="flex items-center gap-3">
                          <Button size="icon" variant="secondary" className="rounded-full bg-background shrink-0"><PlayCircle className="h-5 w-5 text-primary" /></Button>
                          <span className="font-medium italic">"Good morning, Mr. Smith."</span>
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-border shadow-sm">
                      <CardContent className="p-6">
                        <h3 className="font-bold text-lg mb-2">Good afternoon</h3>
                        <p className="text-muted-foreground text-sm mb-4">Used from 12:00 PM to 5:00 PM.</p>
                        <div className="flex items-center gap-3">
                          <Button size="icon" variant="secondary" className="rounded-full bg-background shrink-0"><PlayCircle className="h-5 w-5 text-primary" /></Button>
                          <span className="font-medium italic">"Good afternoon, team."</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </section>

                {/* Interactive Practice Placeholder */}
                <Card className="border-2 border-primary/20 bg-card overflow-hidden shadow-sm">
                  <CardHeader className="bg-primary/5 border-b border-primary/10 pb-4">
                    <CardTitle className="text-lg flex items-center gap-2"><Mic className="h-5 w-5 text-primary" /> Speaking Practice</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 text-center space-y-6">
                    <h3 className="text-xl font-bold">"Good morning, how are you today?"</h3>
                    <div className="flex justify-center">
                      <Button size="lg" className="h-16 w-16 rounded-full shadow-glow"><Mic className="h-6 w-6" /></Button>
                    </div>
                    <p className="text-sm text-muted-foreground">Click the microphone and repeat the sentence.</p>
                  </CardContent>
                </Card>

                {/* Quiz Placeholder */}
                <section className="space-y-6">
                  <h2 className="text-2xl font-bold">Quick Quiz</h2>
                  <Card className="shadow-sm">
                    <CardContent className="p-6 space-y-4">
                      <p className="font-medium text-lg">Which greeting is appropriate at 8:00 PM?</p>
                      <div className="space-y-2">
                        {["Good morning", "Good afternoon", "Good evening", "Good night (as a greeting)"].map((opt, i) => (
                          <div key={i} className={`p-4 rounded-xl border-2 cursor-pointer transition-colors ${i === 2 ? 'border-primary bg-primary/5 font-bold' : 'border-border hover:bg-muted'}`}>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </section>

                {/* Summary & Completion */}
                <section className="bg-muted/30 rounded-2xl p-6 border text-center">
                  <h3 className="font-bold text-lg mb-2">Ready to complete the lesson?</h3>
                  <p className="text-muted-foreground mb-6">Make sure you review your notes and key points.</p>
                  <Button size="lg" onClick={handleComplete} className="w-full md:w-auto px-12 shadow-glow h-14 text-lg">
                    Mark as Complete
                  </Button>
                </section>
              </motion.div>
            )}

          </div>
        </main>

        {/* Right Sidebar - Tools */}
        <aside className="w-80 border-l bg-card hidden xl:flex flex-col z-10">
          <Tabs defaultValue="notes" className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <TabsList className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full bg-muted/50">
                <TabsTrigger value="notes"><StickyNote className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="bookmarks"><BookMarked className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="downloads"><Download className="h-4 w-4" /></TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <TabsContent value="notes" className="h-full flex flex-col mt-0 border-none outline-none">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">My Notes</h3>
                <Textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type your personal notes here..."
                  className="flex-1 resize-none bg-muted/30 border-none focus-visible:ring-1 p-4 shadow-inner"
                />
                <Button className="w-full mt-4" variant="secondary">Save Note</Button>
              </TabsContent>

              <TabsContent value="bookmarks" className="mt-0 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Bookmarks</h3>
                <Card className="shadow-none border-primary/20 bg-primary/5">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-sm mb-1">Formal Greetings</h4>
                    <p className="text-xs text-muted-foreground">Saved from Section 1</p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="downloads" className="mt-0 space-y-4">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Resources</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <Download className="mr-3 h-4 w-4 text-primary" />
                    <div className="text-left">
                      <div className="text-sm font-semibold">Lesson Summary PDF</div>
                      <div className="text-xs text-muted-foreground">1.2 MB</div>
                    </div>
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-auto py-3">
                    <Download className="mr-3 h-4 w-4 text-green-500" />
                    <div className="text-left">
                      <div className="text-sm font-semibold">Practice Worksheet</div>
                      <div className="text-xs text-muted-foreground">800 KB</div>
                    </div>
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </aside>
      </div>
    </div>
  )
}
