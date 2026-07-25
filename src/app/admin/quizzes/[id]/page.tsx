"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash2, Save, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

export default function QuizEditorPage() {
  const params = useParams()
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const fetchQuizData = async () => {
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`)
      if (res.ok) setQuiz(await res.json())
    } catch (e) {
      toast.error("Failed to load quiz data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchQuizData()
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizId])

  const handleQuizUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quiz),
      })
      if (res.ok) {
        toast.success("Quiz details saved")
      } else {
        toast.error("Failed to save quiz")
      }
    } catch (e) {
      toast.error("Error saving quiz")
    }
  }

  const createQuestion = async () => {
    const questionText = prompt("Enter question text:")
    if (!questionText) return

    try {
      // Create a basic MCQ by default, which they can edit later
      const res = await fetch(`/api/admin/quizzes/${quizId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          question: questionText, 
          type: "MCQ",
          marks: 1,
          difficulty: "Medium",
          options: [
            { text: "Option 1", isCorrect: true },
            { text: "Option 2", isCorrect: false }
          ]
        }),
      })
      if (res.ok) {
        toast.success("Question created")
        fetchQuizData()
      } else {
        toast.error("Failed to create question")
      }
    } catch (e) {
      toast.error("Error creating question")
    }
  }

  const deleteQuestion = async (questionId: string) => {
    if (!confirm("Delete this question?")) return
    try {
      const res = await fetch(`/api/admin/quizzes/${quizId}/questions/${questionId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Question deleted")
        fetchQuizData()
      } else {
        toast.error("Failed to delete question")
      }
    } catch (e) {
      toast.error("Error deleting question")
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading quiz editor...</div>
  if (!quiz) return <div className="p-8 text-center text-slate-400">Quiz not found.</div>

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.push("/admin/quizzes")} className="text-slate-400 hover:text-white">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex-1">{quiz.title}</h2>
        <Badge variant={quiz.status === "PUBLISHED" ? "default" : "secondary"}>
          {quiz.status}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="details">Quiz Settings</TabsTrigger>
          <TabsTrigger value="questions">Question Bank</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6 space-y-6">
          <form onSubmit={handleQuizUpdate} className="space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Quiz Title</Label>
                <Input value={quiz.title} onChange={e => setQuiz({...quiz, title: e.target.value})} className="bg-slate-950 border-slate-800" required />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Time Limit (minutes)</Label>
                <Input type="number" value={quiz.timeLimit || ""} onChange={e => setQuiz({...quiz, timeLimit: e.target.value ? parseInt(e.target.value) : null})} className="bg-slate-950 border-slate-800" placeholder="e.g. 30" />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Passing Score (%)</Label>
                <Input type="number" min="0" max="100" value={quiz.passScore} onChange={e => setQuiz({...quiz, passScore: parseInt(e.target.value)})} className="bg-slate-950 border-slate-800" required />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Course ID (optional linkage)</Label>
                <Input value={quiz.courseId || ""} onChange={e => setQuiz({...quiz, courseId: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1">
                <Label>Lesson ID (optional linkage)</Label>
                <Input value={quiz.lessonId || ""} onChange={e => setQuiz({...quiz, lessonId: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2 col-span-2 sm:col-span-1 flex flex-col justify-center">
                <label className="flex items-center space-x-2 text-sm text-slate-300">
                  <input type="checkbox" checked={quiz.randomize} onChange={e => setQuiz({...quiz, randomize: e.target.checked})} className="rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-blue-600" />
                  <span>Randomize Question Order</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description / Instructions</Label>
              <Textarea value={quiz.description || ""} onChange={e => setQuiz({...quiz, description: e.target.value})} className="bg-slate-950 border-slate-800 min-h-[100px]" />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Settings
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="questions" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-200 flex items-center">
              <HelpCircle className="mr-2 h-5 w-5 text-slate-500" /> 
              {quiz.questions?.length || 0} Questions
            </h3>
            <Button onClick={createQuestion} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Question
            </Button>
          </div>
          
          <div className="space-y-4">
            {quiz.questions?.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg text-slate-500 bg-slate-900/30">
                No questions added yet. Click "Add Question" to build the quiz.
              </div>
            ) : (
              quiz.questions?.map((q: any, index: number) => (
                <div key={q.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4 group relative">
                  <div className="flex justify-between items-start pr-8">
                    <div>
                      <div className="text-xs text-slate-500 font-medium mb-1">
                        Question {index + 1} • {q.type} • {q.marks} Marks • {q.difficulty}
                      </div>
                      <h4 className="font-medium text-slate-200 text-lg">{q.question}</h4>
                    </div>
                  </div>
                  
                  <div className="pl-4 border-l-2 border-slate-800 space-y-2">
                    {q.options?.map((opt: any) => (
                      <div key={opt.id} className="flex items-center text-sm">
                        <span className={`h-2 w-2 rounded-full mr-2 ${opt.isCorrect ? 'bg-green-500' : 'bg-slate-600'}`}></span>
                        <span className={opt.isCorrect ? 'text-green-400 font-medium' : 'text-slate-400'}>{opt.text}</span>
                      </div>
                    ))}
                  </div>

                  <div className="absolute top-4 right-4 flex space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteQuestion(q.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
