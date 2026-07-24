"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

interface PerformanceData {
  skill: string
  accuracy: number
  color: string
}

interface PerformanceChartProps {
  data: PerformanceData[]
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="shadow-sm border-none bg-card h-full">
      <CardHeader className="pb-4 border-b">
        <CardTitle className="text-base">Accuracy Analytics</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-end justify-between h-48 gap-2">
          {data.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              <div className="text-xs font-bold mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {item.accuracy}%
              </div>
              <div className="w-full bg-muted rounded-t-sm relative flex items-end h-full">
                <div 
                  className={`w-full rounded-t-sm transition-all duration-1000 ${item.color}`}
                  style={{ height: `${item.accuracy}%` }}
                />
              </div>
              <div className="text-[10px] uppercase font-bold text-muted-foreground mt-2 rotate-45 origin-left truncate w-full text-center">
                {item.skill.substring(0, 3)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
