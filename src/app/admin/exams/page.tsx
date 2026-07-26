"use client"

import { useEffect, useState } from "react"
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type Test = {
  id: string
  title: string
  type: string
  timeLimit: number
  passScore: number
  status: string
}

export default function ExamsManagementPage() {
  const [tests, setTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchTests = async () => {
    try {
      const res = await fetch("/api/admin/exams")
      if (res.ok) {
        const { data } = await res.json()
        setTests(data)
      } else {
        toast.error("Failed to load exams")
      }
    } catch (e) {
      toast.error("Error loading exams")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchTests()
    }
    run()
  }, [])

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/admin/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          title: "New Mock Test", 
          type: "MOCK", 
          timeLimit: 60, 
          passScore: 60, 
          status: "DRAFT" 
        })
      })
      if (res.ok) {
        toast.success("Exam created")
        fetchTests()
      } else {
        toast.error("Failed to create exam")
      }
    } catch (e) {
      toast.error("Error creating exam")
    }
  }

  const updateTest = async (id: string, updates: Partial<Test>) => {
    try {
      const res = await fetch(`/api/admin/exams/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        toast.success("Exam updated successfully")
        fetchTests()
      } else {
        toast.error("Failed to update exam")
      }
    } catch (e) {
      toast.error("Error updating exam")
    }
  }

  const deleteTest = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam permanently?")) return

    try {
      const res = await fetch(`/api/admin/exams/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Exam deleted successfully")
        fetchTests()
      } else {
        toast.error("Failed to delete exam")
      }
    } catch (e) {
      toast.error("Error deleting exam")
    }
  }

  const filteredTests = tests.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Exams & Tests</h2>
          <p className="text-sm text-slate-400">Manage placement tests, mock interviews, and assessments.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search exams..." 
              className="pl-8 bg-slate-900 border-slate-700 text-slate-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="mr-2 h-4 w-4" /> Create Exam
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Type</TableHead>
              <TableHead className="text-slate-400">Duration</TableHead>
              <TableHead className="text-slate-400">Pass Score</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">Loading exams...</TableCell>
              </TableRow>
            ) : filteredTests.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">No exams found.</TableCell>
              </TableRow>
            ) : (
              filteredTests.map((test) => (
                <TableRow key={test.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-200">{test.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {test.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">{test.timeLimit} mins</TableCell>
                  <TableCell className="text-sm text-slate-400">{test.passScore}%</TableCell>
                  <TableCell>
                    {test.status === "PUBLISHED" ? (
                      <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Published</Badge>
                    ) : (
                      <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => updateTest(test.id, { status: test.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED" })} className="hover:bg-slate-800 cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> {test.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        <DropdownMenuItem onClick={() => deleteTest(test.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Exam
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
