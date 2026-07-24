"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CommunityCardProps {
  id: string
  title: string
  description: string
  icon: React.ElementType
  metricLabel: string
  metricValue: string | number
  colorClass: string
}

export function CommunityCard({
  id, title, description, icon: Icon, metricLabel, metricValue, colorClass
}: CommunityCardProps) {
  
  return (
    <Card className="shadow-sm border border-transparent hover:border-primary/20 hover:shadow-md transition-all h-full flex flex-col group bg-card overflow-hidden relative">
      <CardContent className="p-6 flex-1 flex flex-col z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-glow ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="text-right">
            <span className="text-xl font-bold">{metricValue}</span>
            <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">{metricLabel}</p>
          </div>
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 flex-1">{description}</p>

        <Link href={`/dashboard/community/${id}`} className="block w-full mt-auto">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            Explore <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
      <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-[0.05] pointer-events-none ${colorClass}`} />
    </Card>
  )
}
