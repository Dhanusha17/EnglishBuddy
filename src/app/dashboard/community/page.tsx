"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  MessageSquare, HelpCircle, Users, Video, Trophy, 
  Calendar, BellRing, FileBox, Star, Search, Flame, Target
} from "lucide-react"

import { CommunityCard } from "@/components/community/community-card"

const communityModules = [
  { id: "forum", title: "Discussion Forum", description: "Engage in grammar debates, share tips, and discuss interview experiences.", icon: MessageSquare, metricLabel: "Active Posts", metricValue: "2.4k", colorClass: "bg-blue-500" },
  { id: "qa", title: "Q&A Hub", description: "Get answers to your toughest English and placement questions from experts.", icon: HelpCircle, metricLabel: "Questions", metricValue: "850", colorClass: "bg-purple-500" },
  { id: "groups", title: "Study Groups", description: "Join dedicated groups for placement prep, advanced grammar, or vocabulary.", icon: Users, metricLabel: "Active Groups", metricValue: "45", colorClass: "bg-orange-500" },
  { id: "practice", title: "Peer Practice", description: "Jump into live audio/video rooms to practice speaking with other learners.", icon: Video, metricLabel: "Live Rooms", metricValue: "12", colorClass: "bg-rose-500" },
  { id: "leaderboard", title: "Leaderboards", description: "Check weekly XP rankings, top contributors, and streak champions.", icon: Trophy, metricLabel: "Your Rank", metricValue: "#42", colorClass: "bg-yellow-500" },
  { id: "events", title: "Events & Webinars", description: "Register for live mock interviews, resume clinics, and career talks.", icon: Calendar, metricLabel: "Upcoming", metricValue: "8", colorClass: "bg-teal-500" },
  { id: "announcements", title: "Announcements", description: "Stay updated on new platform features, weekly challenges, and server news.", icon: BellRing, metricLabel: "Unread", metricValue: "3", colorClass: "bg-sky-500" },
  { id: "resources", title: "Resource Library", description: "Download curated grammar PDFs, resume templates, and vocabulary lists.", icon: FileBox, metricLabel: "Resources", metricValue: "120+", colorClass: "bg-emerald-500" },
  { id: "success", title: "Success Stories", description: "Read inspiring stories from students who aced their placements.", icon: Star, metricLabel: "Stories", metricValue: "300+", colorClass: "bg-indigo-500" },
]

export default function CommunityDashboardPage() {
  return (
    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* Main Content Area */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Community & Resources</h1>
            <p className="text-muted-foreground text-lg">Connect, share, and grow with thousands of other learners.</p>
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search discussions, resources..." className="pl-9 h-10 bg-background shadow-sm" />
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {communityModules.map(mod => (
            <CommunityCard key={mod.id} {...mod} />
          ))}
        </div>

      </div>

      {/* Right Activity Panel */}
      <div className="flex flex-col gap-6">
        
        {/* Daily Community Challenge */}
        <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm overflow-hidden relative">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-primary">
              <Target className="h-5 w-5" /> Daily Community Challenge
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-2 relative z-10">
            <p className="text-sm font-medium mb-4">Answer 1 question in the Q&A Hub to help a fellow learner today.</p>
            <div className="flex justify-between items-center bg-background rounded-lg p-2 border text-sm font-bold">
              <span>Reward</span>
              <span className="text-yellow-500 flex items-center gap-1"><Star className="h-4 w-4" /> 200 XP</span>
            </div>
          </CardContent>
          <div className="absolute right-0 top-0 w-32 h-full bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        </Card>

        {/* Trending Topics */}
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" /> Trending Discussions
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="space-y-3">
              <div className="group cursor-pointer">
                <p className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">Google Interview Experience - 2026 Batch</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" /> 142 replies
                </p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">Can someone explain Conditionals (Type 3)?</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" /> 38 replies
                </p>
              </div>
              <div className="group cursor-pointer">
                <p className="text-sm font-bold group-hover:text-primary transition-colors leading-tight">Resume Review Thread - Post yours here!</p>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" /> 512 replies
                </p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-xs" size="sm">View All Discussions</Button>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-sm border-none bg-card">
          <CardHeader className="pb-4 border-b">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-500" /> Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-teal-500/10 text-teal-600 rounded-md p-2 text-center min-w-[50px] shrink-0 border border-teal-500/20">
                <p className="text-[10px] font-bold uppercase">Jul</p>
                <p className="text-lg font-black leading-none">25</p>
              </div>
              <div>
                <p className="text-sm font-bold leading-tight line-clamp-2 hover:text-primary cursor-pointer transition-colors">TCS NQT Preparation Masterclass</p>
                <p className="text-xs text-muted-foreground mt-1">10:00 AM • Live Webinar</p>
              </div>
            </div>
            <Button variant="secondary" className="w-full text-xs" size="sm">Register Now</Button>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
