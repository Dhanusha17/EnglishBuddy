"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, MessageSquare, HelpCircle, Users, Video, Calendar, FileBox, Star, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

import { DiscussionCard } from "@/components/community/discussion-card"
import { QuestionCard } from "@/components/community/question-card"
import { GroupCard } from "@/components/community/group-card"
import { EventCard } from "@/components/community/event-card"
import { ResourceCard } from "@/components/community/resource-card"
import { SuccessStoryCard } from "@/components/community/success-story-card"

// Mock Data Configurations
const sectionConfig: Record<string, any> = {
  forum: {
    title: "Discussion Forum",
    icon: MessageSquare,
    colorClass: "bg-blue-500",
    description: "Engage with the community, share tips, and discuss interview experiences.",
    actionButton: "Create Post",
    items: [
      { title: "Google Interview Experience - 2026 Batch", author: "RahulS", avatarInitials: "RS", timeAgo: "2 hours ago", category: "Interview Experiences", contentPreview: "Hey everyone, I just finished my Google technical interview rounds. Here's a breakdown of the questions asked...", upvotes: 142, replies: 34, isPinned: true },
      { title: "Can someone explain Conditionals (Type 3)?", author: "Priya99", avatarInitials: "PR", timeAgo: "5 hours ago", category: "Grammar", contentPreview: "I'm always getting confused between Type 2 and Type 3 conditionals. Does anyone have a simple trick to remember them?", upvotes: 24, replies: 8 }
    ]
  },
  qa: {
    title: "Q&A Hub",
    icon: HelpCircle,
    colorClass: "bg-purple-500",
    description: "Get answers to your toughest questions from community experts.",
    actionButton: "Ask Question",
    items: [
      { title: "What is the difference between 'affect' and 'effect'?", author: "StudentDev", timeAgo: "1 day ago", topic: "Vocabulary", upvotes: 45, answers: 3, hasBestAnswer: true },
      { title: "How to answer 'What is your greatest weakness?' in an HR interview?", author: "JobSeeker_26", timeAgo: "2 hours ago", topic: "Interview", upvotes: 89, answers: 12, hasBestAnswer: false }
    ]
  },
  groups: {
    title: "Study Groups",
    icon: Users,
    colorClass: "bg-orange-500",
    description: "Join dedicated groups to practice together and stay motivated.",
    actionButton: "Create Group",
    items: [
      { title: "TCS Ninja Prep Batch 1", description: "Dedicated group for students preparing for the upcoming TCS Ninja hiring process.", category: "Placement Prep", membersCount: 156, weeklyGoal: "Complete 2 Mock Tests", colorClass: "bg-indigo-500" },
      { title: "Advanced Speaking Club", description: "For B2/C1 level students looking to practice fluent, professional conversation.", category: "Speaking Practice", membersCount: 42, weeklyGoal: "2 Hours of Live Audio Practice", colorClass: "bg-rose-500" }
    ]
  },
  events: {
    title: "Events & Webinars",
    icon: Calendar,
    colorClass: "bg-teal-500",
    description: "Register for live mock interviews, resume clinics, and career talks.",
    items: [
      { title: "Resume Clinic: ATS Optimization Masterclass", date: "Aug 12, 06:00 PM", duration: "90 mins", speaker: "Sarah Jenkins (Ex-Google HR)", type: "Live Webinar" },
      { title: "Group Discussion Mock Session - Tech Topics", date: "Aug 15, 04:00 PM", duration: "60 mins", speaker: "Community Mentors", type: "Interactive Workshop" }
    ]
  },
  resources: {
    title: "Resource Library",
    icon: FileBox,
    colorClass: "bg-emerald-500",
    description: "Download curated grammar PDFs, resume templates, and vocabulary lists.",
    items: [
      { title: "100 Most Common Phrasal Verbs (Cheat Sheet)", category: "Vocabulary", fileType: "PDF", downloads: "4.2k" },
      { title: "Professional Tech Resume Template 2026", category: "Resume", fileType: "Template", downloads: "12.5k" },
      { title: "Business English Meeting Phrases", category: "Business English", fileType: "Audio", downloads: "1.8k" }
    ]
  },
  success: {
    title: "Success Stories",
    icon: Star,
    colorClass: "bg-indigo-500",
    description: "Read inspiring stories from students who aced their placements.",
    items: [
      { name: "Ananya Sharma", company: "Microsoft", story: "The AI Speaking Partner completely transformed my confidence. I used to freeze during HR rounds, but practicing the STAR method daily here helped me crack the Microsoft interview!", badge: "Interview Master" },
      { name: "Vikram Reddy", company: "Amazon", story: "The Grammar modules and peer practice rooms helped me clear the written and communication rounds easily. The community support was incredible.", badge: "Top Contributor" }
    ]
  }
}

export default function CommunitySectionPage() {
  const params = useParams()
  const sectionId = params.section as string
  
  const config = sectionConfig[sectionId] || sectionConfig.forum
  const Icon = config.icon

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Header Area */}
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/community" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors w-fit">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Community Hub
        </Link>
        
        <div className="bg-card border rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden relative">
          <div className="flex items-center gap-6 z-10">
            <div className={`h-16 w-16 md:h-20 md:w-20 rounded-2xl flex items-center justify-center text-white shadow-glow shrink-0 ${config.colorClass}`}>
              <Icon className="h-8 w-8 md:h-10 md:w-10" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">{config.title}</h1>
              <p className="text-muted-foreground max-w-xl text-sm md:text-base">{config.description}</p>
            </div>
          </div>
          
          <div className="z-10 flex gap-3 w-full md:w-auto mt-4 md:mt-0">
            <Button variant="outline" className="shadow-sm flex-1 md:flex-none bg-background">
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
            {config.actionButton && (
              <Button className="shadow-sm flex-1 md:flex-none">
                <Plus className="mr-2 h-4 w-4" /> {config.actionButton}
              </Button>
            )}
          </div>
          
          <div className={`absolute -right-10 -top-10 w-64 h-64 rounded-full blur-3xl opacity-10 ${config.colorClass}`} />
        </div>
      </div>

      {/* Dynamic Content Grid */}
      <div className={
        sectionId === "forum" || sectionId === "qa" ? "flex flex-col gap-4 max-w-4xl" : 
        sectionId === "success" ? "grid sm:grid-cols-2 gap-6" :
        "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
      }>
        {config.items.map((item: any, idx: number) => {
          if (sectionId === "forum") return <DiscussionCard key={idx} {...item} />
          if (sectionId === "qa") return <QuestionCard key={idx} {...item} />
          if (sectionId === "groups") return <GroupCard key={idx} {...item} />
          if (sectionId === "events") return <EventCard key={idx} {...item} />
          if (sectionId === "resources") return <ResourceCard key={idx} {...item} />
          if (sectionId === "success") return <SuccessStoryCard key={idx} {...item} />
          return null
        })}
      </div>
    </div>
  )
}
