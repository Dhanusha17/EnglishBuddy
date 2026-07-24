"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

interface AdminKpiCardProps {
  title: string
  value: string | number
  change: string
  isPositive: boolean
  icon: React.ElementType
}

export function AdminKpiCard({ title, value, change, isPositive, icon: Icon }: AdminKpiCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold tracking-tight">{value}</h3>
          </div>
          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
            <Icon className="h-5 w-5" />
          </div>
        </div>

        <div className="mt-4 flex items-center text-sm">
          <span className={`flex items-center font-medium ${isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {change}
          </span>
          <span className="text-muted-foreground ml-2 text-xs">vs last month</span>
        </div>
      </CardContent>
    </Card>
  )
}
