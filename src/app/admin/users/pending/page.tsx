"use client"

import { useEffect, useState } from "react"
import { Users, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

type PendingUser = {
  id: string
  name: string
  email: string
  createdAt: string
  status: string
}

export default function PendingUsersPage() {
  const [users, setUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users/pending")
      if (res.ok) {
        const data = await res.json()
        setUsers(data.data || [])
      } else {
        toast.error("Failed to fetch pending users")
      }
    } catch (error) {
      toast.error("An error occurred while fetching users")
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



  const handleAction = async (userId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/admin/users/pending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action })
      })

      if (res.ok) {
        toast.success(`User successfully ${action === "APPROVE" ? "approved" : "rejected"}`)
        setUsers(users.filter(u => u.id !== userId))
      } else {
        const error = await res.json()
        toast.error(error.error || "Action failed")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    }
  }

  if (loading) {
    return <div className="p-8 flex justify-center">Loading pending users...</div>
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center gap-2">
          <Users className="h-8 w-8 text-primary" /> Pending Users
        </h1>
        <p className="text-muted-foreground">Review and approve new registration requests.</p>
      </div>

      <div className="bg-card border rounded-lg overflow-hidden">
        {users.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No pending users waiting for approval.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 font-medium">Name</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Registration Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Button 
                        size="sm" 
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleAction(user.id, "APPROVE")}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" /> Approve
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleAction(user.id, "REJECT")}
                      >
                        <XCircle className="h-4 w-4 mr-1" /> Reject
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
