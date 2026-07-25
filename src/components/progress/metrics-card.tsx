"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { TrendingUp, TrendingDown } from "lucide-react"

export interface MetricsCardProps {
  title?: string
  description?: string
  metrics: {
    label: string
    value: string
    change: string
    positive: boolean
  }[]
}

export function MetricsCard({ title, description, metrics }: MetricsCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      {(title || description) && (
        <CardHeader className="pb-4 border-b">
          {title && <CardTitle className="text-base">{title}</CardTitle>}
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </CardHeader>
      )}
      <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="space-y-1">
            <p className="text-xs text-muted-foreground font-medium">{m.label}</p>
            <p className="text-2xl font-bold">{m.value}</p>
            {m.change && (
              <p className={`text-xs flex items-center ${m.positive ? 'text-green-500' : 'text-red-500'}`}>
                {m.positive ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {m.change}
              </p>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
