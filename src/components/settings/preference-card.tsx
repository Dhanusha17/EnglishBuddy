"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

interface PreferenceCardProps {
  title: string
  description: string
  defaultChecked?: boolean
}

export function PreferenceCard({ title, description, defaultChecked = false }: PreferenceCardProps) {
  return (
    <Card className="shadow-sm border-none bg-card">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div>
          <Label className="text-sm font-bold block mb-1">{title}</Label>
          <p className="text-xs text-muted-foreground leading-tight">{description}</p>
        </div>
        <Switch defaultChecked={defaultChecked} />
      </CardContent>
    </Card>
  )
}
