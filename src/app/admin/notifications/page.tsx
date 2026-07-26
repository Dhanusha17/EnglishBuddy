"use client"

import { useEffect, useState } from "react"
import { Search, MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

type Notification = {
  id: string
  title: string
  message: string
  category: string
  isRead: boolean
  createdAt: string
  user: { name: string, email: string }
}

export default function NotificationsManagementPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/admin/notifications")
      if (res.ok) {
        const { data } = await res.json()
        setNotifications(data)
      } else {
        toast.error("Failed to load notifications")
      }
    } catch (e) {
      toast.error("Error loading notifications")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchNotifications()
    }
    run()
  }, [])

  const deleteNotification = async (id: string) => {
    if (!confirm("Are you sure you want to delete this notification?")) return

    try {
      const res = await fetch(`/api/admin/notifications/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Notification deleted")
        fetchNotifications()
      } else {
        toast.error("Failed to delete notification")
      }
    } catch (e) {
      toast.error("Error deleting notification")
    }
  }

  const filteredNotifications = notifications.filter(n => 
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.user?.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">System Notifications</h2>
          <p className="text-sm text-slate-400">View and manage notifications dispatched to users.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search title or user..." 
            className="pl-8 bg-slate-900 border-slate-700 text-slate-100"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Title</TableHead>
              <TableHead className="text-slate-400">User</TableHead>
              <TableHead className="text-slate-400">Category</TableHead>
              <TableHead className="text-slate-400">Read Status</TableHead>
              <TableHead className="text-slate-400">Date</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">Loading notifications...</TableCell>
              </TableRow>
            ) : filteredNotifications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-slate-500">No notifications found.</TableCell>
              </TableRow>
            ) : (
              filteredNotifications.map((notif) => (
                <TableRow key={notif.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell>
                    <div className="font-medium text-slate-200">{notif.title}</div>
                    <div className="text-xs text-slate-500 truncate max-w-xs">{notif.message}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">{notif.user?.name}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {notif.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {notif.isRead ? (
                      <Badge className="bg-slate-500/10 text-slate-400">Read</Badge>
                    ) : (
                      <Badge className="bg-blue-500/10 text-blue-400">Unread</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {new Date(notif.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => deleteNotification(notif.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
