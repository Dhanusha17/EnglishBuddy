"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent } from "@/components/ui/card"
import { X, ChevronLeft, ChevronRight, HelpCircle, AlertCircle, ArrowRight, CheckCircle2, Loader2 } from "lucide-react"

import { ExamTimer } from "@/components/tests/exam-timer"
import { QuestionCard } from "@/components/tests/question-card"
import { ResultCard } from "@/components/tests/result-card"
import { useAppStore } from "@/store/useAppStore"

export default function TestSessionPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const addXp = useAppStore((state) => state.addXp)

  const [testState, setTestState] = useState<"intro" | "running" | "completed">("intro")
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [markedForReview, setMarkedForReview] = useState<Record<number, boolean>>({})

  const [testData, setTestData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/tests/${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.error) setTestData(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!testData || !testData.questions || testData.questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Test not found</h2>
          <Button className="mt-4" onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const totalQs = testData.questions.length
  const timeLimit = testData.timeLimit || 15
  const mockQuestions = testData.questions.map((q: any) => ({
    type: q.type.toLowerCase() === "multiple_choice" ? "mcq" : "text",
    text: q.content,
    options: q.answers.map((a: any) => a.content)
  }))

  const handleTimeUp = () => {
    finishTest()
  }

  const finishTest = () => {
    setTestState("completed")
    addXp(450) // Sync gamification engine
    
    // Confetti
    const duration = 3000
    const end = Date.now() + duration
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 }, colors })
      confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 }, colors })
      if (Date.now() < end) requestAnimationFrame(frame)
    }())
  }

  const handleNext = () => {
    if (currentQ < totalQs - 1) setCurrentQ(prev => prev + 1)
  }

  const handlePrev = () => {
    if (currentQ > 0) setCurrentQ(prev => prev - 1)
  }

  const toggleReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentQ]: !prev[currentQ] }))
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      {/* Header */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <X className="h-6 w-6" />
        </Button>

        {testState === "running" && (
          <>
            <div className="flex-1 max-w-xl mx-8 hidden md:block">
              <Progress value={(Object.keys(answers).length / totalQs) * 100} className="h-2" />
            </div>
            <ExamTimer initialMinutes={timeLimit} onTimeUp={handleTimeUp} />
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar">
        <div className="max-w-4xl mx-auto h-full flex flex-col justify-center">
          
          <AnimatePresence mode="wait">
            
            {/* INTRO SCREEN */}
            {testState === "intro" && (
              <motion.div 
                key="intro"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight">{testData.title || "Assessment"}</h1>
                  <p className="text-xl text-muted-foreground">Test your comprehensive grammar and vocabulary skills.</p>
                </div>

                <div className="grid sm:grid-cols-3 gap-6">
                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="p-6 text-center space-y-2">
                      <HelpCircle className="h-8 w-8 text-primary mx-auto mb-2" />
                      <h3 className="font-bold text-lg">{totalQs} Questions</h3>
                      <p className="text-sm text-muted-foreground">Multiple Choice, Fill in Blanks</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-orange-500/5 border-orange-500/20">
                    <CardContent className="p-6 text-center space-y-2">
                      <AlertCircle className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                      <h3 className="font-bold text-lg">{timeLimit} Minutes</h3>
                      <p className="text-sm text-muted-foreground">Timer cannot be paused</p>
                    </CardContent>
                  </Card>
                  <Card className="bg-green-500/5 border-green-500/20">
                    <CardContent className="p-6 text-center space-y-2">
                      <CheckCircle2 className="h-8 w-8 text-green-500 mx-auto mb-2" />
                      <h3 className="font-bold text-lg">70% Passing</h3>
                      <p className="text-sm text-muted-foreground">To unlock the certificate</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center pt-8">
                  <Button size="lg" className="px-16 h-14 text-lg shadow-glow" onClick={() => setTestState("running")}>
                    Start Exam <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* RUNNING SCREEN */}
            {testState === "running" && (
              <motion.div 
                key="running"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex justify-between items-center mb-6">
                  <span className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Question {currentQ + 1} of {totalQs}</span>
                  <Button variant={markedForReview[currentQ] ? "default" : "outline"} size="sm" onClick={toggleReview} className={markedForReview[currentQ] ? "bg-orange-500 hover:bg-orange-600 border-none" : ""}>
                    {markedForReview[currentQ] ? "Marked for Review" : "Mark for Review"}
                  </Button>
                </div>

                <div className="flex-1">
                  <QuestionCard 
                    questionId={currentQ.toString()}
                    type={mockQuestions[currentQ].type}
                    questionText={mockQuestions[currentQ].text}
                    options={mockQuestions[currentQ].options}
                    value={answers[currentQ]}
                    onChange={(val) => setAnswers(prev => ({ ...prev, [currentQ]: val }))}
                  />
                </div>

                {/* Footer Nav */}
                <div className="mt-8 flex justify-between items-center bg-card p-4 rounded-2xl border shadow-sm">
                  <Button variant="ghost" onClick={handlePrev} disabled={currentQ === 0}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Previous
                  </Button>
                  
                  {currentQ === totalQs - 1 ? (
                    <Button onClick={finishTest} className="shadow-soft px-8">Submit Exam</Button>
                  ) : (
                    <Button onClick={handleNext} className="shadow-soft px-8">
                      Next <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </div>
              </motion.div>
            )}

            {/* COMPLETED SCREEN */}
            {testState === "completed" && (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto w-full"
              >
                <ResultCard 
                  score={8}
                  total={10}
                  correct={8}
                  wrong={1}
                  skipped={1}
                  timeTaken="12m 45s"
                  xpEarned={450}
                  rank="#14"
                />
                
                <div className="mt-8 flex justify-center gap-4">
                  <Button variant="outline" size="lg" onClick={() => router.push("/dashboard/tests")}>Return to Dashboard</Button>
                  <Button size="lg" className="shadow-soft">View Detailed Analytics</Button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </main>

      {/* Question Palette Drawer (Mobile/Desktop overlay placeholder) */}
      {testState === "running" && (
        <div className="fixed bottom-4 left-4 hidden xl:block bg-card border shadow-lg rounded-2xl p-4 w-64 z-50">
          <h4 className="font-bold text-sm mb-3">Question Palette</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2">
            {[...Array(totalQs)].map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentQ(i)}
                className={`
                  h-8 w-8 rounded text-xs font-bold transition-all flex items-center justify-center
                  ${currentQ === i ? 'ring-2 ring-primary ring-offset-2' : ''}
                  ${answers[i] ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}
                  ${markedForReview[i] ? 'ring-2 ring-orange-500' : ''}
                `}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
