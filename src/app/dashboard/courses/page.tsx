"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Search, BookOpen, Clock, BarChart } from "lucide-react"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function StudentCoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/learning/courses?status=PUBLISHED")
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
    fetchCourses()
  }, [])

  const filteredCourses = courses.filter(c => 
    c.title.toLowerCase().includes(search.toLowerCase()) || 
    (c.category && c.category.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div className="space-y-6 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Course Catalog</h2>
          <p className="text-sm text-slate-400">Browse and enroll in available courses.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search courses..." 
            className="pl-8 bg-slate-900 border-slate-700 text-slate-100 w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-500">Loading courses...</div>
      ) : filteredCourses.length === 0 ? (
        <div className="text-center py-20 text-slate-500">No courses found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const progress = course.progress?.[0]
            const progressPct = progress ? progress.progressPct : 0

            return (
              <Card key={course.id} className="bg-slate-900 border-slate-800 flex flex-col hover:border-slate-700 transition-colors cursor-pointer" onClick={() => router.push(`/dashboard/courses/${course.id}`)}>
                {course.thumbnail ? (
                  <div className="w-full h-40 bg-slate-800 rounded-t-xl overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-80" />
                    {progressPct === 100 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">Completed</div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-40 bg-slate-800 rounded-t-xl flex items-center justify-center relative">
                    <BookOpen className="h-12 w-12 text-slate-600" />
                    {progressPct === 100 && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-md font-medium">Completed</div>
                    )}
                  </div>
                )}
                
                <CardHeader className="pb-2 flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-blue-400 border-blue-900 bg-blue-950/30">
                      {course.category || "General"}
                    </Badge>
                    <Badge variant="outline" className="text-slate-400 border-slate-700">
                      {course.difficulty || "Any Level"}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-slate-200 line-clamp-2">{course.title}</CardTitle>
                </CardHeader>
                
                <CardContent className="pb-4">
                  <div className="flex items-center text-xs text-slate-400 space-x-4">
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {course.estimatedHours || 0} hours
                    </span>
                    <span className="flex items-center">
                      <BookOpen className="h-3 w-3 mr-1" />
                      {course._count?.lessons || 0} lessons
                    </span>
                  </div>
                </CardContent>

                <CardFooter className="pt-0 flex flex-col items-start space-y-3">
                  {progressPct > 0 && progressPct < 100 ? (
                    <div className="w-full space-y-1">
                      <div className="flex justify-between text-xs text-slate-400">
                        <span>Progress</span>
                        <span>{progressPct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  ) : null}
                  <Button className="w-full bg-slate-800 hover:bg-blue-600 text-slate-200 hover:text-white transition-colors border-0">
                    {progressPct === 0 ? "Start Learning" : progressPct === 100 ? "Review Course" : "Continue"}
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
