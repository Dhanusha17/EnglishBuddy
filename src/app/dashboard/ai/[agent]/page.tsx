"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Bot, Mic2, PenTool, BookOpen, Headphones, Settings2, MessageSquare, Briefcase, Users, Calendar, Map, MessageCircle, Clock, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

import { AIChatWindow } from "@/components/ai/ai-chat-window"
import { ConversationCard } from "@/components/ai/conversation-card"
import { WritingEditor } from "@/components/practice/writing-editor" // Reusing the practice one for now as placeholder

const agentsConfig: Record<string, any> = {
  tutor: { name: "AI English Tutor", icon: Bot, colorClass: "bg-blue-500", type: "chat", welcome: "Hello! I am your personal English tutor. Ask me anything about grammar, vocabulary, or culture." },
  speaking: { name: "AI Speaking Partner", icon: Mic2, colorClass: "bg-orange-500", type: "conversation", mode: "HR Interviewer", scenario: "You are applying for a Junior Developer role." },
  writing: { name: "AI Writing Coach", icon: PenTool, colorClass: "bg-purple-500", type: "writing" },
  reading: { name: "AI Reading Assistant", icon: BookOpen, colorClass: "bg-green-500", type: "chat", welcome: "Paste a paragraph here, and I'll summarize it, highlight complex words, or analyze the grammar for you." },
  listening: { name: "AI Listening Coach", icon: Headphones, colorClass: "bg-teal-500", type: "chat", welcome: "Upload an audio snippet, and I will generate dictation exercises and listening comprehension questions." },
  grammar: { name: "AI Grammar Teacher", icon: Settings2, colorClass: "bg-indigo-500", type: "chat", welcome: "Let's master English grammar! Tell me which topic you're struggling with (e.g., Tenses, Articles, Prepositions)." },
  vocabulary: { name: "AI Vocabulary Coach", icon: MessageSquare, colorClass: "bg-rose-500", type: "chat", welcome: "Want to learn new words? Ask me for synonyms, idioms, or try a quick vocabulary quiz!" },
  interview: { name: "AI Interview Coach", icon: Briefcase, colorClass: "bg-slate-700", type: "chat", welcome: "Welcome to your mock interview session. Are we practicing HR or Technical communication today?" },
  gd: { name: "AI Group Discussion Coach", icon: Users, colorClass: "bg-sky-500", type: "chat", welcome: "Give me a GD topic, and I'll provide you with opening suggestions, strong supporting points, and counter-arguments." },
  planner: { name: "AI Study Planner", icon: Calendar, colorClass: "bg-amber-500", type: "chat", welcome: "I can generate daily, weekly, or monthly study plans tailored to your goals. What are we preparing for?" },
  placement: { name: "AI Placement Mentor", icon: Map, colorClass: "bg-violet-500", type: "chat", welcome: "Let's strategize your career. Based on your progress, I can suggest areas to focus on for top tech placements." },
}

const mockHistory = [
  { id: "1", title: "Grammar: Present Perfect vs Simple Past", date: "Today" },
  { id: "2", title: "Mock Interview: Tell me about yourself", date: "Yesterday" },
  { id: "3", title: "Vocabulary: Corporate Jargon", date: "2 days ago" },
]

export default function AIAgentPage() {
  const params = useParams()
  const agentId = params.agent as string
  
  const config = agentsConfig[agentId] || agentsConfig.tutor
  const Icon = config.icon

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Link href="/dashboard/ai" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to AI Hub
        </Link>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        
        {/* Main Agent Area */}
        <div className="lg:col-span-3">
          {config.type === "chat" && (
            <AIChatWindow 
              agentName={config.name} 
              agentIcon={Icon} 
              colorClass={config.colorClass} 
              welcomeMessage={config.welcome}
            />
          )}
          
          {config.type === "conversation" && (
            <ConversationCard 
              mode={config.mode}
              scenario={config.scenario}
            />
          )}

          {config.type === "writing" && (
            <div className="h-[calc(100vh-12rem)] min-h-[500px]">
              <WritingEditor 
                title="AI Writing Assistant"
                prompt="Paste your email, essay, or resume here. I'll correct the grammar, suggest better vocabulary, and help adjust the tone."
                onProgress={() => {}}
              />
            </div>
          )}
        </div>

        {/* History Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-card border rounded-xl shadow-sm overflow-hidden h-[calc(100vh-12rem)] min-h-[500px] flex flex-col">
            <div className="p-4 border-b bg-muted/30">
              <h3 className="font-bold flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" /> Chat History
              </h3>
            </div>
            
            <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
              <div className="space-y-1">
                {mockHistory.map((item) => (
                  <div key={item.id} className="p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors group relative flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <MessageCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                      <p className="text-sm font-medium leading-tight line-clamp-2 pr-6">{item.title}</p>
                    </div>
                    <span className="text-[10px] text-muted-foreground ml-6">{item.date}</span>
                    
                    <Button variant="ghost" size="icon" className="h-6 w-6 absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="p-4 border-t bg-muted/10">
              <Button variant="outline" className="w-full text-xs" size="sm">Clear History</Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
