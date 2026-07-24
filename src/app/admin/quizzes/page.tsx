"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Search, Trash2, Edit, Plus, PlayCircle, StopCircle, HelpCircle } from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Quiz = {
  id: string
  title: string
  timeLimit: number
  passScore: number
  status: string
  createdAt: string
  _count: { questions: number, attempts: number }
}

export default function QuizManagementPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchQuizzes = async () => {
    try {
      const res = await fetch("/api/admin/quizzes")
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

  useEffect(() => {
    const run = async () => {
      await fetchQuizzes()
    }
    run()
  }, [])

  const updateQuiz = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        toast.success("Quiz updated")
        fetchQuizzes()
      } else {
        toast.error("Failed to update quiz")
      }
    } catch (e) {
      toast.error("Error updating quiz")
    }
  }

  const deleteQuiz = async (id: string) => {
    if (!confirm("Are you sure you want to delete this quiz permanently?")) return

    try {
      const res = await fetch(`/api/admin/quizzes/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Quiz deleted")
        fetchQuizzes()
      } else {
        toast.error("Failed to delete quiz")
      }
    } catch (e) {
      toast.error("Error deleting quiz")
    }
  }

  const createQuiz = async () => {
    const title = prompt("Enter the title for the new quiz:")
    if (!title) return;
    
    try {
      const res = await fetch(`/api/admin/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "DRAFT" }),
      })
      if (res.ok) {
        const quiz = await res.json();
        toast.success("Quiz created")
        router.push(`/admin/quizzes/${quiz.id}`)
      } else {
        toast.error("Failed to create quiz")
      }
    } catch (e) {
      toast.error("Error creating quiz")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Published</Badge>
      case "DRAFT": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Draft</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Quiz & Assessment Management</h2>
          <p className="text-sm text-slate-400">View, create, and manage quizzes.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search quizzes..." 
              className="pl-8 bg-slate-900 border-slate-700 text-slate-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={createQuiz} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Quiz
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Settings</TableHead>
              <TableHead className="text-slate-400">Stats</TableHead>
              <TableHead className="text-slate-400">Created At</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">Loading quizzes...</TableCell>
              </TableRow>
            ) : filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">No quizzes found.</TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell>
                    <div className="font-medium text-slate-200">{quiz.title}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(quiz.status)}</TableCell>
                  <TableCell className="text-sm text-slate-400">
                    <div>{quiz.timeLimit ? `${quiz.timeLimit} mins` : 'No Time Limit'}</div>
                    <div className="text-xs text-slate-500">Pass: {quiz.passScore}%</div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    <div className="flex items-center space-x-3">
                      <span className="flex items-center" title="Questions"><HelpCircle className="h-3 w-3 mr-1 text-slate-500" /> {quiz._count.questions}</span>
                      <span className="flex items-center" title="Attempts"><PlayCircle className="h-3 w-3 mr-1 text-slate-500" /> {quiz._count.attempts}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {format(new Date(quiz.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/quizzes/${quiz.id}`)} className="hover:bg-slate-800 cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit Quiz Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        {quiz.status !== "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => updateQuiz(quiz.id, { status: "PUBLISHED" })} className="text-green-500 hover:bg-slate-800 cursor-pointer">
                            <PlayCircle className="mr-2 h-4 w-4" /> Publish Quiz
                          </DropdownMenuItem>
                        )}
                        
                        {quiz.status === "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => updateQuiz(quiz.id, { status: "DRAFT" })} className="text-yellow-500 hover:bg-slate-800 cursor-pointer">
                            <StopCircle className="mr-2 h-4 w-4" /> Unpublish
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        <DropdownMenuItem onClick={() => deleteQuiz(quiz.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Quiz
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
