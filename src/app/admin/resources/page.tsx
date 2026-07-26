"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { 
  FolderOpen, Search, Filter, Plus, MoreHorizontal, Edit2, Copy, Trash2, 
  ChevronLeft, ChevronRight, UploadCloud, File as FileIcon, X, CheckCircle2 
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
import { Progress } from "@/components/ui/progress"
import { toast } from "sonner"

type Resource = {
  id: string
  title: string
  description: string | null
  category: string
  tags: string | null
  difficulty: string | null
  language: string | null
  visibility: string | null
  fileType: string
  fileUrl: string
  status: string
  createdAt: string
  updatedAt: string
}

export default function AdminResourceLibrary() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null)
  
  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    tags: "",
    difficulty: "BEGINNER",
    language: "EN",
    visibility: "PUBLIC",
    status: "DRAFT",
    fileType: "document",
    fileUrl: ""
  })

  // File Upload State
  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchResources = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/resources?page=${page}&limit=10&search=${encodeURIComponent(search)}`)
      if (!res.ok) throw new Error("Failed to fetch resources")
      const data = await res.json()
      setResources(data.resources)
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      toast.error("Error fetching resources")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }, [page, search])

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchResources()
    }, 300)
    return () => clearTimeout(delayDebounceFn)
  }, [fetchResources])

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      category: "",
      tags: "",
      difficulty: "BEGINNER",
      language: "EN",
      visibility: "PUBLIC",
      status: "DRAFT",
      fileType: "document",
      fileUrl: ""
    })
    setSelectedResourceId(null)
    setSelectedFile(null)
    setUploadProgress(0)
    setIsUploading(false)
  }

  const handleOpenModal = (resource?: Resource, isDuplicate = false) => {
    if (resource) {
      setFormData({
        title: isDuplicate ? `${resource.title} (Copy)` : resource.title,
        description: resource.description || "",
        category: resource.category,
        tags: resource.tags || "",
        difficulty: resource.difficulty || "BEGINNER",
        language: resource.language || "EN",
        visibility: resource.visibility || "PUBLIC",
        status: isDuplicate ? "DRAFT" : resource.status,
        fileType: resource.fileType,
        fileUrl: resource.fileUrl
      })
      setSelectedResourceId(isDuplicate ? null : resource.id)
      setSelectedFile(null) // Existing file is already represented by fileUrl
      setUploadProgress(100)
    } else {
      resetForm()
    }
    setIsModalOpen(true)
  }

  const simulateFileUpload = (file: File) => {
    setSelectedFile(file)
    setIsUploading(true)
    setUploadProgress(0)
    
    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 20) + 10
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        setIsUploading(false)
        setFormData(prev => ({
          ...prev, 
          fileUrl: `https://cdn.englishbuddy.com/resources/${Date.now()}-${file.name.replace(/\s+/g, '-')}`,
          fileType: file.type || "application/octet-stream"
        }))
      }
      setUploadProgress(progress)
    }, 200)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      simulateFileUpload(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      simulateFileUpload(e.dataTransfer.files[0])
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setUploadProgress(0)
    setFormData(prev => ({ ...prev, fileUrl: "", fileType: "document" }))
  }

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!formData.title || !formData.category || !formData.fileUrl) {
      toast.error("Title, Category, and File are required")
      return
    }

    const payload = { ...formData, status }

    try {
      const url = selectedResourceId 
        ? `/api/admin/resources/${selectedResourceId}` 
        : `/api/admin/resources`
      
      const method = selectedResourceId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })

      if (!res.ok) throw new Error("Failed to save resource")

      toast.success(selectedResourceId ? "Resource updated" : "Resource created")
      setIsModalOpen(false)
      fetchResources()
    } catch (error) {
      toast.error("Failed to save resource")
      console.error(error)
    }
  }

  const handleDelete = async () => {
    if (!resourceToDelete) return
    try {
      const res = await fetch(`/api/admin/resources/${resourceToDelete}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete resource")
      toast.success("Resource deleted successfully")
      setIsDeleteDialogOpen(false)
      setResourceToDelete(null)
      fetchResources()
    } catch (error) {
      toast.error("Failed to delete resource")
      console.error(error)
    }
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Resource Library</h1>
        <p className="text-muted-foreground">Upload and manage educational materials, documents, and media files.</p>
      </div>

      <Card className="shadow-sm border bg-card">
        <CardHeader className="pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-bold">Resources</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search resources..." 
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
          {!loading && resources.length === 0 && !search ? (
            <div className="flex flex-col items-center justify-center py-24 text-center px-4">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FolderOpen className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">No resources uploaded yet.</h3>
              <p className="text-muted-foreground mb-6 max-w-sm text-center">
                Get started by uploading PDFs, documents, or media files to your library.
              </p>
              <Button onClick={() => handleOpenModal()}><Plus className="mr-2 h-4 w-4" /> Upload Resource</Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                    <tr>
                      <th className="px-6 py-3 font-medium rounded-tl-lg">Resource Title</th>
                      <th className="px-6 py-3 font-medium">Category</th>
                      <th className="px-6 py-3 font-medium">Difficulty</th>
                      <th className="px-6 py-3 font-medium">Status</th>
                      <th className="px-6 py-3 font-medium text-right rounded-tr-lg">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading resources...</td>
                      </tr>
                    ) : resources.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No resources found matching "{search}".</td>
                      </tr>
                    ) : (
                      resources.map((resource) => (
                        <tr key={resource.id} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                          <td className="px-6 py-4 font-medium">
                            <div className="flex items-center gap-2">
                              <FileIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="truncate max-w-[200px] block" title={resource.title}>{resource.title}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">{resource.category}</td>
                          <td className="px-6 py-4">
                            {resource.difficulty && (
                              <Badge variant="outline" className="text-xs font-normal">
                                {resource.difficulty}
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant={resource.status === "PUBLISHED" ? "default" : "secondary"}>
                              {resource.status}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-md transition-colors ml-auto">
                                <MoreHorizontal className="h-4 w-4" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuGroup>
                                  <DropdownMenuItem onClick={() => handleOpenModal(resource)}><Edit2 className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleOpenModal(resource, true)}><Copy className="mr-2 h-4 w-4" /> Duplicate</DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onClick={() => {
                                      setResourceToDelete(resource.id)
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
              
              {resources.length > 0 && (
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

      {/* Upload / Edit Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl bg-card border text-card-foreground shadow-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedResourceId ? "Edit Resource" : "Upload Resource"}</DialogTitle>
            <DialogDescription>
              Provide details and upload a file for this resource.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            
            {/* File Upload Section */}
            <div className="space-y-3">
              <Label>File Upload <span className="text-destructive">*</span></Label>
              {formData.fileUrl ? (
                <div className="flex flex-col gap-3 p-4 border rounded-lg bg-muted/20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <div className="bg-primary/10 p-2 rounded shrink-0">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="truncate">
                        <p className="text-sm font-medium truncate max-w-[300px]">
                          {selectedFile ? selectedFile.name : formData.fileUrl.split('/').pop()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : "File attached"}
                        </p>
                      </div>
                    </div>
                    {isUploading ? (
                      <span className="text-xs text-muted-foreground">{uploadProgress}%</span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <Button variant="ghost" size="sm" onClick={removeFile} className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {isUploading && <Progress value={uploadProgress} className="h-1" />}
                </div>
              ) : (
                <div 
                  className={`border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/5"}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <UploadCloud className="h-8 w-8 text-muted-foreground mb-4" />
                  <p className="text-sm font-medium mb-1">Drag & Drop file here</p>
                  <p className="text-xs text-muted-foreground mb-4">or</p>
                  <Button variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>Browse Files</Button>
                  <input 
                    type="file" 
                    className="hidden" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                  />
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Resource Title <span className="text-destructive">*</span></Label>
                  <Input 
                    id="title" 
                    value={formData.title} 
                    onChange={(e) => setFormData({...formData, title: e.target.value})} 
                    placeholder="e.g. Grammar Guide" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                  <Input 
                    id="category" 
                    value={formData.category} 
                    onChange={(e) => setFormData({...formData, category: e.target.value})} 
                    placeholder="e.g. Grammar" 
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={formData.description} 
                  onChange={(e) => setFormData({...formData, description: e.target.value})} 
                  className="min-h-[80px]"
                  placeholder="Provide a brief description of this resource..." 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input 
                    id="tags" 
                    value={formData.tags} 
                    onChange={(e) => setFormData({...formData, tags: e.target.value})} 
                    placeholder="e.g. rules, practice, english" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="difficulty">Difficulty</Label>
                  <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val || "BEGINNER"})}>
                    <SelectTrigger id="difficulty">
                      <SelectValue placeholder="Select Difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BEGINNER">Beginner</SelectItem>
                      <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                      <SelectItem value="ADVANCED">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Settings */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="grid gap-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={formData.language} onValueChange={(val) => setFormData({...formData, language: val || "EN"})}>
                    <SelectTrigger id="language">
                      <SelectValue placeholder="Select Language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EN">English</SelectItem>
                      <SelectItem value="ES">Spanish</SelectItem>
                      <SelectItem value="FR">French</SelectItem>
                      <SelectItem value="DE">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="visibility">Visibility</Label>
                  <Select value={formData.visibility} onValueChange={(val) => setFormData({...formData, visibility: val || "PUBLIC"})}>
                    <SelectTrigger id="visibility">
                      <SelectValue placeholder="Select Visibility" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PUBLIC">Public</SelectItem>
                      <SelectItem value="PRIVATE">Private</SelectItem>
                      <SelectItem value="PREMIUM">Premium Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
          </div>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => handleSave("DRAFT")} disabled={isUploading}>Save Draft</Button>
              <Button onClick={() => handleSave("PUBLISHED")} disabled={isUploading}>Publish</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Resource?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this resource? This action cannot be undone.
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
