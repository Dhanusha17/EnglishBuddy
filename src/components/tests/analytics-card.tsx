"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight, BookOpen } from "lucide-react"

interface AnalyticsCardProps {
  strongAreas: string[]
  weakAreas: string[]
}

export function AnalyticsCard({ strongAreas, weakAreas }: AnalyticsCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-base">Performance Insights</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 space-y-6">
        
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ArrowUpRight className="h-3.5 w-3.5 text-green-500" /> Strong Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {strongAreas.map(area => (
              <span key={area} className="px-2.5 py-1 rounded-md bg-green-500/10 text-green-700 dark:text-green-400 text-xs font-medium border border-green-500/20">
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <ArrowDownRight className="h-3.5 w-3.5 text-destructive" /> Areas to Improve
          </h4>
          <div className="flex flex-wrap gap-2">
            {weakAreas.map(area => (
              <span key={area} className="px-2.5 py-1 rounded-md bg-destructive/10 text-destructive text-xs font-medium border border-destructive/20">
                {area}
              </span>
            ))}
          </div>
        </div>

        <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
          <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5 mb-2">
            <BookOpen className="h-3.5 w-3.5" /> Recommended Lesson
          </h4>
          <p className="text-sm font-medium mb-1">Review: Subject-Verb Agreement</p>
          <p className="text-xs text-muted-foreground">Based on your recent Grammar test errors.</p>
        </div>

      </CardContent>
    </Card>
  )
}
