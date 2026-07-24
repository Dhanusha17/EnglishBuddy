"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface AnalyticsChartCardProps {
  title: string
  icon: React.ElementType
  data: any[]
  dataKey: string
  xAxisKey: string
  color: string
}

export function AnalyticsChartCard({ title, icon: Icon, data, dataKey, xAxisKey, color }: AnalyticsChartCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardHeader className="pb-2 border-b mb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Icon className="h-4 w-4" style={{ color }} /> {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[250px] w-full p-0 sm:p-6 sm:pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey={xAxisKey} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip 
              contentStyle={{ backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '8px' }}
              itemStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3} fillOpacity={1} fill={`url(#color-${dataKey})`} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
