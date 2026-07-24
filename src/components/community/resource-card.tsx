"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, Bookmark, FileAudio, FileVideo, FileCode } from "lucide-react"

interface ResourceCardProps {
  title: string
  category: string
  fileType: "PDF" | "Audio" | "Video" | "Template"
  downloads: string
}

export function ResourceCard({ title, category, fileType, downloads }: ResourceCardProps) {
  
  const getIcon = () => {
    switch (fileType) {
      case "PDF": return <FileText className="h-8 w-8 text-rose-500" />
      case "Audio": return <FileAudio className="h-8 w-8 text-teal-500" />
      case "Video": return <FileVideo className="h-8 w-8 text-indigo-500" />
      case "Template": return <FileCode className="h-8 w-8 text-amber-500" />
      default: return <FileText className="h-8 w-8" />
    }
  }

  return (
    <Card className="shadow-sm border hover:shadow-md transition-all group overflow-hidden bg-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="h-16 w-16 bg-muted/50 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
            {getIcon()}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground"><Bookmark className="h-4 w-4" /></Button>
        </div>
        
        <Badge variant="secondary" className="mb-3">{category}</Badge>
        <h3 className="text-lg font-bold mb-2 line-clamp-2 leading-tight">{title}</h3>
        <p className="text-xs text-muted-foreground mb-6 font-medium uppercase tracking-wider">{fileType} • {downloads} Downloads</p>
        
        <Button variant="secondary" className="w-full bg-primary/5 hover:bg-primary hover:text-primary-foreground text-primary transition-colors">
          <Download className="mr-2 h-4 w-4" /> Download File
        </Button>
      </CardContent>
    </Card>
  )
}
