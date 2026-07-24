"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Headphones, Mic, BookOpen, Target, Flame } from "lucide-react"
import { PracticeCard } from "@/components/practice/practice-card"
import { ChallengeCard } from "@/components/practice/challenge-card"
import { ProgressRing } from "@/components/practice/progress-ring"
import { SkillProgressCard } from "@/components/practice/skill-progress-card"

const skills = [
  { id: "listening", title: "Listening", icon: Headphones, color: "bg-blue-500", progress: 65, level: "B2", completed: 42, time: "15 mins", goal: "1 Audio", xp: 50 },
  { id: "speaking", title: "Speaking", icon: Mic, color: "bg-orange-500", progress: 40, level: "B1", completed: 28, time: "20 mins", goal: "1 Recording", xp: 80 },
  { id: "reading", title: "Reading", icon: BookOpen, color: "bg-green-500", progress: 85, level: "C1", completed: 76, time: "10 mins", goal: "1 Article", xp: 40 },
  { id: "writing", title: "Writing", icon: Target, color: "bg-purple-500", progress: 30, level: "A2", completed: 15, time: "25 mins", goal: "1 Essay", xp: 100 },
]

export default function PracticeHomePage() {
  return (
    <div className="grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
      
      {/* Main Practice Area */}
      <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Practice Hub</h1>
          <p className="text-muted-foreground text-lg">Master the four core pillars of English communication.</p>
        </div>

        {/* 4 Skill Cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {skills.map((skill, idx) => (
            <PracticeCard key={skill.id} {...skill} delay={idx * 0.1} />
          ))}
        </div>

        {/* Daily & Weekly Challenges */}
        <div className="grid md:grid-cols-2 gap-6">
          <ChallengeCard 
            type="daily"
            title="Daily Challenge"
            description="Complete 1 task for each skill"
            progress={0}
            total={4}
            xpReward={250}
          />
          <ChallengeCard 
            type="weekly"
            title="Weekly Challenge"
            description="5 exercises per skill this week"
            progress={12}
            total={20}
            xpReward={1000}
            timeLeft="Ends in 2 days"
          />
        </div>

      </div>

      {/* Right Progress Panel */}
      <div className="flex flex-col gap-6">
        
        {/* Overall Score */}
        <ProgressRing score={814} level="Advanced Communicator" percentile="Top 15% of learners" />

        {/* Breakdown */}
        <SkillProgressCard skills={[
          { label: "Listening", val: 65, color: "bg-blue-500" },
          { label: "Speaking", val: 40, color: "bg-orange-500" },
          { label: "Reading", val: 85, color: "bg-green-500" },
          { label: "Writing", val: 30, color: "bg-purple-500" },
        ]} />

        {/* Streak & Achievements Placeholder */}
        <Card className="shadow-sm border-none bg-card">
          <CardContent className="p-0 flex border-b divide-x">
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
              <Flame className="h-6 w-6 text-orange-500 mb-2" />
              <span className="text-xl font-bold">12 Days</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Streak</span>
            </div>
            <div className="flex-1 p-4 flex flex-col items-center justify-center text-center">
              <Target className="h-6 w-6 text-primary mb-2" />
              <span className="text-xl font-bold">45</span>
              <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Total Done</span>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}
