"use client"

import { useParams } from "next/navigation"
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
    items: [
      { question: "Tell me about yourself.", explanation: "The most common opening question. Keep it professional and relevant to the job.", sampleAnswer: "I am a recent computer science graduate with a passion for web development. During my studies, I completed an internship where I built a full-stack application using React and Node.js...", tips: ["Keep it under 2 minutes", "Use Present-Past-Future formula", "Highlight relevant skills"], mistakes: ["Reciting your resume word-for-word", "Sharing too much personal information"], completed: true },
      { question: "Why should we hire you?", explanation: "This is your chance to align your skills with the job description.", sampleAnswer: "Based on what you've said and from the research I've done, your company is looking for an administrative assistant who has strong interpersonal skills and tech proficiency. My previous experience aligns perfectly with this...", tips: ["Show how you solve their problems", "Be confident, not arrogant", "Quantify your past achievements"], mistakes: ["Being too vague ('I am a hard worker')", "Comparing yourself negatively to others"], completed: false }
    ]
  },
  "gd": {
    title: "Group Discussion (GD)",
    icon: Users,
    color: "bg-orange-500",
    description: "Practice GD topics, learn etiquette, and master the art of making an impact in a group.",
    type: "gd",
    items: [
      { topic: "Is AI a threat to humanity?", category: "Technology", difficulty: "Medium", pointsFor: ["AI can lead to massive job displacement.", "Autonomous weapons pose existential risks.", "Deepfakes and misinformation."], pointsAgainst: ["AI creates new categories of jobs.", "It accelerates medical and scientific research.", "It handles dangerous and repetitive tasks."] },
      { topic: "Work from Home vs Office Work", category: "Corporate", difficulty: "Beginner", pointsFor: ["Better work-life balance.", "Saves commute time and costs.", "Access to global talent pool."], pointsAgainst: ["Lack of social interaction and team bonding.", "Blurred lines between work and personal life.", "Communication challenges."] }
    ]
  },
  "company-prep": {
    title: "Company-Specific Preparation",
    icon: Building2,
    color: "bg-violet-500",
    description: "Tailored preparation guides for top tech companies.",
    type: "company",
    items: [
      { id: "tcs", name: "TCS", industry: "IT Services", hiringStages: 4, difficulty: "Medium" },
      { id: "infosys", name: "Infosys", industry: "IT Services", hiringStages: 3, difficulty: "Medium" },
      { id: "google", name: "Google", industry: "Product / Tech", hiringStages: 5, difficulty: "Very Hard" },
      { id: "amazon", name: "Amazon", industry: "E-Commerce / Tech", hiringStages: 5, difficulty: "Hard" }
    ]
  },
  "resume": {
    title: "Resume & Cover Letter",
    icon: FileText,
    color: "bg-emerald-500",
    description: "Build an ATS-friendly resume that gets you shortlisted.",
    type: "resume",
    items: [
      { title: "Professional Summary", description: "How to write a compelling summary at the top of your resume.", tips: ["Keep it to 3-4 lines", "Mention your core expertise", "Include your career objective"], actionVerbs: ["Spearheaded", "Engineered", "Optimized", "Facilitated", "Orchestrated"] },
      { title: "Experience Section", description: "Highlighting your past work and internships.", tips: ["Use bullet points", "Follow XYZ formula (Accomplished X as measured by Y, by doing Z)", "Quantify results with numbers"], actionVerbs: ["Increased", "Decreased", "Generated", "Resolved", "Implemented"] }
    ]
  },
  "email": {
    title: "Email Writing",
    icon: Mail,
    color: "bg-teal-500",
    description: "Master professional email communication for the corporate world.",
    type: "email",
    items: [
      { title: "Interview Thank You Email", subject: "Thank You - [Your Name] - [Job Title] Interview", body: "Dear [Interviewer Name],\n\nThank you for taking the time to speak with me today about the [Job Title] position. It was great to learn more about the team and the upcoming projects.\n\nI remain very interested in the role and believe my skills in [Key Skill] would make me a valuable addition to your team.\n\nPlease let me know if you need any additional information from me.\n\nBest regards,\n[Your Name]", type: "Formal" },
      { title: "Sick Leave Request", subject: "Sick Leave Request - [Your Name]", body: "Hi [Manager Name],\n\nPlease accept this email as notification that I am unable to work today, [Date], due to sudden illness. I plan to be back online tomorrow, depending on how I feel.\n\nI have asked [Colleague Name] to cover any urgent tasks while I am away.\n\nThanks for understanding.\n\nBest,\n[Your Name]", type: "Formal" }
    ]
  }
}

export default function PlacementCategoryPage() {
  const params = useParams()
  const categoryId = params.category as string
  
  // Fallback to HR Interview if route not explicitly mocked
  const config = categoryConfig[categoryId] || categoryConfig["hr-interview"]
  const Icon = config.icon

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
        {config.items.map((item: any, idx: number) => {
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
        })}
      </div>
    </div>
  )
}
