import Link from "next/link";
import { 
  MessageSquare, 
  CheckCircle, 
  BookOpen, 
  PenTool, 
  Users, 
  Briefcase, 
  Calendar 
} from "lucide-react";

const aiModules = [
  { name: "AI Tutor Chat", href: "/dashboard/ai/chat", icon: MessageSquare, desc: "Ask questions and get instant help", color: "bg-blue-100 text-blue-600" },
  { name: "Grammar Checker", href: "/dashboard/ai/grammar", icon: CheckCircle, desc: "Fix and analyze your grammar", color: "bg-green-100 text-green-600" },
  { name: "Vocabulary Builder", href: "/dashboard/ai/vocabulary", icon: BookOpen, desc: "Learn new words deeply", color: "bg-purple-100 text-purple-600" },
  { name: "Writing Assistant", href: "/dashboard/ai/writing", icon: PenTool, desc: "Improve structure and clarity", color: "bg-orange-100 text-orange-600" },
  { name: "Interview Coach", href: "/dashboard/ai/interview", icon: Briefcase, desc: "Simulate real interviews", color: "bg-teal-100 text-teal-600" },
  { name: "Study Planner", href: "/dashboard/ai/study-plan", icon: Calendar, desc: "Generate a custom study plan", color: "bg-rose-100 text-rose-600" },
];

export default function AIHubPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">AI Learning Assistant</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Your personal AI suite for mastering English. Choose a module to begin.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {aiModules.map((mod) => (
          <Link key={mod.name} href={mod.href}>
            <div className="group relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500/50 hover:-translate-y-1">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl \${mod.color}`}>
                  <mod.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                    {mod.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{mod.desc}</p>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:animate-[shimmer_1.5s_infinite]" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
