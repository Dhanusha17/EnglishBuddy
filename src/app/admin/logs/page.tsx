"use client"

import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { toast } from "sonner"
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"

type AdminLog = {
  id: string
  adminId: string
  action: string
  details: string | null
  ipAddress: string | null
  createdAt: string
}

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<AdminLog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchLogs = async () => {
    try {
      const res = await fetch("/api/admin/logs")
      if (res.ok) {
        const { data } = await res.json()
        setLogs(data)
      } else {
        toast.error("Failed to load logs")
      }
    } catch (e) {
      toast.error("Error loading logs")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchLogs()
    }
    run()
  }, [])

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) ||
    (l.details && l.details.toLowerCase().includes(search.toLowerCase())) ||
    l.adminId.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Audit & Activity Logs</h2>
          <p className="text-sm text-slate-400">View recent administrative actions and system events.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search action or details..." 
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
              <TableHead className="text-slate-400">Date & Time</TableHead>
              <TableHead className="text-slate-400">Admin ID</TableHead>
              <TableHead className="text-slate-400">Action</TableHead>
              <TableHead className="text-slate-400">Details</TableHead>
              <TableHead className="text-slate-400">IP Address</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-slate-500">Loading logs...</TableCell>
              </TableRow>
            ) : filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-slate-500">No logs found.</TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((log) => (
                <TableRow key={log.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="text-sm text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-slate-400">{log.adminId}</TableCell>
                  <TableCell className="font-medium text-slate-200">{log.action}</TableCell>
                  <TableCell className="text-sm text-slate-300 truncate max-w-md">{log.details}</TableCell>
                  <TableCell className="font-mono text-xs text-slate-500">{log.ipAddress || "N/A"}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
