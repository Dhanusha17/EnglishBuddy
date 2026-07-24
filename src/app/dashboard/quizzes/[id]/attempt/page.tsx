"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { Clock, AlertTriangle, Check, ChevronRight, ChevronLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function StudentQuizAttemptPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  useEffect(() => {
    startTimeRef.current = Date.now()
  }, [])

  const handleSubmit = async () => {
    if (submitting) return
    setSubmitting(true)
    
    // Calculate time taken
    const timeTaken = Math.floor((Date.now() - startTimeRef.current) / 1000)

    try {
      const res = await fetch(`/api/learning/quizzes/\${quizId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          timeTaken
        }),
      })

      if (res.ok) {
        const data = await res.json()
        toast.success("Quiz submitted successfully!")
        router.push(`/dashboard/quizzes/\${quizId}/results?attemptId=\${data.attemptId}`)
      } else {
        toast.error("Failed to submit quiz")
        setSubmitting(false)
      }
    } catch (e) {
      toast.error("Error submitting quiz")
      setSubmitting(false)
    }
  }

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/learning/quizzes/${quizId}`)
        if (res.ok) {
          const data = await res.json()
          setQuiz(data)
          if (data.timeLimit) {
            setTimeLeft(data.timeLimit * 60)
          }
        } else {
          toast.error("Failed to load quiz")
        }
      } catch (e) {
        toast.error("Error loading quiz")
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [quizId])

  useEffect(() => {
    if (timeLeft !== null && timeLeft > 0 && !submitting) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => (prev !== null ? prev - 1 : null))
      }, 1000)
    } else if (timeLeft === 0 && !submitting) {
      // Auto submit when time runs out
      toast.error("Time's up! Submitting quiz automatically.")
      // eslint-disable-next-line react-hooks/set-state-in-effect
      handleSubmit()
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [timeLeft, submitting])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId: string, answerIdOrText: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answerIdOrText
    }))
  }



  if (loading) return <div className="p-8 text-center text-slate-400 flex flex-col items-center justify-center h-screen">Loading quiz environment...</div>
  if (!quiz || !quiz.questions || quiz.questions.length === 0) return <div className="p-8 text-center text-slate-400">Invalid quiz configuration.</div>

  const currentQuestion = quiz.questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1
  const answeredCount = Object.keys(answers).length
  const allAnswered = answeredCount === quiz.questions.length

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 flex flex-col">
      {/* Top Bar */}
      <header className="h-16 border-b border-slate-800 bg-slate-900 px-6 flex items-center justify-between shrink-0 shadow-sm z-10">
        <div className="font-bold text-slate-200">{quiz.title}</div>
        
        {timeLeft !== null && (
          <div className={`flex items-center font-mono text-lg font-bold px-4 py-1.5 rounded-full ${timeLeft < 60 ? 'bg-red-500/10 text-red-500 animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
            <Clock className="h-5 w-5 mr-2" />
            {formatTime(timeLeft)}
          </div>
        )}
        
        <div>
          <Button variant="ghost" className="text-slate-400 hover:text-white" onClick={() => {
            if(confirm("Are you sure you want to exit? Your progress will be lost.")) {
              router.push(`/dashboard/quizzes/${quizId}`)
            }
          }}>
            Exit
          </Button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        
        {/* Left sidebar - Question Navigation (Hidden on small screens) */}
        <div className="hidden md:flex w-64 border-r border-slate-800 bg-slate-900/50 flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800">
            <h3 className="font-medium text-slate-300">Questions</h3>
            <div className="text-xs text-slate-500 mt-1">{answeredCount} of {quiz.questions.length} answered</div>
            
            <div className="h-2 bg-slate-800 rounded-full mt-3 overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-300" 
                style={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="p-4 grid grid-cols-4 gap-2">
            {quiz.questions.map((q: any, idx: number) => {
              const isAnswered = !!answers[q.id]
              const isCurrent = currentQuestionIndex === idx
              
              return (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    h-10 w-10 rounded-md font-medium text-sm flex items-center justify-center transition-all
                    ${isCurrent ? 'ring-2 ring-blue-500 bg-slate-800 text-white' : ''}
                    ${!isCurrent && isAnswered ? 'bg-blue-900/30 text-blue-400 border border-blue-800/50' : ''}
                    ${!isCurrent && !isAnswered ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : ''}
                  `}
                >
                  {idx + 1}
                </button>
              )
            })}
          </div>
        </div>

        {/* Center - Question Content */}
        <div className="flex-1 flex flex-col relative overflow-y-auto bg-slate-950">
          <div className="flex-1 max-w-3xl mx-auto w-full p-6 md:p-12 flex flex-col">
            
            {/* Question Header */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-4">
                <span className="bg-slate-800 text-slate-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {quiz.questions.length}
                </span>
                <span className="text-slate-500 text-sm">{currentQuestion.marks} Marks</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-medium text-slate-100 leading-relaxed">
                {currentQuestion.question}
              </h2>
            </div>

            {/* Answer Area */}
            <div className="flex-1">
              {(currentQuestion.type === "MCQ" || currentQuestion.type === "TRUE_FALSE") && (
                <div className="space-y-3">
                  {currentQuestion.options.map((opt: any) => {
                    const isSelected = answers[currentQuestion.id] === opt.id
                    return (
                      <div
                        key={opt.id}
                        onClick={() => handleAnswerSelect(currentQuestion.id, opt.id)}
                        className={`
                          p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center
                          ${isSelected 
                            ? 'border-blue-500 bg-blue-500/10' 
                            : 'border-slate-800 bg-slate-900 hover:border-slate-600 hover:bg-slate-800/80'}
                        `}
                      >
                        <div className={`
                          h-5 w-5 rounded-full border-2 mr-4 flex items-center justify-center
                          ${isSelected ? 'border-blue-500' : 'border-slate-600'}
                        `}>
                          {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-500"></div>}
                        </div>
                        <span className={`text-lg ${isSelected ? 'text-blue-100 font-medium' : 'text-slate-300'}`}>
                          {opt.text}
                        </span>
                      </div>
                    )
                  })}
                </div>
              )}

              {currentQuestion.type === "SHORT_ANSWER" && (
                <div className="space-y-3">
                  <Textarea 
                    placeholder="Type your answer here..." 
                    className="bg-slate-900 border-slate-700 text-lg p-4 min-h-[150px] focus:ring-blue-500 focus:border-blue-500 text-slate-200"
                    value={answers[currentQuestion.id] || ""}
                    onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                  />
                  <p className="text-sm text-slate-500">Please check your spelling. Short answers are evaluated automatically.</p>
                </div>
              )}
            </div>

          </div>
          
          {/* Bottom Action Bar */}
          <div className="h-20 border-t border-slate-800 bg-slate-900/80 backdrop-blur px-6 md:px-12 flex items-center justify-between shrink-0 sticky bottom-0">
            <Button 
              variant="outline" 
              className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white"
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Previous
            </Button>

            {!isLastQuestion ? (
              <Button 
                className="bg-slate-700 hover:bg-slate-600 text-white"
                onClick={() => setCurrentQuestionIndex(prev => Math.min(quiz.questions.length - 1, prev + 1))}
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button 
                className={`${allAnswered ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-900/50 shadow-lg' : 'bg-blue-600 hover:bg-blue-700'} text-white px-8`}
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? "Submitting..." : (
                  <>
                    <Check className="mr-2 h-4 w-4" /> Submit Quiz
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
