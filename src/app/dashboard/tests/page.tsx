"use client"

import { useState, useEffect } from "react"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  BookOpen, BrainCircuit, Headphones, Mic, PenTool, 
  Target, GraduationCap, Briefcase, Zap, Trophy, Award, Calendar, Loader2
} from "lucide-react"

import { ExamCard } from "@/components/tests/exam-card"
import { LeaderboardCard } from "@/components/tests/leaderboard-card"
import { CertificateCard } from "@/components/tests/certificate-card"

export default function TestsDashboardPage() {
  const [mainExams, setMainExams] = useState<any[]>([])
  const [specialExams, setSpecialExams] = useState<any[]>([])
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch("/api/tests?type=MOCK").then(r => r.json()),
      fetch("/api/tests?type=PLACEMENT").then(r => r.json()),
      fetch("/api/tests/leaderboard").then(r => r.json())
    ]).then(([mainRes, specialRes, lbRes]) => {
      setMainExams(mainRes.data || [])
      setSpecialExams(specialRes.data || [])
      setLeaderboard(Array.isArray(lbRes) ? lbRes : [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  const mapIcon = (type: string) => {
    if (type === "PLACEMENT") return GraduationCap
    if (type === "MOCK") return Briefcase
    return BookOpen
  }

  return (
    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* Main Content Area */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Tests & Exams</h1>
            <p className="text-muted-foreground text-lg">Assess your skills from A0 to C2 and prepare for placements.</p>
          </div>
          <Badge variant="outline" className="px-4 py-1.5 text-sm font-bold w-fit bg-card">
            Current Level: <span className="text-primary ml-2">B2 Upper Intermediate</span>
          </Badge>
        </div>

        {/* Weekly & Monthly Tests */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm overflow-hidden">
            <CardContent className="p-6 relative h-full flex flex-col justify-between">
              <div className="mb-4">
                <Badge className="bg-primary/20 text-primary hover:bg-primary/20 mb-3">Active Now</Badge>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Zap className="h-5 w-5 text-primary" /> Weekly Challenge Test
                </h3>
                <p className="text-sm text-muted-foreground">Comprehensive grammar and vocabulary assessment.</p>
              </div>
              <div className="flex items-center justify-between text-sm font-medium pt-4 mt-auto">
                <span className="flex items-center gap-1.5"><Trophy className="h-4 w-4 text-yellow-500" /> +1000 XP Reward</span>
                <span className="text-muted-foreground flex items-center gap-1.5"><Calendar className="h-4 w-4" /> Ends in 2 days</span>
              </div>
              <div className="absolute right-0 top-0 w-32 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            </CardContent>
          </Card>

          <Card className="bg-card shadow-sm border border-transparent hover:border-border transition-all overflow-hidden">
            <CardContent className="p-6 h-full flex flex-col justify-between">
              <div className="mb-4">
                <Badge variant="outline" className="mb-3">Upcoming</Badge>
                <h3 className="text-xl font-bold flex items-center gap-2 mb-1">
                  <Award className="h-5 w-5 text-yellow-500" /> Monthly Assessment
                </h3>
                <p className="text-sm text-muted-foreground">Level up to C1 Advanced by passing this exam.</p>
              </div>
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex justify-between text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <span>Eligibility Progress</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Core Skill Tests */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Core Skill Tests
          </h2>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {mainExams.map(exam => (
              <ExamCard key={exam.id} {...exam} icon={mapIcon(exam.type)} colorClass="bg-blue-500" questions={exam._count?.questions || 0} />
            ))}
            {mainExams.length === 0 && <p className="text-muted-foreground">No core skill tests available.</p>}
          </div>
        </div>

        {/* Placement Preparation */}
        <div>
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            Placement Preparation
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {specialExams.map(exam => (
              <ExamCard key={exam.id} {...exam} icon={mapIcon(exam.type)} colorClass="bg-yellow-500" questions={exam._count?.questions || 0} />
            ))}
            {specialExams.length === 0 && <p className="text-muted-foreground">No placement tests available.</p>}
          </div>
        </div>

      </div>

      {/* Right Progress Panel */}
      <div className="flex flex-col gap-6">
        
        <LeaderboardCard 
          title="Weekly Leaderboard"
          entries={leaderboard}
        />

        <div>
          <h3 className="font-bold text-lg mb-4">Certificates</h3>
          <div className="space-y-4">
            <CertificateCard title="B2 Upper Intermediate" level="Course Completion" isUnlocked={true} />
            <CertificateCard title="C1 Advanced" level="Level Assessment" isUnlocked={false} progress={65} />
            <CertificateCard title="Grammar Master" level="Skill Certificate" isUnlocked={false} progress={82} />
          </div>
        </div>

        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-base">Upcoming Tests</CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-primary mt-1.5" />
              <div>
                <p className="text-sm font-bold">Mock Interview Round 2</p>
                <p className="text-xs text-muted-foreground">Tomorrow, 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5" />
              <div>
                <p className="text-sm font-bold">C1 Placement Vocabulary</p>
                <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
