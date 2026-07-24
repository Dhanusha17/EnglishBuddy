"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, Plus, Trash2, GripVertical, Save, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function CourseEditorPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<any>(null)
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCourseData = async () => {
    try {
      const [courseRes, lessonsRes] = await Promise.all([
        fetch(`/api/admin/courses/${courseId}`),
        fetch(`/api/admin/courses/${courseId}/lessons`)
      ])
      
      if (courseRes.ok) setCourse(await courseRes.json())
      if (lessonsRes.ok) setLessons(await lessonsRes.json())
    } catch (e) {
      toast.error("Failed to load course data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchCourseData()
    }
    run()
  }, [courseId])

  const handleCourseUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch(`/api/admin/courses/${courseId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(course),
      })
      if (res.ok) {
        toast.success("Course details saved")
      } else {
        toast.error("Failed to save course")
      }
    } catch (e) {
      toast.error("Error saving course")
    }
  }

  const createLesson = async () => {
    const title = prompt("Enter lesson title:")
    if (!title) return

    const nextOrder = lessons.length > 0 ? Math.max(...lessons.map(l => l.orderIndex)) + 1 : 1

    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, orderIndex: nextOrder, status: "DRAFT" }),
      })
      if (res.ok) {
        toast.success("Lesson created")
        fetchCourseData()
      } else {
        toast.error("Failed to create lesson")
      }
    } catch (e) {
      toast.error("Error creating lesson")
    }
  }

  const deleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return
    try {
      const res = await fetch(`/api/admin/courses/${courseId}/lessons/${lessonId}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Lesson deleted")
        fetchCourseData()
      } else {
        toast.error("Failed to delete lesson")
      }
    } catch (e) {
      toast.error("Error deleting lesson")
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading course editor...</div>
  if (!course) return <div className="p-8 text-center text-slate-400">Course not found.</div>

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={() => router.push("/admin/courses")} className="text-slate-400 hover:text-white">
          <ArrowLeft className="h-5 w-5 mr-2" /> Back
        </Button>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100 flex-1">{course.title}</h2>
        <Badge variant={course.status === "PUBLISHED" ? "default" : "secondary"}>
          {course.status}
        </Badge>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="bg-slate-900 border border-slate-800">
          <TabsTrigger value="details">Course Details</TabsTrigger>
          <TabsTrigger value="lessons">Lesson Management</TabsTrigger>
        </TabsList>
        
        <TabsContent value="details" className="mt-6 space-y-6">
          <form onSubmit={handleCourseUpdate} className="space-y-6 bg-slate-900/50 p-6 rounded-lg border border-slate-800">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Course Title</Label>
                <Input value={course.title} onChange={e => setCourse({...course, title: e.target.value})} className="bg-slate-950 border-slate-800" required />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={course.category || ""} onChange={e => setCourse({...course, category: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Difficulty</Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={course.difficulty || ""} 
                  onChange={e => setCourse({...course, difficulty: e.target.value})}
                >
                  <option value="">Select Difficulty</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Estimated Hours</Label>
                <Input type="number" value={course.estimatedHours || 0} onChange={e => setCourse({...course, estimatedHours: parseInt(e.target.value)})} className="bg-slate-950 border-slate-800" />
              </div>
              <div className="space-y-2">
                <Label>Thumbnail URL</Label>
                <Input value={course.thumbnail || ""} onChange={e => setCourse({...course, thumbnail: e.target.value})} className="bg-slate-950 border-slate-800" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={course.description || ""} onChange={e => setCourse({...course, description: e.target.value})} className="bg-slate-950 border-slate-800 min-h-[100px]" />
            </div>

            <div className="space-y-2">
              <Label>Prerequisites (Markdown/Text)</Label>
              <Textarea value={course.prerequisites || ""} onChange={e => setCourse({...course, prerequisites: e.target.value})} className="bg-slate-950 border-slate-800" />
            </div>

            <div className="space-y-2">
              <Label>Learning Outcomes (Markdown/Text)</Label>
              <Textarea value={course.learningOutcomes || ""} onChange={e => setCourse({...course, learningOutcomes: e.target.value})} className="bg-slate-950 border-slate-800" />
            </div>

            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="mr-2 h-4 w-4" /> Save Details
            </Button>
          </form>
        </TabsContent>

        <TabsContent value="lessons" className="mt-6 space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-slate-200">Curriculum</h3>
            <Button onClick={createLesson} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="mr-2 h-4 w-4" /> Add Lesson
            </Button>
          </div>
          
          <div className="space-y-3">
            {lessons.length === 0 ? (
              <div className="text-center p-8 border border-dashed border-slate-700 rounded-lg text-slate-500 bg-slate-900/30">
                No lessons added yet. Click "Add Lesson" to start building the curriculum.
              </div>
            ) : (
              lessons.map((lesson) => (
                <div key={lesson.id} className="flex items-center justify-between p-4 bg-slate-900 border border-slate-800 rounded-lg group">
                  <div className="flex items-center space-x-4">
                    <GripVertical className="h-5 w-5 text-slate-600 cursor-grab" />
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-slate-800 text-slate-300 font-medium text-sm">
                      {lesson.orderIndex}
                    </div>
                    <div>
                      <h4 className="font-medium text-slate-200">{lesson.title}</h4>
                      <p className="text-xs text-slate-500">
                        {lesson.status} • {lesson.duration || 0} mins • {lesson.xpReward} XP
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="outline" size="sm" className="border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800" onClick={() => {
                        const newTitle = prompt("Edit Title:", lesson.title);
                        if(newTitle) {
                          fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, { method: 'PATCH', body: JSON.stringify({title: newTitle}) }).then(() => fetchCourseData())
                        }
                    }}>
                      <Edit className="h-4 w-4 mr-2" /> Quick Edit
                    </Button>
                    <Button variant="outline" size="sm" className="border-slate-700 bg-slate-950 text-slate-300 hover:bg-slate-800" onClick={() => {
                        const content = prompt("Edit Rich Text Content:", lesson.textContent || "");
                        if(content !== null) {
                          fetch(`/api/admin/courses/${courseId}/lessons/${lesson.id}`, { method: 'PATCH', body: JSON.stringify({textContent: content, status: "PUBLISHED"}) }).then(() => fetchCourseData())
                        }
                    }}>
                      Edit Content & Publish
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-400 hover:bg-red-500/10" onClick={() => deleteLesson(lesson.id)}>
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
