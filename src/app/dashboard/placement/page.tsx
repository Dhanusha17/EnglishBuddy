"use client"

import { useState, useEffect } from "react"
import { Building2, Code2, FileText, Target, ShieldCheck, ArrowRight, BrainCircuit, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export default function PlacementDashboard() {
  const [readiness, setReadiness] = useState({
    overallScore: 82,
    resumeScore: 85,
    aptitudeScore: 78,
    technicalScore: 90,
    hrScore: 75
  })

  // Placeholder for real fetch
  useEffect(() => {
    // In a real app, we'd fetch this from /api/placement/analytics
  }, [])

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Placement & Career Services</h1>
        <p className="text-muted-foreground mt-1">Prepare for your dream job with AI-powered resume building, mock interviews, and coding practice.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Readiness Score */}
        <div className="lg:col-span-1">
          <Card className="h-full bg-primary text-primary-foreground border-none">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
              <ShieldCheck className="h-12 w-12 mb-4 opacity-80" />
              <h3 className="text-lg font-medium opacity-90">Placement Readiness</h3>
              <div className="text-5xl font-bold mt-2 mb-4">{readiness.overallScore}%</div>
              <p className="text-sm opacity-80">You are in the top 15% of candidates. Focus on your HR interview skills to reach 90%+.</p>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Scores */}
        <div className="lg:col-span-3 grid sm:grid-cols-2 gap-4">
          <ScoreCard title="Resume Score" score={readiness.resumeScore} icon={FileText} href="/dashboard/placement/resume" />
          <ScoreCard title="Technical Score" score={readiness.technicalScore} icon={Code2} href="/dashboard/placement/coding" />
          <ScoreCard title="Aptitude Score" score={readiness.aptitudeScore} icon={BrainCircuit} href="#" />
          <ScoreCard title="HR Interview Score" score={readiness.hrScore} icon={Users} href="#" />
        </div>
      </div>

      <h2 className="text-2xl font-bold mt-12 mb-4">Preparation Modules</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ModuleCard 
          title="Resume Builder & AI Review"
          description="Build an ATS-friendly resume and get instant feedback from our AI evaluator."
          icon={FileText}
          href="/dashboard/placement/resume"
          action="Build Resume"
        />
        <ModuleCard 
          title="Coding Practice Platform"
          description="Practice data structures and algorithms in Python, Java, SQL, and C with AI evaluation."
          icon={Code2}
          href="/dashboard/placement/coding"
          action="Practice Coding"
        />
        <ModuleCard 
          title="Mock Interviews"
          description="Simulate real HR and Technical interviews using AI or peer matching."
          icon={Target}
          href="#"
          action="Start Interview"
          disabled={true}
        />
        <ModuleCard 
          title="Company Preparation"
          description="Access detailed hiring process breakdowns and past interview questions for top companies."
          icon={Building2}
          href="#"
          action="View Companies"
          disabled={true}
        />
        <ModuleCard 
          title="Aptitude & Logical Reasoning"
          description="Timed practice tests covering Quantitative Aptitude, Verbal Ability, and Logical Reasoning."
          icon={BrainCircuit}
          href="#"
          action="Practice Aptitude"
          disabled={true}
        />
      </div>

    </div>
  )
}

function ScoreCard({ title, score, icon: Icon, href }: any) {
  return (
    <Card>
      <CardContent className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-muted-foreground">{title}</h4>
            <div className="text-2xl font-bold">{score}%</div>
          </div>
        </div>
        {href !== "#" && (
          <Link href={href}>
            <Button variant="ghost" size="icon">
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}

function ModuleCard({ title, description, icon: Icon, href, action, disabled }: any) {
  return (
    <Card className={`flex flex-col \${disabled ? 'opacity-60 grayscale' : 'hover:shadow-md transition-shadow'}`}>
      <CardContent className="p-6 flex-1 flex flex-col">
        <Icon className="h-8 w-8 text-primary mb-4" />
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground flex-1">{description}</p>
        
        {disabled ? (
          <Button variant="secondary" className="w-full mt-6" disabled>Coming Soon</Button>
        ) : (
          <Link href={href} className="w-full mt-6">
            <Button className="w-full group">
              {action} <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
