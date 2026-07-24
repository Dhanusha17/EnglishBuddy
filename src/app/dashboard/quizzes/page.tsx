"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, PlayCircle, HelpCircle, Clock, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function StudentQuizzesPage() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await fetch("/api/learning/quizzes")
        if (res.ok) {
          const { data } = await res.json()
          setQuizzes(data)
        } else {
          toast.error("Failed to load quizzes")
        }
      } catch (e) {
        toast.error("Error loading quizzes")
      } finally {
        setLoading(false)
      }
    }
    fetchQuizzes()
  }, [])

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Quizzes & Assessments</h2>
          <p className="text-sm text-slate-400">Test your knowledge and track your progress.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search quizzes..." 
            className="pl-8 bg-slate-900 border-slate-700 text-slate-100 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading quizzes...</div>
      ) : filteredQuizzes.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No quizzes available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => {
            const attempt = quiz.attempts?.[0]
            
            return (
              <Card key={quiz.id} className="bg-slate-900 border-slate-800 flex flex-col hover:border-slate-700 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/quizzes/${quiz.id}`)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-900 bg-blue-950/30">
                      Assessment
                    </Badge>
                    {attempt && (
                      attempt.passed 
                      ? <Badge className="bg-green-500/10 text-green-500"><CheckCircle className="h-3 w-3 mr-1" /> Passed</Badge>
                      : <Badge className="bg-red-500/10 text-red-500"><XCircle className="h-3 w-3 mr-1" /> Failed</Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg text-slate-200 line-clamp-2">{quiz.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pb-4 flex-grow">
                  <p className="text-sm text-slate-400 line-clamp-2 mb-4">{quiz.description}</p>
                  <div className="flex flex-wrap items-center text-xs text-slate-500 gap-4">
                    <span className="flex items-center">
                      <HelpCircle className="h-4 w-4 mr-1 text-slate-600" />
                      {quiz._count.questions} Questions
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-4 w-4 mr-1 text-slate-600" />
                      {quiz.timeLimit ? `${quiz.timeLimit} mins` : 'No Limit'}
                    </span>
                    <span className="flex items-center text-blue-400 font-medium">
                      Pass: {quiz.passScore}%
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 border-t border-slate-800/50 mt-4 flex flex-col items-start gap-4 pb-6">
                  {attempt && (
                    <div className="w-full flex justify-between items-center text-sm pt-4">
                      <span className="text-slate-400">Best Score</span>
                      <span className={`font-bold ${attempt.passed ? 'text-green-400' : 'text-red-400'}`}>{attempt.percentage}%</span>
                    </div>
                  )}
                  <Button className="w-full bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-colors border-0">
                    <PlayCircle className="mr-2 h-4 w-4" /> 
                    {attempt ? "Retry Quiz" : "Start Quiz"}
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
