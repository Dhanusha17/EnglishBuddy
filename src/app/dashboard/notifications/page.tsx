"use client"

import { useState, useEffect } from "react"
import { Bell, Settings2, Trash2, Check, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [preferences, setPreferences] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const router = useRouter()





  useEffect(() => {
    let isMounted = true
    const fetchData = async () => {
      try {
        const [notifRes, prefRes] = await Promise.all([
          fetch("/api/notifications"),
          fetch("/api/users/preferences")
        ])
        if (isMounted) {
          if (notifRes.ok) {
            const notifData = await notifRes.json()
            setNotifications(notifData.data)
          }
          if (prefRes.ok) {
            const prefData = await prefRes.json()
            setPreferences(prefData)
          }
        }
      } catch (e) {
        console.error(e)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  const updatePreference = async (key: string, value: boolean) => {
    const updated = { ...preferences, [key]: value }
    setPreferences(updated)
    try {
      await fetch("/api/users/preferences", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: value })
      })
      toast.success("Preferences updated")
    } catch (e) {
      toast.error("Failed to update preferences")
    }
  }

  const markAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/\${id}/read`, { method: "PATCH" })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n))
    } catch (e) {
      console.error(e)
    }
  }

  const markAllRead = async () => {
    try {
      await fetch(`/api/notifications/read-all`, { method: "POST" })
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
      toast.success("All notifications marked as read")
    } catch (e) {
      console.error(e)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      await fetch(`/api/notifications/\${id}`, { method: "DELETE" })
      setNotifications(prev => prev.filter(n => n.id !== id))
    } catch (e) {
      console.error(e)
    }
  }

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) markAsRead(n.id);
    if (n.actionUrl) router.push(n.actionUrl);
  }

  const filtered = activeTab === "unread" 
    ? notifications.filter(n => !n.isRead)
    : activeTab === "announcements"
      ? notifications.filter(n => n.category === "ANNOUNCEMENT")
      : notifications

  return (
    <div className="p-6 max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
      
      {/* Left Column: Notifications */}
      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">Notification Center</h1>
            <p className="text-muted-foreground">Manage your alerts, announcements, and messages.</p>
          </div>
          <Button variant="outline" onClick={markAllRead}>
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        </div>

        <div className="flex gap-4 border-b pb-2">
          <button 
            className={`pb-2 px-1 border-b-2 transition-colors font-medium text-sm \${activeTab === 'all' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('all')}
          >
            All Updates
          </button>
          <button 
            className={`pb-2 px-1 border-b-2 transition-colors font-medium text-sm \${activeTab === 'unread' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('unread')}
          >
            Unread
          </button>
          <button 
            className={`pb-2 px-1 border-b-2 transition-colors font-medium text-sm \${activeTab === 'announcements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('announcements')}
          >
            Announcements
          </button>
        </div>

        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center p-12 border rounded-xl bg-card">
              <Bell className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
              <h3 className="text-lg font-medium">You're all caught up!</h3>
              <p className="text-muted-foreground">No notifications in this category.</p>
            </div>
          ) : (
            filtered.map(notification => (
              <div 
                key={notification.id} 
                className={`p-5 rounded-xl border flex gap-4 items-start transition-all cursor-pointer hover:shadow-md \${!notification.isRead ? 'bg-primary/5 border-primary/20' : 'bg-card'}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="mt-1">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center \${!notification.isRead ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    <Bell className="h-5 w-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h4 className="font-semibold">{notification.title}</h4>
                    <span className="text-xs text-muted-foreground">{new Date(notification.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{notification.message}</p>
                  
                  {notification.actionUrl && (
                    <div className="mt-3 flex items-center text-sm font-medium text-primary hover:underline">
                      View details <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  )}
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-muted-foreground hover:text-destructive shrink-0 z-10"
                  onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Column: Preferences */}
      <div className="w-full md:w-80 space-y-6">
        <div className="p-5 border rounded-xl bg-card space-y-6">
          <div className="flex items-center gap-2 border-b pb-4">
            <Settings2 className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg">Preferences</h3>
          </div>
          
          {preferences ? (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>In-App Alerts</Label>
                  <p className="text-xs text-muted-foreground">Receive live platform alerts</p>
                </div>
                <Switch 
                  checked={preferences.inAppNotifications} 
                  onCheckedChange={(v) => updatePreference('inAppNotifications', v)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Receive important alerts via email</p>
                </div>
                <Switch 
                  checked={preferences.emailNotifications} 
                  onCheckedChange={(v) => updatePreference('emailNotifications', v)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Daily Reminders</Label>
                  <p className="text-xs text-muted-foreground">Stay on track with daily learning goals</p>
                </div>
                <Switch 
                  checked={preferences.dailyReminders} 
                  onCheckedChange={(v) => updatePreference('dailyReminders', v)} 
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Weekly Reports</Label>
                  <p className="text-xs text-muted-foreground">Summary of your XP and progress</p>
                </div>
                <Switch 
                  checked={preferences.weeklyReports} 
                  onCheckedChange={(v) => updatePreference('weeklyReports', v)} 
                />
              </div>
            </div>
          ) : (
            <div className="animate-pulse space-y-4">
              {[1,2,3,4].map(i => <div key={i} className="h-10 bg-muted rounded"></div>)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
