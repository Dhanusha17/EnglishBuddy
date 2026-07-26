"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
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
    items: []
  },
  qa: {
    title: "Q&A Hub",
    icon: HelpCircle,
    colorClass: "bg-purple-500",
    description: "Get answers to your toughest questions from community experts.",
    actionButton: "Ask Question",
    items: []
  },
  groups: {
    title: "Study Groups",
    icon: Users,
    colorClass: "bg-orange-500",
    description: "Join dedicated groups to practice together and stay motivated.",
    actionButton: "Create Group",
    items: []
  },
  events: {
    title: "Events & Webinars",
    icon: Calendar,
    colorClass: "bg-teal-500",
    description: "Register for live mock interviews, resume clinics, and career talks.",
    items: []
  },
  resources: {
    title: "Resource Library",
    icon: FileBox,
    colorClass: "bg-emerald-500",
    description: "Download curated grammar PDFs, resume templates, and vocabulary lists.",
    items: []
  },
  success: {
    title: "Success Stories",
    icon: Star,
    colorClass: "bg-indigo-500",
    description: "Read inspiring stories from students who aced their placements.",
    items: []
  }
}

export default function CommunitySectionPage() {
  const params = useParams()
  const sectionId = params.section as string
  
  const config = sectionConfig[sectionId] || sectionConfig.forum
  const Icon = config.icon

  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/community/items?section=${sectionId}`)
      .then(res => res.json())
      .then(data => {
        setItems(data || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [sectionId])

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
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-muted-foreground">No items available yet.</p>
        ) : (
          items.map((item: any, idx: number) => {
            if (sectionId === "forum") return <DiscussionCard key={idx} {...item} />
            if (sectionId === "qa") return <QuestionCard key={idx} {...item} />
            if (sectionId === "groups") return <GroupCard key={idx} {...item} />
            if (sectionId === "events") return <EventCard key={idx} {...item} />
            if (sectionId === "resources") return <ResourceCard key={idx} {...item} />
            if (sectionId === "success") return <SuccessStoryCard key={idx} {...item} />
            return null
          })
        )}
      </div>
    </div>
  )
}
