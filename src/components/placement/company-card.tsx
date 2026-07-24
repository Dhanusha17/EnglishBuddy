"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, ArrowRight } from "lucide-react"
import Link from "next/link"

interface CompanyCardProps {
  id: string
  name: string
  industry: string
  hiringStages: number
  difficulty: "Medium" | "Hard" | "Very Hard"
  logoPlaceholderUrl?: string // For a real app, use Image
}

export function CompanyCard({ id, name, industry, hiringStages, difficulty }: CompanyCardProps) {
  
  // A simple deterministic color based on the name length for the placeholder logo
  const colors = ["bg-blue-500", "bg-purple-500", "bg-indigo-500", "bg-sky-500", "bg-rose-500", "bg-teal-500"]
  const colorClass = colors[name.length % colors.length]

  return (
    <Card className="shadow-sm border hover:border-primary/30 transition-all group overflow-hidden relative">
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`h-14 w-14 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-sm ${colorClass}`}>
            {name.substring(0, 1)}
          </div>
          <Badge variant={difficulty === "Very Hard" ? "destructive" : difficulty === "Hard" ? "default" : "secondary"}>
            {difficulty}
          </Badge>
        </div>
        
        <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{name}</h3>
        <p className="text-sm text-muted-foreground mb-4">{industry}</p>
        
        <div className="bg-muted/50 rounded-lg p-3 flex justify-between items-center mb-6 border">
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Hiring Stages</span>
          <span className="font-bold flex items-center gap-1">
            <Building2 className="h-4 w-4 text-primary" /> {hiringStages} Rounds
          </span>
        </div>

        <Link href={`/dashboard/placement/company/${id}`} className="block w-full">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            View Prep Guide <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
      <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-[0.05] pointer-events-none ${colorClass}`} />
    </Card>
  )
}
