"use client"

import { useState, useEffect } from "react"
import { Bell, Send, Megaphone, CheckCircle2, XCircle, Search, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"

export default function AdminCommunicationsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [emailQueue, setEmailQueue] = useState<any[]>([])
  const [formData, setFormData] = useState({ title: "", content: "", isPinned: false })
  const [activeTab, setActiveTab] = useState("announcements")
  const [loading, setLoading] = useState(false)

  const fetchAnnouncements = async () => {
    const res = await fetch("/api/admin/announcements")
    if (res.ok) setAnnouncements(await res.json())
  }

  const fetchEmailQueue = async () => {
    const res = await fetch("/api/admin/communications/logs")
    if (res.ok) setEmailQueue(await res.json())
  }

  useEffect(() => {
    const run = async () => {
      await fetchAnnouncements()
      await fetchEmailQueue()
    }
    run()
  }, [])



  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch("/api/admin/announcements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success("Announcement broadcasted successfully to all users")
        setFormData({ title: "", content: "", isPinned: false })
        fetchAnnouncements()
      } else {
        toast.error("Failed to broadcast announcement")
      }
    } catch (e) {
      toast.error("Network error")
    }
    setLoading(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communications Center</h1>
        <p className="text-muted-foreground mt-2">Manage global announcements and monitor the email delivery queue.</p>
      </div>

      <div className="flex gap-4 border-b pb-2">
        <button 
          className={`pb-2 px-2 border-b-2 font-medium text-sm transition-colors \${activeTab === 'announcements' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('announcements')}
        >
          Announcements
        </button>
        <button 
          className={`pb-2 px-2 border-b-2 font-medium text-sm transition-colors \${activeTab === 'emails' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
          onClick={() => setActiveTab('emails')}
        >
          Email Delivery Logs
        </button>
      </div>

      {activeTab === "announcements" && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Broadcaster */}
          <div className="border rounded-xl p-6 bg-card shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Megaphone className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">New Announcement</h2>
            </div>
            
            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-2">
                <Label>Announcement Title</Label>
                <Input 
                  placeholder="E.g., System Maintenance Tomorrow" 
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Message Content</Label>
                <Textarea 
                  placeholder="Type your message here..." 
                  rows={5}
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
                <div className="space-y-0.5">
                  <Label>Pin to Top</Label>
                  <p className="text-xs text-muted-foreground">Keep this announcement at the top of feeds.</p>
                </div>
                <Switch 
                  checked={formData.isPinned}
                  onCheckedChange={(v) => setFormData({...formData, isPinned: v})}
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Broadcasting..." : (
                  <>
                    <Send className="h-4 w-4 mr-2" /> Broadcast to All Users
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* History */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Bell className="h-5 w-5" /> Recent Announcements
            </h2>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <div className="p-8 text-center border rounded-xl bg-card text-muted-foreground">
                  No announcements yet.
                </div>
              ) : announcements.map(ann => (
                <div key={ann.id} className="p-4 border rounded-xl bg-card">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      {ann.isPinned && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Pinned</span>}
                      {ann.title}
                    </h3>
                    <span className="text-xs text-muted-foreground">{new Date(ann.createdAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{ann.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "emails" && (
        <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
          <div className="p-4 border-b bg-muted/20 flex justify-between items-center">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" /> Outbound Email Queue
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                <tr>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Recipient</th>
                  <th className="px-6 py-3">Subject / Template</th>
                  <th className="px-6 py-3">Sent At</th>
                </tr>
              </thead>
              <tbody>
                {emailQueue.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-muted-foreground">
                      No emails queued or sent recently.
                    </td>
                  </tr>
                ) : emailQueue.map(email => (
                  <tr key={email.id} className="border-b last:border-0 hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4">
                      {email.status === "SENT" ? (
                        <span className="flex items-center text-green-600 bg-green-50 px-2 py-1 rounded-full w-max text-xs font-medium">
                          <CheckCircle2 className="h-3 w-3 mr-1" /> Sent
                        </span>
                      ) : email.status === "FAILED" ? (
                        <span className="flex items-center text-red-600 bg-red-50 px-2 py-1 rounded-full w-max text-xs font-medium">
                          <XCircle className="h-3 w-3 mr-1" /> Failed
                        </span>
                      ) : (
                        <span className="flex items-center text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full w-max text-xs font-medium">
                          <span className="h-2 w-2 bg-yellow-600 rounded-full mr-2 animate-pulse" /> Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{email.user?.name || "Unknown"}</div>
                      <div className="text-xs text-muted-foreground">{email.user?.email || "Unknown Email"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{email.subject}</div>
                      <div className="text-xs text-muted-foreground font-mono mt-0.5">{email.template}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {email.sentAt ? new Date(email.sentAt).toLocaleString() : "---"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
