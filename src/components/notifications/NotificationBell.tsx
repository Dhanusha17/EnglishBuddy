"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const router = useRouter()

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications")
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.data)
        setUnreadCount(data.unreadCount)
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    let isMounted = true
    const getNotifications = async () => {
      try {
        const res = await fetch("/api/notifications")
        if (res.ok) {
          const data = await res.json()
          if (isMounted) {
            setNotifications(data.data)
            setUnreadCount(data.unreadCount)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    
    getNotifications()
    const interval = setInterval(getNotifications, 30000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])



  const markAsRead = async (id: string, actionUrl?: string) => {
    try {
      await fetch(`/api/notifications/\${id}/read`, { method: "PATCH" })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
      setUnreadCount(prev => Math.max(0, prev - 1))
      
      if (actionUrl) {
        router.push(actionUrl)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const markAllRead = async () => {
    try {
      await fetch(`/api/notifications/read-all`, { method: "POST" })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      setUnreadCount(0)
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative h-9 w-9 flex items-center justify-center rounded-md hover:bg-muted/50 cursor-pointer outline-none">
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive border-2 border-card animate-pulse" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 border-border shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h4 className="font-semibold text-sm">Notifications</h4>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" className="h-8 text-xs px-2" onClick={markAllRead}>
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>
        
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 text-center text-muted-foreground p-4">
              <Bell className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-sm">No new notifications</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 border-b last:border-0 cursor-pointer transition-colors hover:bg-muted/50 \${!notification.isRead ? 'bg-primary/5' : ''}`}
                  onClick={() => markAsRead(notification.id, notification.actionUrl)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm flex items-center gap-2">
                      {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary" />}
                      {notification.title}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {notification.message}
                  </p>
                  <span className="text-[10px] text-muted-foreground/60 block mt-2 font-medium uppercase tracking-wider">
                    {new Date(notification.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        
        <div className="p-2 border-t">
          <Link href="/dashboard/notifications" passHref>
            <Button variant="outline" className="w-full text-xs h-8">
              View All Notifications
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
