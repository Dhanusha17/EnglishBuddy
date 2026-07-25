"use client"

import { useState, useEffect } from "react"
import { Building2, Code2, Plus, FileText, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdminPlacementPage() {
  const [problems, setProblems] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("coding")
  
  const [codingForm, setCodingForm] = useState({
    title: "", description: "", difficulty: "EASY", category: "ARRAYS", testCases: ""
  })

  const fetchCodingProblems = async () => {
    const res = await fetch("/api/admin/placement/coding")
    if (res.ok) setProblems(await res.json())
  }

  useEffect(() => {
    const run = async () => {
      await fetchCodingProblems()
    }
    run()
  }, [])



  const handleCreateCoding = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch("/api/admin/placement/coding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(codingForm)
      })
      if (res.ok) {
        toast.success("Problem added successfully")
        fetchCodingProblems()
        setCodingForm({ title: "", description: "", difficulty: "EASY", category: "ARRAYS", testCases: "" })
      } else {
        toast.error("Failed to add problem")
      }
    } catch (e) {
      toast.error("Network error")
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement & Career Services Admin</h1>
        <p className="text-muted-foreground mt-2">Manage coding problems, companies, and view student readiness analytics.</p>
      </div>

      <div className="flex gap-4 border-b pb-2">
        <button 
          className={`pb-2 px-2 border-b-2 font-medium text-sm transition-colors \${activeTab === 'coding' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('coding')}
        >
          <span className="flex items-center gap-2"><Code2 className="h-4 w-4" /> Coding Problems</span>
        </button>
        <button 
          className={`pb-2 px-2 border-b-2 font-medium text-sm transition-colors \${activeTab === 'companies' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('companies')}
        >
          <span className="flex items-center gap-2"><Building2 className="h-4 w-4" /> Companies</span>
        </button>
        <button 
          className={`pb-2 px-2 border-b-2 font-medium text-sm transition-colors \${activeTab === 'analytics' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="flex items-center gap-2"><Activity className="h-4 w-4" /> Analytics</span>
        </button>
      </div>

      {activeTab === "coding" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Coding Question Bank</h2>
            <Dialog>
              <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                <Plus className="h-4 w-4 mr-2" /> Add Problem
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Coding Problem</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateCoding} className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input required value={codingForm.title} onChange={e => setCodingForm({...codingForm, title: e.target.value})} placeholder="Two Sum" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Difficulty</Label>
                      <Select value={codingForm.difficulty} onValueChange={v => setCodingForm({...codingForm, difficulty: v || "EASY"})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EASY">Easy</SelectItem>
                          <SelectItem value="MEDIUM">Medium</SelectItem>
                          <SelectItem value="HARD">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={codingForm.category} onValueChange={v => setCodingForm({...codingForm, category: v || "ARRAYS"})}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ARRAYS">Arrays</SelectItem>
                          <SelectItem value="STRINGS">Strings</SelectItem>
                          <SelectItem value="DP">Dynamic Programming</SelectItem>
                          <SelectItem value="SQL">SQL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Problem Statement</Label>
                    <Textarea required rows={4} value={codingForm.description} onChange={e => setCodingForm({...codingForm, description: e.target.value})} placeholder="Given an array of integers nums..." />
                  </div>
                  <div className="space-y-2">
                    <Label>Test Cases (JSON format recommended)</Label>
                    <Textarea required rows={3} value={codingForm.testCases} onChange={e => setCodingForm({...codingForm, testCases: e.target.value})} placeholder="Input: nums = [2,7,11,15], target = 9\nOutput: [0,1]" />
                  </div>
                  <Button type="submit" className="w-full">Create Problem</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-xl bg-card overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Total Submissions</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {problems.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No coding problems found.</td>
                  </tr>
                ) : problems.map(prob => (
                  <tr key={prob.id} className="border-b last:border-0 hover:bg-muted/10">
                    <td className="px-6 py-4 font-medium">{prob.title}</td>
                    <td className="px-6 py-4">{prob.category}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium \${prob.difficulty === 'EASY' ? 'bg-secondary' : prob.difficulty === 'MEDIUM' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                        {prob.difficulty}
                      </span>
                    </td>
                    <td className="px-6 py-4">{prob._count.submissions}</td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm">Edit</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "companies" && (
        <div className="flex flex-col items-center justify-center h-64 border rounded-xl bg-card border-dashed">
          <Building2 className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2">Company Preparation Module</h2>
          <p className="text-muted-foreground">This section will allow admins to create preparation profiles for specific companies (TCS, Infosys, etc).</p>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="flex flex-col items-center justify-center h-64 border rounded-xl bg-card border-dashed">
          <Activity className="h-12 w-12 text-muted-foreground mb-4 opacity-30" />
          <h2 className="text-xl font-semibold mb-2">Placement Analytics Overview</h2>
          <p className="text-muted-foreground">Aggregate data on student readiness, resume scores, and mock interview performances will appear here.</p>
        </div>
      )}

    </div>
  )
}
