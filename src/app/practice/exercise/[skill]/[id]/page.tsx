"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import confetti from "canvas-confetti"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { X, CheckCircle2, ArrowRight, Send } from "lucide-react"

import { AudioPlayer } from "@/components/practice/audio-player"
import { SpeechRecorder } from "@/components/practice/speech-recorder"
import { ReadingCard } from "@/components/practice/reading-card"
import { WritingEditor } from "@/components/practice/writing-editor"

export default function ExercisePage() {
  const router = useRouter()
  const params = useParams()
  const skill = params.skill as string
  const id = params.id as string
  
  const [progress, setProgress] = useState(0)
  const [completed, setCompleted] = useState(false)

  const handleComplete = () => {
    setProgress(100)
    setCompleted(true)
    
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
      if (Date.now() < end) requestAnimationFrame(frame)
    }())
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Exercise Top Bar */}
      <header className="h-16 border-b bg-card flex items-center justify-between px-4 lg:px-8 sticky top-0 z-50">
        <Button variant="ghost" size="icon" onClick={() => router.push(`/dashboard/practice/${skill}`)}>
          <X className="h-6 w-6" />
        </Button>
        <div className="flex-1 max-w-xl mx-8">
          <Progress value={progress} className="h-3 bg-secondary/50" />
        </div>
        <Button variant="outline" className="font-bold border-primary/50 text-primary">Save Progress</Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8 custom-scrollbar relative">
        <div className="pb-24 max-w-5xl mx-auto h-full">
          
          <AnimatePresence mode="wait">
            {completed ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-8 text-center shadow-lg max-w-md mx-auto mt-20"
              >
                <div className="h-20 w-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 text-white shadow-glow">
                  <CheckCircle2 className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-bold text-green-700 dark:text-green-400 mb-2">Excellent Work!</h2>
                <p className="text-green-600 dark:text-green-500 mb-6 font-medium text-lg">You earned +100 XP and increased your accuracy.</p>
                <Button size="lg" className="w-full text-lg shadow-soft h-14" onClick={() => router.push(`/dashboard/practice/${skill}`)}>
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            ) : (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                
                {skill === "listening" && (
                  <AudioPlayer 
                    title="Ordering Coffee at a Cafe"
                    description="Listen to the conversation and follow along with the transcript."
                    transcript={[
                      { speaker: "Barista", text: "Hi there! What can I get for you today?" },
                      { speaker: "Customer", text: "Can I get a large iced latte with oat milk, please?", highlight: true },
                      { speaker: "Barista", text: "Sure. Anything to eat with that?" }
                    ]}
                  />
                )}

                {skill === "speaking" && (
                  <SpeechRecorder 
                    title="Read Aloud: Introduction"
                    description="Read the text below clearly and naturally."
                    content="Good morning! My name is Alex, and I am a software engineer. I have been learning English for two years to improve my career opportunities."
                    onProgress={setProgress}
                  />
                )}

                {skill === "reading" && (
                  <ReadingCard 
                    title="The Future of AI"
                    meta="Reading Comprehension • 5 mins"
                    content={
                      <>
                        <p>Artificial intelligence is rapidly transforming how we work and live. From generating images to writing code, the capabilities of machine learning models have exceeded expectations.</p>
                        <p>However, this rapid advancement brings important questions about <span className="bg-yellow-200 dark:bg-yellow-900/50 cursor-pointer border-b-2 border-yellow-400">ethics and responsibility</span>. How do we ensure these systems are unbiased? Who owns the content created by an AI?</p>
                        <p>Experts suggest that the next decade will focus heavily on human-AI collaboration rather than direct replacement, emphasizing tools that augment human creativity.</p>
                      </>
                    }
                    questions={[
                      {
                        question: "What is the main concern mentioned in the second paragraph?",
                        options: ["The speed of AI models", "Ethics and responsibility", "Generating images", "Hardware limitations"],
                        answerIndex: 1
                      }
                    ]}
                    onProgress={setProgress}
                  />
                )}

                {skill === "writing" && (
                  <WritingEditor 
                    title="Write an Email to a Colleague"
                    prompt="Write a short email to your colleague Sarah asking for an update on the Q3 Marketing Report. Be polite and professional."
                    onProgress={setProgress}
                  />
                )}

                {/* Footer Action */}
                <div className="mt-12 flex justify-center">
                  <Button size="lg" onClick={handleComplete} className="px-16 h-14 text-lg shadow-glow">
                    {skill === "writing" ? <><Send className="mr-2 h-5 w-5" /> Submit Answer</> : "Mark as Complete"}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  )
}
