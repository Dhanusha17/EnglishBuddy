"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Search, Filter, Plus, MoreHorizontal, 
  ChevronLeft, ChevronRight, Edit2, Trash2, Ban 
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface Column {
  key: string
  label: string
  type?: "text" | "badge" | "date"
}

interface DataTableProps {
  title: string
  columns: Column[]
  data: any[]
  onAdd?: () => void
}

export function DataTable({ title, columns, data, onAdd }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")
  
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchTerm(searchTerm), 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Basic mock filtering based on first column usually being the 'name' or 'title'
  const filteredData = data.filter(item => {
    if (!debouncedSearchTerm) return true
    const searchTarget = String(item[columns[0].key]).toLowerCase()
    return searchTarget.includes(debouncedSearchTerm.toLowerCase())
  })

  return (
    <Card className="shadow-sm border bg-card">
      <CardHeader className="pb-4 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
        <div className="flex items-center gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search..." 
              className="pl-9 h-9" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="h-9 hidden sm:flex"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
          {onAdd && (
            <Button size="sm" className="h-9" onClick={onAdd}><Plus className="mr-2 h-4 w-4" /> Create New</Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-3 font-medium rounded-tl-lg">
                  <input type="checkbox" className="rounded border-gray-300" />
                </th>
                {columns.map((col, idx) => (
                  <th key={idx} className="px-6 py-3 font-medium">{col.label}</th>
                ))}
                <th className="px-6 py-3 font-medium text-right rounded-tr-lg">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 2} className="px-6 py-8 text-center text-muted-foreground">
                    No records found matching your search.
                  </td>
                </tr>
              ) : (
                filteredData.map((row, rIdx) => (
                  <tr key={rIdx} className="border-b last:border-b-0 hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4">
                      <input type="checkbox" className="rounded border-gray-300" />
                    </td>
                    
                    {columns.map((col, cIdx) => (
                      <td key={cIdx} className="px-6 py-4 font-medium">
                        {col.type === "badge" ? (
                          <Badge variant={row[col.key] === "Active" || row[col.key] === "Published" ? "default" : "secondary"}>
                            {row[col.key]}
                          </Badge>
                        ) : (
                          row[col.key]
                        )}
                      </td>
                    ))}

                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem><Edit2 className="mr-2 h-4 w-4" /> Edit Record</DropdownMenuItem>
                          <DropdownMenuItem><Ban className="mr-2 h-4 w-4" /> Disable</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Footer */}
        <div className="border-t p-4 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 1 to {filteredData.length} of {filteredData.length} entries</span>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="icon" className="h-8 w-8 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="h-8 min-w-[32px] bg-primary text-primary-foreground">1</Button>
            <Button variant="outline" size="sm" className="h-8 min-w-[32px]">2</Button>
            <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

      </CardContent>
    </Card>
  )
}
