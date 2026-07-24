"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowLeft, CheckCircle, Play, FileText, Download, Target, Award, List } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StudentLessonViewerPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string

  const [lesson, setLesson] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [rewards, setRewards] = useState<any>(null)

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const res = await fetch(`/api/learning/lessons/${lessonId}`)
        if (res.ok) {
          const data = await res.json()
          setLesson(data)
          setIsCompleted(!!data.progress?.[0]?.completed)
        } else {
          toast.error("Failed to load lesson")
        }
      } catch (e) {
        toast.error("Error loading lesson")
      } finally {
        setLoading(false)
      }
    }
    fetchLesson()
  }, [lessonId])

  const markComplete = async () => {
    setSubmitting(true)
    try {
      const res = await fetch(`/api/learning/lessons/${lessonId}/complete`, {
        method: "POST"
      })
      if (res.ok) {
        const data = await res.json()
        setIsCompleted(true)
        setRewards(data.rewards)
        toast.success("Lesson marked as complete!")
      } else {
        toast.error("Failed to mark lesson complete")
      }
    } catch (e) {
      toast.error("Error updating progress")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Loading lesson...</div>
  if (!lesson) return <div className="p-8 text-center text-slate-400">Lesson not found.</div>

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      <Button variant="ghost" onClick={() => router.push(`/dashboard/courses/${lesson.courseId}`)} className="text-slate-400 hover:text-white -ml-4">
        <ArrowLeft className="h-5 w-5 mr-2" /> Back to Course
      </Button>

      {rewards && (
        <div className="bg-emerald-900/40 border border-emerald-500/50 rounded-xl p-6 flex flex-col sm:flex-row items-center justify-between shadow-lg">
          <div>
            <h3 className="text-xl font-bold text-emerald-400 flex items-center">
              <Award className="h-6 w-6 mr-2" />
              Lesson Complete!
            </h3>
            <p className="text-slate-300 mt-1">You earned {rewards.xpEarned} XP and maintained your {rewards.currentStreak} day streak!</p>
          </div>
          <Button onClick={() => router.push(`/dashboard/courses/${lesson.courseId}`)} className="mt-4 sm:mt-0 bg-emerald-600 hover:bg-emerald-700 text-white">
            Continue Course <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        {/* Header */}
        <div className="p-6 md:p-8 border-b border-slate-800">
          <div className="flex items-center space-x-2 text-sm text-blue-400 mb-3 font-medium">
            <span className="bg-blue-500/10 px-2 py-1 rounded-md">{lesson.course?.title}</span>
            <span>•</span>
            <span>Lesson {lesson.orderIndex}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{lesson.title}</h1>
        </div>

        {/* Video Player */}
        {lesson.videoUrl && (
          <div className="aspect-video bg-black flex items-center justify-center border-b border-slate-800 relative group">
            {/* If it's a real youtube/vimeo link we would use an iframe here. For now we just show a mockup */}
            <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg shadow-blue-500/20">
                <Play className="h-8 w-8 text-white ml-1" />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="p-6 md:p-8 space-y-12 text-slate-300">
          
          {lesson.textContent && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-400" /> Notes
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap leading-relaxed">
                {lesson.textContent}
              </div>
            </div>
          )}

          {lesson.vocabulary && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center">
                <List className="mr-2 h-5 w-5 text-emerald-400" /> Vocabulary List
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap bg-slate-950 p-6 rounded-lg border border-slate-800">
                {lesson.vocabulary}
              </div>
            </div>
          )}

          {lesson.grammarNotes && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center">
                <Target className="mr-2 h-5 w-5 text-orange-400" /> Grammar Rules
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap bg-slate-950 p-6 rounded-lg border border-slate-800">
                {lesson.grammarNotes}
              </div>
            </div>
          )}

          {lesson.exercises && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-100 flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-400" /> Practice Exercises
              </h3>
              <div className="prose prose-invert max-w-none text-slate-300 whitespace-pre-wrap bg-slate-950 p-6 rounded-lg border border-slate-800">
                {lesson.exercises}
              </div>
            </div>
          )}

        </div>
        
        {/* Footer Actions */}
        <div className="p-6 md:p-8 border-t border-slate-800 bg-slate-900/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex gap-4 w-full sm:w-auto">
            {lesson.pdfNotes && (
              <Button variant="outline" className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 flex-1 sm:flex-none">
                <Download className="mr-2 h-4 w-4" /> Download PDF
              </Button>
            )}
          </div>
          <Button 
            size="lg" 
            className={`w-full sm:w-auto font-medium px-8 transition-colors shadow-lg ${
              isCompleted 
                ? 'bg-slate-800 text-slate-400 cursor-not-allowed hover:bg-slate-800' 
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20'
            }`}
            onClick={markComplete}
            disabled={isCompleted || submitting}
          >
            <CheckCircle className="mr-2 h-5 w-5" /> 
            {submitting ? "Submitting..." : isCompleted ? "Completed" : "Mark as Complete"}
          </Button>
        </div>
      </div>
    </div>
  )
}
