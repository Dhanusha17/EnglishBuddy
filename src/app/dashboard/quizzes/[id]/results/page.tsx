"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle, XCircle, RotateCcw, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function StudentQuizResultsPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const quizId = params.id as string
  const attemptId = searchParams.get("attemptId")

  const [attempt, setAttempt] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!attemptId) {
      router.push(`/dashboard/quizzes/${quizId}`)
      return
    }

    const fetchAttempt = async () => {
      try {
        const res = await fetch(`/api/learning/quizzes/${quizId}/attempts/${attemptId}`)
        if (res.ok) {
          setAttempt(await res.json())
        } else {
          toast.error("Failed to load attempt details")
        }
      } catch (e) {
        toast.error("Error loading attempt details")
      } finally {
        setLoading(false)
      }
    }
    fetchAttempt()
  }, [quizId, attemptId, router])

  if (loading) return <div className="p-8 text-center text-slate-400">Loading results...</div>
  if (!attempt) return <div className="p-8 text-center text-slate-400">Results not found.</div>

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => router.push("/dashboard/quizzes")} className="text-slate-400 hover:text-white -ml-4">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Quizzes
      </Button>

      {/* Hero Section */}
      <div className={`p-8 md:p-12 rounded-xl text-center border relative overflow-hidden ${
        attempt.passed 
          ? 'bg-emerald-950/20 border-emerald-900/50' 
          : 'bg-red-950/20 border-red-900/50'
      }`}>
        <div className={`absolute top-0 left-0 w-full h-1 ${attempt.passed ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
        
        {attempt.passed ? (
          <Award className="h-20 w-20 text-emerald-500 mx-auto mb-6" />
        ) : (
          <XCircle className="h-20 w-20 text-red-500 mx-auto mb-6" />
        )}
        
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-2">
          {attempt.passed ? 'Congratulations!' : 'Keep Practicing'}
        </h1>
        <p className="text-slate-400 text-lg mb-8">
          You scored <span className="font-bold text-white">{attempt.percentage}%</span> on {attempt.quiz.title}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Score</div>
            <div className="text-xl font-bold text-slate-200">{attempt.score} Marks</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Status</div>
            <div className={`text-xl font-bold ${attempt.passed ? 'text-emerald-400' : 'text-red-400'}`}>
              {attempt.passed ? 'PASSED' : 'FAILED'}
            </div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Time Taken</div>
            <div className="text-xl font-bold text-slate-200">{formatTime(attempt.timeTaken)}</div>
          </div>
          <div className="bg-slate-900/50 rounded-lg p-4">
            <div className="text-slate-400 text-sm mb-1">Passing</div>
            <div className="text-xl font-bold text-slate-200">{attempt.quiz.passScore}%</div>
          </div>
        </div>

        <Button onClick={() => router.push(`/dashboard/quizzes/${quizId}/attempt`)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8">
          <RotateCcw className="h-4 w-4 mr-2" /> Try Again
        </Button>
      </div>

      {/* Answer Review Section */}
      <div className="space-y-6 mt-12">
        <h3 className="text-2xl font-bold text-slate-200">Review Answers</h3>
        
        <div className="space-y-6">
          {attempt.answers.map((ans: any, idx: number) => {
            const q = ans.question
            return (
              <div key={ans.id} className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="bg-slate-800 text-slate-300 text-xs font-bold px-2 py-1 rounded">
                      Q{idx + 1}
                    </span>
                    {ans.isCorrect ? (
                      <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"><CheckCircle className="h-3 w-3 mr-1" /> Correct</Badge>
                    ) : (
                      <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20"><XCircle className="h-3 w-3 mr-1" /> Incorrect</Badge>
                    )}
                  </div>
                  <div className="text-sm text-slate-500 font-medium">
                    {ans.marksAwarded} / {q.marks} Marks
                  </div>
                </div>

                <p className="text-lg text-slate-200 mb-6 font-medium">{q.question}</p>

                {(q.type === "MCQ" || q.type === "TRUE_FALSE") ? (
                  <div className="space-y-3">
                    {q.options.map((opt: any) => {
                      const isUserAnswer = ans.answerText === opt.id
                      const isCorrectAnswer = opt.isCorrect

                      let borderClass = "border-slate-800 bg-slate-900/50"
                      let icon = null

                      if (isUserAnswer && isCorrectAnswer) {
                        borderClass = "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                        icon = <CheckCircle className="h-5 w-5 text-emerald-500 ml-auto" />
                      } else if (isUserAnswer && !isCorrectAnswer) {
                        borderClass = "border-red-500/50 bg-red-500/10 text-red-400"
                        icon = <XCircle className="h-5 w-5 text-red-500 ml-auto" />
                      } else if (!isUserAnswer && isCorrectAnswer) {
                        borderClass = "border-emerald-500/30 bg-emerald-500/5 text-emerald-400/70 border-dashed"
                        icon = <CheckCircle className="h-5 w-5 text-emerald-500/50 ml-auto" />
                      }

                      return (
                        <div key={opt.id} className={`p-4 rounded-lg border flex items-center ${borderClass}`}>
                          <span className={`${isUserAnswer || isCorrectAnswer ? 'font-medium' : 'text-slate-400'}`}>
                            {opt.text}
                          </span>
                          {icon}
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Your Answer:</div>
                      <div className={`p-4 rounded-lg border ${ans.isCorrect ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400' : 'border-red-500/50 bg-red-500/10 text-red-400'}`}>
                        {ans.answerText || <span className="italic opacity-50">No answer provided</span>}
                      </div>
                    </div>
                    {!ans.isCorrect && q.options?.filter((o:any)=>o.isCorrect).length > 0 && (
                      <div>
                        <div className="text-sm text-slate-500 mb-1">Acceptable Answers:</div>
                        <div className="p-4 rounded-lg border border-emerald-500/30 bg-emerald-500/5 text-emerald-400/70 border-dashed">
                          <ul className="list-disc list-inside">
                            {q.options.filter((o:any)=>o.isCorrect).map((o:any) => (
                              <li key={o.id}>{o.text}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {q.explanation && (
                  <div className="mt-6 p-4 bg-blue-950/20 border border-blue-900/50 rounded-lg text-blue-200 text-sm">
                    <strong>Explanation:</strong> {q.explanation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
