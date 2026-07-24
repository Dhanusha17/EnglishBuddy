"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, PlayCircle, CheckCircle, Lock, BookOpen, Clock, Target, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

export default function StudentCourseDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string

  const [course, setCourse] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await fetch(`/api/learning/courses/${courseId}`)
        if (res.ok) {
          setCourse(await res.json())
        } else {
          toast.error("Failed to load course details")
        }
      } catch (e) {
        toast.error("Error loading course details")
      } finally {
        setLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  if (loading) return <div className="p-8 text-center text-slate-400">Loading course...</div>
  if (!course) return <div className="p-8 text-center text-slate-400">Course not found.</div>

  const progress = course.progress?.[0]
  const progressPct = progress ? progress.progressPct : 0
  const lastLessonId = progress?.lastLessonId

  const handleContinueLearning = () => {
    if (lastLessonId) {
      router.push(`/dashboard/lessons/${lastLessonId}`)
    } else if (course.lessons?.length > 0) {
      router.push(`/dashboard/lessons/${course.lessons[0].id}`)
    } else {
      toast.error("No lessons available in this course yet.")
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => router.push("/dashboard/courses")} className="text-slate-400 hover:text-white -ml-4">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Catalog
      </Button>

      {/* Hero Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden relative shadow-lg">
        {course.thumbnail && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={course.thumbnail} alt={course.title} className="w-full h-64 object-cover opacity-40 absolute top-0 left-0" />
        )}
        <div className="relative p-8 md:p-12 z-10 bg-gradient-to-t from-slate-900 to-slate-900/40">
          <div className="flex space-x-3 mb-4">
            <Badge className="bg-blue-600 hover:bg-blue-700">{course.category || "General"}</Badge>
            <Badge variant="outline" className="text-slate-300 border-slate-600">{course.difficulty || "Any Level"}</Badge>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">{course.title}</h1>
          <p className="text-slate-300 max-w-2xl text-lg mb-8">{course.description}</p>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div className="flex items-center space-x-6 text-slate-300">
              <span className="flex items-center"><Clock className="mr-2 h-5 w-5 text-blue-400"/> {course.estimatedHours || 0} Hours</span>
              <span className="flex items-center"><BookOpen className="mr-2 h-5 w-5 text-emerald-400"/> {course.lessons?.length || 0} Lessons</span>
            </div>
            <Button size="lg" onClick={handleContinueLearning} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 w-full sm:w-auto">
              <PlayCircle className="mr-2 h-5 w-5" />
              {progressPct === 0 ? "Start Learning" : progressPct === 100 ? "Review Course" : "Continue Learning"}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Syllabus */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl font-bold text-slate-100 mb-6">Course Syllabus</h3>
            {course.lessons?.length === 0 ? (
              <p className="text-slate-500">No published lessons available.</p>
            ) : (
              <div className="space-y-3">
                {course.lessons?.map((lesson: any) => {
                  const isCompleted = lesson.progress?.[0]?.completed
                  return (
                    <div 
                      key={lesson.id} 
                      onClick={() => router.push(`/dashboard/lessons/${lesson.id}`)}
                      className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                        isCompleted 
                        ? 'bg-slate-950 border-slate-800 hover:border-slate-700' 
                        : 'bg-slate-900 border-slate-700 hover:border-blue-500/50 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex-shrink-0 mr-4">
                        {isCompleted ? (
                          <CheckCircle className="h-6 w-6 text-green-500" />
                        ) : (
                          <div className="h-6 w-6 rounded-full border-2 border-slate-600 flex items-center justify-center">
                            <span className="text-xs font-bold text-slate-500">{lesson.orderIndex}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className={`font-medium ${isCompleted ? 'text-slate-400' : 'text-slate-200'}`}>{lesson.title}</h4>
                        <p className="text-xs text-slate-500 mt-1">{lesson.duration || 0} mins • {lesson.xpReward} XP</p>
                      </div>
                      <ArrowRight className={`h-5 w-5 ${isCompleted ? 'text-slate-700' : 'text-slate-500'}`} />
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Progress Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg font-bold text-slate-100 mb-4">Your Progress</h3>
            <div className="flex justify-between items-end mb-2">
              <span className="text-3xl font-bold text-blue-400">{progressPct}%</span>
              <span className="text-slate-500 text-sm mb-1">completed</span>
            </div>
            <Progress value={progressPct} className="h-2 bg-slate-800 mb-4" />
            <p className="text-sm text-slate-400">Keep going! Consistency is the key to fluency.</p>
          </div>

          {/* Details Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
            {course.prerequisites && (
              <div>
                <h4 className="flex items-center font-medium text-slate-200 mb-2">
                  <Lock className="mr-2 h-4 w-4 text-orange-400" /> Prerequisites
                </h4>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{course.prerequisites}</p>
              </div>
            )}
            
            {course.learningOutcomes && (
              <div>
                <h4 className="flex items-center font-medium text-slate-200 mb-2">
                  <Target className="mr-2 h-4 w-4 text-emerald-400" /> What You'll Learn
                </h4>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{course.learningOutcomes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
