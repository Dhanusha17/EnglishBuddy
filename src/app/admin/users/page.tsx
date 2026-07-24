"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { MoreHorizontal, Search, ShieldAlert, CheckCircle, XCircle, Trash2, Edit } from "lucide-react"
import { toast } from "sonner"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

type User = {
  id: string
  name: string
  email: string
  role: { name: string }
  status: string
  createdAt: string
  loginHistories: { timestamp: string }[]
  profile: { currentXp: number } | null
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users")
      if (res.ok) {
        const { data } = await res.json()
        setUsers(data)
      } else {
        toast.error("Failed to load users")
      }
    } catch (e) {
      toast.error("Error loading users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchUsers()
    }
    run()
  }, [])

  const updateUser = async (id: string, updates: any) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      if (res.ok) {
        toast.success("User updated successfully")
        fetchUsers()
      } else {
        toast.error("Failed to update user")
      }
    } catch (e) {
      toast.error("Error updating user")
    }
  }

  const deleteUser = async (id: string) => {
    if (!confirm("Are you sure you want to delete this user permanently?")) return

    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("User deleted successfully")
        fetchUsers()
      } else {
        toast.error("Failed to delete user")
      }
    } catch (e) {
      toast.error("Error deleting user")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE": return <Badge className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
      case "PENDING": return <Badge className="bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Pending</Badge>
      case "REJECTED": return <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20">Rejected</Badge>
      case "SUSPENDED": return <Badge className="bg-orange-500/10 text-orange-500 hover:bg-orange-500/20">Suspended</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">User Management</h2>
          <p className="text-sm text-slate-400">View and manage all registered users.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
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
              <TableHead className="text-slate-400">Name / Email</TableHead>
              <TableHead className="text-slate-400">Role</TableHead>
              <TableHead className="text-slate-400">Status</TableHead>
              <TableHead className="text-slate-400">Registration Date</TableHead>
              <TableHead className="text-slate-400">Last Login</TableHead>
              <TableHead className="text-slate-400">Progress</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-slate-500">Loading users...</TableCell>
              </TableRow>
            ) : filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24 text-slate-500">No users found.</TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell>
                    <div className="font-medium text-slate-200">{user.name}</div>
                    <div className="text-xs text-slate-500">{user.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {user.role?.name || "student"}
                    </Badge>
                  </TableCell>
                  <TableCell>{getStatusBadge(user.status)}</TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {format(new Date(user.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {user.loginHistories?.[0] ? format(new Date(user.loginHistories[0].timestamp), "MMM d, HH:mm") : "Never"}
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">
                    {user.profile?.currentXp ? Math.min(100, Math.round(user.profile.currentXp / 100)) + "%" : "0%"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => alert("Profile View TBD")} className="hover:bg-slate-800 cursor-pointer">
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        {user.status !== "ACTIVE" && (
                          <DropdownMenuItem onClick={() => updateUser(user.id, { status: "ACTIVE" })} className="text-green-500 hover:bg-slate-800 cursor-pointer">
                            <CheckCircle className="mr-2 h-4 w-4" /> Approve & Activate
                          </DropdownMenuItem>
                        )}
                        
                        {user.status === "PENDING" && (
                          <DropdownMenuItem onClick={() => updateUser(user.id, { status: "REJECTED" })} className="text-red-500 hover:bg-slate-800 cursor-pointer">
                            <XCircle className="mr-2 h-4 w-4" /> Reject Registration
                          </DropdownMenuItem>
                        )}

                        {user.status === "ACTIVE" && (
                          <DropdownMenuItem onClick={() => updateUser(user.id, { status: "SUSPENDED" })} className="text-orange-500 hover:bg-slate-800 cursor-pointer">
                            <ShieldAlert className="mr-2 h-4 w-4" /> Suspend User
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        {user.role?.name === "student" ? (
                          <DropdownMenuItem onClick={() => updateUser(user.id, { role: "admin" })} className="hover:bg-slate-800 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Make Admin
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem onClick={() => updateUser(user.id, { role: "student" })} className="hover:bg-slate-800 cursor-pointer">
                            <Edit className="mr-2 h-4 w-4" /> Revoke Admin
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator className="bg-slate-700" />
                        
                        <DropdownMenuItem onClick={() => deleteUser(user.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete User
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
