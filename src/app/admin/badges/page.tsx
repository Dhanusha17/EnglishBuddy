"use client"

import { useEffect, useState } from "react"
import { Search, Plus, MoreHorizontal, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Badge = {
  id: string
  earnedAt: string
  user: { name: string }
  achievement: { title: string, description: string }
}

export default function BadgesManagementPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchBadges = async () => {
    try {
      const res = await fetch("/api/admin/badges")
      if (res.ok) {
        const { data } = await res.json()
        setBadges(data)
      } else {
        toast.error("Failed to load badges")
      }
    } catch (e) {
      toast.error("Error loading badges")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchBadges()
    }
    run()
  }, [])

  const deleteBadge = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this badge?")) return

    try {
      const res = await fetch(`/api/admin/badges/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Badge revoked successfully")
        fetchBadges()
      } else {
        toast.error("Failed to revoke badge")
      }
    } catch (e) {
      toast.error("Error revoking badge")
    }
  }

  const filteredBadges = badges.filter(b => 
    b.user?.name.toLowerCase().includes(search.toLowerCase()) ||
    b.achievement?.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Badges & Gamification</h2>
          <p className="text-sm text-slate-400">Manage user achievements and gamification rewards.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users or badges..." 
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
              <TableHead className="text-slate-400">User</TableHead>
              <TableHead className="text-slate-400">Achievement</TableHead>
              <TableHead className="text-slate-400">Date Earned</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-slate-500">Loading badges...</TableCell>
              </TableRow>
            ) : filteredBadges.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center h-24 text-slate-500">No badges found.</TableCell>
              </TableRow>
            ) : (
              filteredBadges.map((badge) => (
                <TableRow key={badge.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-200">{badge.user?.name}</TableCell>
                  <TableCell>
                    <div className="text-sm text-indigo-400 font-semibold">{badge.achievement?.title}</div>
                    <div className="text-xs text-slate-500">{badge.achievement?.description}</div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {new Date(badge.earnedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => deleteBadge(badge.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Revoke Badge
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
