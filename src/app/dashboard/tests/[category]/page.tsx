"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowLeft, BookOpen, FileText } from "lucide-react"
import Link from "next/link"

import { ExamCard } from "@/components/tests/exam-card"
import { AnalyticsCard } from "@/components/tests/analytics-card"
import { PerformanceChart } from "@/components/tests/performance-chart"

const categoryConfig: any = {
  grammar: {
    title: "Grammar Tests",
    icon: BookOpen,
    color: "bg-blue-500",
    description: "Master English grammar from parts of speech to complex clauses.",
    strong: ["Articles", "Tenses", "Pronouns"],
    weak: ["Prepositions", "Subject-Verb Agreement", "Clauses"],
    levels: ["A0", "A1", "A2", "B1", "B2", "C1", "C2"],
    topics: [
      "Parts of Speech", "Articles", "Nouns", "Pronouns", "Verbs", "Tenses", 
      "Active & Passive Voice", "Direct & Indirect Speech", "Prepositions", 
      "Conjunctions", "Sentence Formation", "Subject-Verb Agreement", 
      "Punctuation", "Question Tags", "Modal Verbs", "Clauses"
    ]
  }
  // Other categories would follow a similar pattern
}

export default function TestCategoryPage() {
  const params = useParams()
  const categoryId = params.category as string
  const config = categoryConfig[categoryId] || categoryConfig.grammar
  const Icon = config.icon

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/tests" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Tests Dashboard
        </Link>
        
        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-6 z-10">
            <div className={`h-20 w-20 rounded-2xl flex items-center justify-center text-white shadow-glow shrink-0 ${config.color}`}>
              <Icon className="h-10 w-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight mb-2">{config.title}</h1>
              <p className="text-muted-foreground">{config.description}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto z-10">
            <Button className="shadow-soft" size="lg">Take Placement <FileText className="ml-2 h-5 w-5" /></Button>
          </div>
          
          <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-10 ${config.color}`} />
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left: Tests List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Level Assessments */}
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Level Assessments (A0 - C2)</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {config.levels.map((lvl: string, idx: number) => (
                <ExamCard 
                  key={`lvl-${idx}`}
                  id={`${categoryId}-level-${lvl}`}
                  title={`${lvl} ${config.title}`}
                  type="Assessment"
                  difficulty={idx < 2 ? "Beginner" : idx < 5 ? "Intermediate" : "Advanced"}
                  questions={20 + (idx * 5)}
                  timeLimit={30 + (idx * 5)}
                  xpReward={300 + (idx * 100)}
                  attempts={idx === 4 ? 1 : 0}
                  bestScore={idx === 4 ? 82 : undefined}
                  icon={Icon}
                  colorClass={config.color}
                />
              ))}
            </div>
          </div>

          {/* Topic Specific Exams */}
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Topic Specific Exams</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {config.topics.slice(0, 6).map((topic: string, idx: number) => (
                <ExamCard 
                  key={`topic-${idx}`}
                  id={`${categoryId}-topic-${idx}`}
                  title={topic}
                  type="Practice Test"
                  difficulty="Intermediate"
                  questions={15}
                  timeLimit={20}
                  xpReward={150}
                  attempts={0}
                  icon={Icon}
                  colorClass={config.color}
                />
              ))}
            </div>
          </div>

        </div>

        {/* Right: Analytics */}
        <div className="flex flex-col gap-6">
          <PerformanceChart 
            data={[
              { skill: "Nouns", accuracy: 95, color: "bg-green-500" },
              { skill: "Verbs", accuracy: 82, color: "bg-blue-500" },
              { skill: "Tenses", accuracy: 70, color: "bg-yellow-500" },
              { skill: "Prepositions", accuracy: 45, color: "bg-destructive" },
              { skill: "Clauses", accuracy: 55, color: "bg-orange-500" },
            ]}
          />

          <AnalyticsCard 
            strongAreas={config.strong}
            weakAreas={config.weak}
          />
        </div>

      </div>
    </div>
  )
}
