"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Search, BookOpen, Trash2, Edit, Plus, Archive, PlayCircle, StopCircle } from "lucide-react"
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

type Course = {
  id: string
  title: string
  category: string
  difficulty: string
  status: string
  createdAt: string
  creator: { name: string, email: string }
  _count: { lessons: number }
}

export default function CourseManagementPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/admin/courses")
      if (res.ok) {
        const { data } = await res.json()
        setCourses(data)
      } else {
        toast.error("Failed to load courses")
      }
    } catch (e) {
      toast.error("Error loading courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchCourses()
    }
    run()
  }, [])

  const updateCourse = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        toast.success("Course updated successfully")
        fetchCourses()
      } else {
        toast.error("Failed to update course")
      }
    } catch (e) {
      toast.error("Error updating course")
    }
  }

  const deleteCourse = async (id: string) => {
    if (!confirm("Are you sure you want to delete this course permanently? This will delete all associated lessons and progress!")) return

    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Course deleted successfully")
        fetchCourses()
      } else {
        toast.error("Failed to delete course")
      }
    } catch (e) {
      toast.error("Error deleting course")
    }
  }

  const createCourse = async () => {
    const title = prompt("Enter the title for the new course:")
    if (!title) return;
    
    try {
      const res = await fetch(`/api/admin/courses`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, status: "DRAFT" }),
      })
      if (res.ok) {
        const course = await res.json();
        toast.success("Course created successfully")
        router.push(`/admin/courses/${course.id}`)
      } else {
        toast.error("Failed to create course")
      }
    } catch (e) {
      toast.error("Error creating course")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Published</Badge>
      case "DRAFT": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Draft</Badge>
      case "ARCHIVED": return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20">Archived</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Course Management</h2>
          <p className="text-sm text-slate-400">View, create, and manage courses.</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search courses..." 
              className="pl-8 bg-slate-900 border-slate-700 text-slate-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button onClick={createCourse} className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="mr-2 h-4 w-4" /> Create Course
          </Button>
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">Category / Difficulty</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Lessons</TableHead>
              <TableHead className="text-slate-400">Created At</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">Loading courses...</TableCell>
              </TableRow>
            ) : filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">No courses found.</TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell>
                    <div className="font-medium text-slate-200">{course.title}</div>
                    <div className="text-xs text-slate-500">By {course.creator?.name || "Unknown"}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {course.category || "Uncategorized"}
                      </Badge>
                      <Badge variant="outline" className="border-slate-700 text-slate-300">
                        {course.difficulty || "Any"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(course.status)}</TableCell>
                  <TableCell className="text-sm text-slate-400">
                    <div className="flex items-center">
                      <BookOpen className="mr-2 h-4 w-4 text-slate-500" />
                      {course._count.lessons}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {format(new Date(course.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}`)} className="hover:bg-slate-800 cursor-pointer">
                          <Edit className="mr-2 h-4 w-4" /> Edit Details & Lessons
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        {course.status !== "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => updateCourse(course.id, { status: "PUBLISHED" })} className="text-green-500 hover:bg-slate-800 cursor-pointer">
                            <PlayCircle className="mr-2 h-4 w-4" /> Publish Course
                          </DropdownMenuItem>
                        )}
                        
                        {course.status === "PUBLISHED" && (
                          <DropdownMenuItem onClick={() => updateCourse(course.id, { status: "DRAFT" })} className="text-yellow-500 hover:bg-slate-800 cursor-pointer">
                            <StopCircle className="mr-2 h-4 w-4" /> Unpublish (Draft)
                          </DropdownMenuItem>
                        )}

                        {course.status !== "ARCHIVED" && (
                          <DropdownMenuItem onClick={() => updateCourse(course.id, { status: "ARCHIVED" })} className="text-slate-400 hover:bg-slate-800 cursor-pointer">
                            <Archive className="mr-2 h-4 w-4" /> Archive Course
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        <DropdownMenuItem onClick={() => deleteCourse(course.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Course
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
