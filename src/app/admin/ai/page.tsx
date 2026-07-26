"use client"

import { useState, useEffect, useCallback } from "react"
import { 
  Bot, Search, Filter, Plus, MoreHorizontal, Edit2, Copy, Trash2, ChevronLeft, ChevronRight 
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"

type AIPrompt = {
  id: string
  title: string
  description: string | null
  content: string
  category: string
  model: string
  temperature: number
  maxTokens: number
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminAIPromptManagement() {
  const [prompts, setPrompts] = useState<AIPrompt[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPromptId, setSelectedPromptId] = useState<string | null>(null)
  
  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    content: "",
    model: "gemini-1.5-pro",
    temperature: "0.7",
    maxTokens: "2048",
    status: "ACTIVE"
  })

  const fetchPrompts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/ai/prompts?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      if (!res.ok) throw new Error("Failed to fetch prompts")
      const data = await res.json()
      setPrompts(data.prompts)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      toast.error("Error fetching prompts")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPrompts()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [fetchPrompts])

  const handleOpenModal = (prompt?: AIPrompt, isDuplicate = false) => {
    if (prompt) {
      setFormData({
        title: isDuplicate ? `${prompt.title} (Copy)` : prompt.title,
        category: prompt.category,
        description: prompt.description || "",
        content: prompt.content,
        model: prompt.model,
        temperature: prompt.temperature.toString(),
        maxTokens: prompt.maxTokens.toString(),
        status: prompt.status
      })
      setSelectedPromptId(isDuplicate ? null : prompt.id)
    } else {
      setFormData({
        title: "",
        category: "",
        description: "",
        content: "",
        model: "gemini-1.5-pro",
        temperature: "0.7",
        maxTokens: "2048",
        status: "ACTIVE"
      })
      setSelectedPromptId(null)
    }
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.title || !formData.content || !formData.category) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      const url = selectedPromptId 
        ? `/api/admin/ai/prompts/${selectedPromptId}` 
        : `/api/admin/ai/prompts`
      
      const method = selectedPromptId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (!res.ok) throw new Error("Failed to save prompt")

      toast.success(selectedPromptId ? "Prompt updated successfully" : "Prompt created successfully")
      setIsModalOpen(false)
      fetchPrompts()
    } catch (error) {
      toast.error("Failed to save prompt")
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!promptToDelete) return
    try {
      const res = await fetch(`/api/admin/ai/prompts/${promptToDelete}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete prompt")
      toast.success("Prompt deleted successfully")
      setIsDeleteDialogOpen(false)
      setPromptToDelete(null)
      fetchPrompts()
    } catch (error) {
      toast.error("Failed to delete prompt")
      console.error(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2">AI Prompt Management</h1>
        <p className="text-muted-foreground">Create, organize and manage AI prompts, templates and model configurations used throughout EnglishBuddy.</p>
      </div>

      <Card className="shadow-sm border bg-card">
        <CardHeader className="pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold">Prompts</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search prompts..." 
                className="pl-9 h-9" 
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <Button variant="outline" size="sm" className="h-9 hidden sm:flex"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
            <Button size="sm" className="h-9" onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4" /> Create New</Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {!loading && prompts.length === 0 && !search ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Bot className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">No AI prompts created yet.</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                Get started by creating your first prompt template to power AI features across the platform.
              </p>
              <Button onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4" /> Create AI Prompt</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium rounded-tl-lg">Prompt Name</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Model</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading prompts...</td>
                      </tr>
                    ) : prompts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No prompts found matching "{search}".</td>
                      </tr>
                    ) : (
                      prompts.map((prompt) => (
                        <tr key={prompt.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium">{prompt.title}</td>
                          <td className="px-6 py-4">{prompt.category}</td>
                          <td className="px-6 py-4">
                            <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{prompt.model}</span>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={prompt.status === "ACTIVE" ? "default" : "secondary"}>
                              {prompt.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem onClick={() => handleOpenModal(prompt)}><Edit2 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenModal(prompt, true)}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => {
                                      setPromptToDelete(prompt.id)
                                      setIsDeleteDialogOpen(true)
                                    }}
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                                  </DropdownMenuItem>
                                </DropdownMenuGroup>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              
              {prompts.length > 0 && (
                <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground">
                  <span>Showing page {page} of {totalPages}</span>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === 1}
                      onClick={() => setPage(p => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      disabled={page === totalPages || totalPages === 0}
                      onClick={() => setPage(p => p + 1)}
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Create / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border text-card-foreground shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedPromptId ? "Edit AI Prompt" : "Create AI Prompt"}</DialogTitle>
            <DialogDescription>
              Configure the AI template, model settings, and parameters.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="title">Prompt Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="title" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})} 
                  placeholder="e.g. Essay Grader" 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                <Input 
                  id="category" 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})} 
                  placeholder="e.g. Assessment" 
                />
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input 
                id="description" 
                value={formData.description} 
                onChange={(e) => setFormData({...formData, description: e.target.value})} 
                placeholder="Brief description of what this prompt does..." 
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="content">Prompt Template <span className="text-destructive">*</span></Label>
              <Textarea 
                id="content" 
                value={formData.content} 
                onChange={(e) => setFormData({...formData, content: e.target.value})} 
                className="min-h-[200px] font-mono text-sm"
                placeholder="You are an expert English teacher. Grade the following essay: {{essay}}" 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="model">AI Model</Label>
                <Select value={formData.model} onValueChange={(val) => setFormData({...formData, model: val || ""})}>
                  <SelectTrigger id="model">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gemini-1.5-pro">Gemini 1.5 Pro</SelectItem>
                    <SelectItem value="gemini-1.5-flash">Gemini 1.5 Flash</SelectItem>
                    <SelectItem value="gemini-2.0-flash-exp">Gemini 2.0 Flash</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(val) => setFormData({...formData, status: val || ""})}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="temperature">Temperature (0 - 2)</Label>
                <Input 
                  id="temperature" 
                  type="number" 
                  min="0" 
                  max="2" 
                  step="0.1" 
                  value={formData.temperature} 
                  onChange={(e) => setFormData({...formData, temperature: e.target.value})} 
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input 
                  id="maxTokens" 
                  type="number" 
                  min="1" 
                  value={formData.maxTokens} 
                  onChange={(e) => setFormData({...formData, maxTokens: e.target.value})} 
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Prompt</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete AI Prompt?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this prompt? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
