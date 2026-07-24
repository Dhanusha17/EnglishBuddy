"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Clock, HelpCircle, Target, CheckCircle, XCircle, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StudentQuizLandingPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/learning/quizzes/${quizId}`)
        if (res.ok) {
          setQuiz(await res.json())
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

  if (loading) return <div className="p-8 text-center text-slate-400">Loading quiz details...</div>
  if (!quiz) return <div className="p-8 text-center text-slate-400">Quiz not found.</div>

  const previousAttempts = quiz.attempts || []
  const bestAttempt = previousAttempts.reduce((best: any, current: any) => 
    (current.percentage > (best?.percentage || 0)) ? current : best, 
    previousAttempts[0]
  )

  const handleStartQuiz = () => {
    if (quiz.questions?.length === 0) {
      toast.error("This quiz has no questions yet.")
      return
    }
    router.push(`/dashboard/quizzes/${quizId}/attempt`)
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => router.push("/dashboard/quizzes")} className="text-slate-400 hover:text-white -ml-4">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Quizzes
      </Button>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg p-8 md:p-12 text-center relative">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">{quiz.title}</h1>
        <p className="text-slate-300 max-w-2xl mx-auto text-lg mb-10">{quiz.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-10">
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg flex flex-col items-center justify-center">
            <HelpCircle className="h-8 w-8 text-blue-400 mb-3" />
            <div className="text-2xl font-bold text-white">{quiz.questions?.length || 0}</div>
            <div className="text-slate-400 text-sm">Questions</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg flex flex-col items-center justify-center">
            <Clock className="h-8 w-8 text-orange-400 mb-3" />
            <div className="text-2xl font-bold text-white">{quiz.timeLimit ? `${quiz.timeLimit} mins` : 'No Limit'}</div>
            <div className="text-slate-400 text-sm">Time Limit</div>
          </div>
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-lg flex flex-col items-center justify-center">
            <Target className="h-8 w-8 text-emerald-400 mb-3" />
            <div className="text-2xl font-bold text-white">{quiz.passScore}%</div>
            <div className="text-slate-400 text-sm">Passing Score</div>
          </div>
        </div>

        {bestAttempt && (
          <div className="max-w-2xl mx-auto bg-slate-800/50 border border-slate-700 p-6 rounded-lg mb-10 text-left flex items-center justify-between">
            <div>
              <h3 className="text-slate-200 font-bold mb-1">Your Best Attempt</h3>
              <p className="text-sm text-slate-400">Recorded on {new Date(bestAttempt.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold text-white">{bestAttempt.percentage}%</div>
                <div className={`text-sm font-medium ${bestAttempt.passed ? 'text-green-400' : 'text-red-400'}`}>
                  {bestAttempt.passed ? 'Passed' : 'Failed'}
                </div>
              </div>
              {bestAttempt.passed ? (
                <CheckCircle className="h-10 w-10 text-green-500" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
            </div>
          </div>
        )}

        <Button size="lg" onClick={handleStartQuiz} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-12 py-6 text-lg rounded-full shadow-lg shadow-blue-900/50">
          <Play className="mr-2 h-6 w-6" /> 
          {bestAttempt ? "Retry Quiz" : "Start Quiz"}
        </Button>
      </div>

    </div>
  )
}
