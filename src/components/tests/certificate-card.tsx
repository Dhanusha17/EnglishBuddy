"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CertificateCardProps {
  title: string
  level: string
  isUnlocked: boolean
  progress?: number // 0-100 if locked
}

export function CertificateCard({ title, level, isUnlocked, progress }: CertificateCardProps) {
  return (
    <Card className={`relative overflow-hidden shadow-sm transition-all hover:shadow-md ${isUnlocked ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent' : 'border-border bg-muted/30'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center ${isUnlocked ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
            {isUnlocked ? <Award className="h-6 w-6" /> : <Lock className="h-6 w-6" />}
          </div>
          <Badge variant={isUnlocked ? "default" : "secondary"}>{level}</Badge>
        </div>
        
        <h3 className={`font-bold mb-1 ${isUnlocked ? 'text-foreground' : 'text-muted-foreground'}`}>{title}</h3>
        <p className="text-xs text-muted-foreground mb-4">
          {isUnlocked ? "Official Certificate of Achievement" : "Complete level assessment to unlock"}
        </p>

        {isUnlocked ? (
          <Button variant="outline" size="sm" className="w-full text-primary border-primary/20 hover:bg-primary/10">
            View Certificate
          </Button>
        ) : (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
              <div className="h-full bg-muted-foreground/30 rounded-full" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
