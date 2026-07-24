"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

interface AICardProps {
  id: string
  title: string
  description: string
  icon: React.ElementType
  colorClass: string
  isPremium?: boolean
}

export function AICard({
  id, title, description, icon: Icon, colorClass, isPremium
}: AICardProps) {
  
  return (
    <Card className="shadow-sm border border-transparent hover:border-primary/20 hover:shadow-md transition-all h-full flex flex-col group bg-card overflow-hidden relative">
      <CardContent className="p-6 flex-1 flex flex-col z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white shadow-glow ${colorClass}`}>
            <Icon className="h-6 w-6" />
          </div>
          {isPremium && (
            <div className="flex items-center text-xs font-bold bg-yellow-500/10 text-yellow-600 px-2 py-1 rounded-md border border-yellow-500/20">
              <Sparkles className="h-3 w-3 mr-1" /> Premium
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-sm text-muted-foreground mb-6 flex-1">{description}</p>

        <Link href={`/dashboard/ai/${id}`} className="block w-full mt-auto">
          <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">
            Launch Agent <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
      <div className={`absolute -right-12 -top-12 w-32 h-32 rounded-full blur-3xl opacity-[0.05] pointer-events-none ${colorClass}`} />
    </Card>
  )
}
