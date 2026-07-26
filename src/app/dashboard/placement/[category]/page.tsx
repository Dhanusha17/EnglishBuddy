"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, Users, Building2, FileText, Mail } from "lucide-react"
import Link from "next/link"

import { InterviewQuestionCard } from "@/components/placement/interview-question-card"
import { GDTopicCard } from "@/components/placement/gd-topic-card"
import { CompanyCard } from "@/components/placement/company-card"
import { ResumeCard } from "@/components/placement/resume-card"
import { EmailTemplateCard } from "@/components/placement/email-template-card"

// Mock Data configurations
const categoryConfig: any = {
  "hr-interview": {
    title: "HR Interview Preparation",
    icon: Briefcase,
    color: "bg-purple-500",
    description: "Master the most common HR interview questions with expert tips and sample answers.",
    type: "interview",
    items: []
  },
  "gd": {
    title: "Group Discussion (GD)",
    icon: Users,
    color: "bg-orange-500",
    description: "Practice GD topics, learn etiquette, and master the art of making an impact in a group.",
    type: "gd",
    items: []
  },
  "company-prep": {
    title: "Company-Specific Preparation",
    icon: Building2,
    color: "bg-violet-500",
    description: "Tailored preparation guides for top tech companies.",
    type: "company",
    items: []
  },
  "resume": {
    title: "Resume & Cover Letter",
    icon: FileText,
    color: "bg-emerald-500",
    description: "Build an ATS-friendly resume that gets you shortlisted.",
    type: "resume",
    items: []
  },
  "email": {
    title: "Email Writing",
    icon: Mail,
    color: "bg-teal-500",
    description: "Master professional email communication for the corporate world.",
    type: "email",
    items: []
  }
}

export default function PlacementCategoryPage() {
  const params = useParams()
  const categoryId = params.category as string
  
  const config = categoryConfig[categoryId] || categoryConfig["hr-interview"]
  const Icon = config.icon

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/placement/items?type=${config.type}`)
      .then(res => res.json())
      .then(data => {
        setItems(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [config.type])

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/placement" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Placement Dashboard
        </Link>
        
        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-6 z-10">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-glow shrink-0 ${config.color}`}>
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{config.title}</h1>
              <p className="text-muted-foreground max-w-xl">{config.description}</p>
            </div>
          </div>
          
          <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-10 ${config.color}`} />
        </div>
      </div>

      {/* Dynamic Content Rendering */}
      <div className={config.type === "company" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"}>
        {loading ? (
          <p className="text-muted-foreground">Loading items...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No items available yet.</p>
        ) : (
          items.map((item: any, idx: number) => {
            if (config.type === "interview") {
              return <InterviewQuestionCard key={idx} {...item} />
            }
            if (config.type === "gd") {
              return <GDTopicCard key={idx} {...item} />
            }
            if (config.type === "company") {
              return <CompanyCard key={idx} {...item} />
            }
            if (config.type === "resume") {
              return <ResumeCard key={idx} {...item} />
            }
            if (config.type === "email") {
              return <EmailTemplateCard key={idx} {...item} />
            }
            return null
          })
        )}
      </div>
    </div>
  )
}
