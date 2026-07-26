"use client"

import { useEffect, useState, useMemo } from "react"
import { format } from "date-fns"
import { 
  MoreHorizontal, Search, BookOpen, Trash2, Edit, Plus, Archive, 
  PlayCircle, StopCircle, ArrowUpDown, Clock, Users, Star, LayoutGrid, Image as ImageIcon, Copy, AlertCircle, RefreshCw, Eye
} from "lucide-react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuGroup 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"

type Course = {
  id: string
  title: string
  category: string
  difficulty: string
  status: string
  createdAt: string
  thumbnail?: string
  creator: { name: string, email: string }
  _count: { lessons: number, progress: number }
}

export default function CourseManagementPage() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // API Pagination & Search states
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalItems, setTotalItems] = useState(0)
  const [search, setSearch] = useState("")
  
  // Dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null)
  
  // Client-side Filters
  const [categoryFilter, setCategoryFilter] = useState("ALL")
  const [difficultyFilter, setDifficultyFilter] = useState("ALL")
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [instructorFilter, setInstructorFilter] = useState("ALL")
  
  // Client-side Sorting
  const [sortBy, setSortBy] = useState<"name" | "date" | "status" | "students">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")

  const fetchCourses = async (currentPage = page, currentSearch = search) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/courses?page=${currentPage}&limit=${limit}&search=${encodeURIComponent(currentSearch)}`)
      if (res.ok) {
        const { data, pagination } = await res.json()
        setCourses(data)
        setTotalItems(pagination.total || 0)
      } else {
        setError("Failed to load courses from the server.")
        toast.error("Failed to load courses")
      }
    } catch (e) {
      setError("A network error occurred while loading courses.")
      toast.error("Error loading courses")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCourses(page, search)
    }, 300)
    return () => clearTimeout(delayDebounceFn)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search])

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
    try {
      const res = await fetch(`/api/admin/courses/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Course deleted successfully.")
        setCourses(prev => prev.filter(c => c.id !== id))
        setTotalItems(prev => Math.max(0, prev - 1))
        setIsDeleteDialogOpen(false)
        setCourseToDelete(null)
      } else {
        toast.error("Unable to delete course.")
      }
    } catch (e) {
      toast.error("Unable to delete course.")
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

  // --- Derived data ---

  // Summary stats (derived from current data page to show some dynamic data)
  const stats = useMemo(() => {
    return {
      total: totalItems || courses.length,
      published: courses.filter(c => c.status === "PUBLISHED").length,
      draft: courses.filter(c => c.status === "DRAFT").length,
      archived: courses.filter(c => c.status === "ARCHIVED").length,
      lessons: courses.reduce((acc, c) => acc + (c._count?.lessons || 0), 0),
      enrollments: courses.reduce((acc, c) => acc + (c._count?.progress || 0), 0)
    }
  }, [courses, totalItems])

  // Extract unique categories, instructors, difficulties for filters
  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean)))
  const difficulties = Array.from(new Set(courses.map(c => c.difficulty).filter(Boolean)))
  const instructors = Array.from(new Set(courses.map(c => c.creator?.name).filter(Boolean)))

  // Apply Client-Side Filtering & Sorting
  const processedCourses = useMemo(() => {
    let result = [...courses]

    // Filters
    if (categoryFilter !== "ALL") result = result.filter(c => c.category === categoryFilter)
    if (difficultyFilter !== "ALL") result = result.filter(c => c.difficulty === difficultyFilter)
    if (statusFilter !== "ALL") result = result.filter(c => c.status === statusFilter)
    if (instructorFilter !== "ALL") result = result.filter(c => c.creator?.name === instructorFilter)

    // Sorting
    result.sort((a, b) => {
      let comparison = 0
      if (sortBy === "name") comparison = a.title.localeCompare(b.title)
      else if (sortBy === "date") comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      else if (sortBy === "status") comparison = a.status.localeCompare(b.status)
      else if (sortBy === "students") {
        comparison = (a._count?.progress || 0) - (b._count?.progress || 0)
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

    return result
  }, [courses, categoryFilter, difficultyFilter, statusFilter, instructorFilter, sortBy, sortOrder])

  const handleSort = (field: "name" | "date" | "status" | "students") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("desc")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20 border-green-500/20">Published</Badge>
      case "DRAFT": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20 border-yellow-500/20">Draft</Badge>
      case "ARCHIVED": return <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/20">Archived</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />
    return <ArrowUpDown className={`ml-2 h-4 w-4 ${sortOrder === "asc" ? "text-primary" : "text-primary rotate-180"}`} />
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-100">Course Management</h2>
          <p className="text-sm text-slate-400 mt-1">View, create, and manage your educational content.</p>
        </div>
        <Button onClick={createCourse} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">
          <Plus className="mr-2 h-5 w-5" /> Create Course
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-medium text-slate-400 uppercase tracking-wider">Total Courses</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><div className="text-3xl font-bold text-slate-100">{stats.total}</div></CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-medium text-green-500 uppercase tracking-wider">Published</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><div className="text-3xl font-bold text-slate-100">{stats.published}</div></CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-medium text-yellow-500 uppercase tracking-wider">Drafts</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><div className="text-3xl font-bold text-slate-100">{stats.draft}</div></CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-medium text-slate-500 uppercase tracking-wider">Archived</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><div className="text-3xl font-bold text-slate-100">{stats.archived}</div></CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-medium text-blue-400 uppercase tracking-wider">Total Lessons</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><div className="text-3xl font-bold text-slate-100">{stats.lessons}</div></CardContent>
        </Card>
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader className="pb-2 pt-4 px-4"><CardTitle className="text-xs font-medium text-purple-400 uppercase tracking-wider">Enrollments</CardTitle></CardHeader>
          <CardContent className="px-4 pb-4"><div className="text-3xl font-bold text-slate-100">{stats.enrollments}</div></CardContent>
        </Card>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title..." 
              className="pl-9 bg-slate-950 border-slate-800 text-slate-100 w-full rounded-lg"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <div className="flex flex-wrap w-full gap-2 md:justify-end">
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "ALL")}>
              <SelectTrigger className="w-[140px] bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="ALL">All Categories</SelectItem>
                {categories.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={difficultyFilter} onValueChange={(val) => setDifficultyFilter(val || "ALL")}>
              <SelectTrigger className="w-[140px] bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="ALL">All Difficulties</SelectItem>
                {difficulties.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val || "ALL")}>
              <SelectTrigger className="w-[130px] bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="ALL">All Statuses</SelectItem>
                <SelectItem value="PUBLISHED">Published</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ARCHIVED">Archived</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={instructorFilter} onValueChange={(val) => setInstructorFilter(val || "ALL")}>
              <SelectTrigger className="w-[150px] bg-slate-950 border-slate-800 text-slate-200">
                <SelectValue placeholder="Instructor" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="ALL">All Instructors</SelectItem>
                {instructors.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-950/50">
              <TableRow className="border-slate-800 hover:bg-transparent">
                <TableHead className="w-16 text-slate-400">Preview</TableHead>
                <TableHead className="text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => handleSort("name")}>
                  <div className="flex items-center">Course {renderSortIcon("name")}</div>
                </TableHead>
                <TableHead className="text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => handleSort("status")}>
                  <div className="flex items-center">Status {renderSortIcon("status")}</div>
                </TableHead>
                <TableHead className="text-slate-400">Details</TableHead>
                <TableHead className="text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => handleSort("students")}>
                  <div className="flex items-center">Metrics {renderSortIcon("students")}</div>
                </TableHead>
                <TableHead className="text-slate-400 cursor-pointer hover:text-slate-200 transition-colors" onClick={() => handleSort("date")}>
                  <div className="flex items-center">Updated {renderSortIcon("date")}</div>
                </TableHead>
                <TableHead className="text-right text-slate-400 w-16">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={`skeleton-${i}`} className="border-slate-800">
                    <TableCell><Skeleton className="h-10 w-12 rounded-md bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-48 bg-slate-800 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20 rounded-full bg-slate-800" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-24 bg-slate-800 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-10 w-32 bg-slate-800 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-24 bg-slate-800 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto rounded-md bg-slate-800" /></TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-64">
                    <div className="flex flex-col items-center justify-center text-red-400 space-y-4">
                      <AlertCircle className="h-12 w-12" />
                      <p className="text-lg font-medium">{error}</p>
                      <Button variant="outline" onClick={() => fetchCourses()} className="border-slate-700 hover:bg-slate-800 text-slate-200">
                        <RefreshCw className="mr-2 h-4 w-4" /> Try Again
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : processedCourses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-[400px]">
                    <div className="flex flex-col items-center justify-center text-slate-400 space-y-6">
                      <div className="h-24 w-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-2">
                        <LayoutGrid className="h-12 w-12 text-slate-500" />
                      </div>
                      <div className="text-center">
                        <h3 className="text-xl font-bold text-slate-200">No courses available yet</h3>
                        <p className="text-sm mt-2 max-w-sm text-slate-500">We couldn't find any courses matching your current filters. Try clearing them or create a new course to get started.</p>
                      </div>
                      <Button onClick={createCourse} className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold mt-4">
                        <Plus className="mr-2 h-5 w-5" /> Create First Course
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                processedCourses.map((course) => {
                  return (
                    <TableRow key={course.id} className="border-slate-800 hover:bg-slate-800/40 transition-colors">
                      <TableCell>
                        <div className="h-10 w-16 bg-muted rounded relative overflow-hidden shrink-0">
                          <Image 
                            src={course.thumbnail || "https://images.unsplash.com/photo-1546410531-bb4caa6b424d"} 
                            alt={course.title}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-semibold text-slate-200 line-clamp-1">{course.title}</div>
                        <div className="text-xs text-slate-500 flex items-center mt-1">
                          <Users className="h-3 w-3 mr-1" />
                          By {course.creator?.name || "Unknown Instructor"}
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(course.status)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1.5">
                          <div className="flex space-x-1.5">
                            <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-[10px] text-slate-300 font-normal">
                              {course.category || "General"}
                            </Badge>
                            <Badge variant="outline" className="border-slate-700 bg-slate-800/50 text-[10px] text-slate-300 font-normal">
                              {course.difficulty || "All Levels"}
                            </Badge>
                          </div>
                          <div className="text-xs text-slate-400 flex items-center">
                            <BookOpen className="h-3 w-3 mr-1" /> {course._count.lessons} Lessons
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1.5 text-xs">
                          <div className="flex items-center text-slate-300"><Users className="h-3 w-3 mr-1.5 text-blue-400"/> {course._count?.progress || 0} enrolled</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-slate-400">
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1.5" />
                          {format(new Date(course.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-slate-700 rounded-lg transition-colors border border-transparent hover:border-slate-600">
                            <MoreHorizontal className="h-4 w-4" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200 min-w-[200px] shadow-2xl">
                            <DropdownMenuGroup>
                              <DropdownMenuLabel className="text-xs uppercase tracking-wider text-slate-500">Actions</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}/preview`)} className="hover:bg-slate-800 cursor-pointer py-2">
                                <Eye className="mr-2 h-4 w-4 text-emerald-400" /> View Course
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}`)} className="hover:bg-slate-800 cursor-pointer py-2">
                                <Edit className="mr-2 h-4 w-4 text-blue-400" /> Edit Course
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => router.push(`/admin/courses/${course.id}?tab=lessons`)} className="hover:bg-slate-800 cursor-pointer py-2">
                                <BookOpen className="mr-2 h-4 w-4 text-purple-400" /> Manage Lessons
                              </DropdownMenuItem>
                              <DropdownMenuSeparator className="bg-slate-800" />
                              
                              {course.status !== "PUBLISHED" ? (
                                <DropdownMenuItem onClick={() => updateCourse(course.id, { status: "PUBLISHED" })} className="text-green-500 hover:bg-slate-800 cursor-pointer py-2 focus:text-green-400">
                                  <PlayCircle className="mr-2 h-4 w-4" /> Publish / Unpublish
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem onClick={() => updateCourse(course.id, { status: "DRAFT" })} className="text-yellow-500 hover:bg-slate-800 cursor-pointer py-2 focus:text-yellow-400">
                                  <StopCircle className="mr-2 h-4 w-4" /> Publish / Unpublish
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuItem onClick={() => toast.info("Duplication started...")} className="hover:bg-slate-800 cursor-pointer py-2">
                                <Copy className="mr-2 h-4 w-4 text-slate-400" /> Duplicate Course
                              </DropdownMenuItem>

                              {course.status !== "ARCHIVED" && (
                                <DropdownMenuItem onClick={() => updateCourse(course.id, { status: "ARCHIVED" })} className="text-slate-400 hover:bg-slate-800 cursor-pointer py-2">
                                  <Archive className="mr-2 h-4 w-4" /> Archive Course
                                </DropdownMenuItem>
                              )}

                              <DropdownMenuSeparator className="bg-slate-800" />
                              
                              <DropdownMenuItem 
                                onClick={() => {
                                  setCourseToDelete(course.id);
                                  setIsDeleteDialogOpen(true);
                                }} 
                                className="text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer py-2 font-medium focus:text-red-400 focus:bg-red-500/10"
                              >
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Course
                              </DropdownMenuItem>
                            </DropdownMenuGroup>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination */}
        {!loading && totalItems > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/30">
            <div className="text-sm text-slate-400">
              Showing <span className="font-medium text-slate-200">{(page - 1) * limit + 1}</span> to <span className="font-medium text-slate-200">{Math.min(page * limit, totalItems)}</span> of <span className="font-medium text-slate-200">{totalItems}</span> results
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-slate-700 bg-transparent text-slate-300 hover:bg-slate-800"
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= totalItems}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-slate-900 border-slate-800 text-slate-200">
          <DialogHeader>
            <DialogTitle>Delete Course?</DialogTitle>
            <DialogDescription className="text-slate-400 mt-2">
              Are you sure you want to delete this course? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-slate-700 hover:bg-slate-800 text-slate-200"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => courseToDelete && deleteCourse(courseToDelete)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

