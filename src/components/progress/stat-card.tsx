"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ElementType
  trend?: {
    value: string | number
    isPositive: boolean
    label: string
  }
  colorClass: string
}

export function StatCard({ title, value, icon: Icon, trend, colorClass }: StatCardProps) {
  return (
    <Card className="shadow-sm border border-transparent hover:border-border transition-colors">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
            <h3 className="text-2xl font-bold">{value}</h3>
          </div>
          <div className={`h-10 w-10 rounded-lg flex items-center justify-center text-white shadow-sm ${colorClass}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>

        {trend && (
          <div className="mt-4 flex items-center text-sm">
            <span className={`flex items-center font-medium ${trend.isPositive ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
              {trend.isPositive ? <ArrowUpRight className="h-4 w-4 mr-1" /> : <ArrowDownRight className="h-4 w-4 mr-1" />}
              {trend.value}
            </span>
            <span className="text-muted-foreground ml-2">{trend.label}</span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
