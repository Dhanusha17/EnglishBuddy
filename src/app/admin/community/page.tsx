"use client"

import { useEffect, useState } from "react"
import { Search, Plus, MoreHorizontal, Edit, Trash2 } from "lucide-react"
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

type CommunityPost = {
  id: string
  title: string
  category: string
  upvotes: number
  createdAt: string
  user: { name: string, email: string }
}

export default function CommunityManagementPage() {
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchPosts = async () => {
    try {
      const res = await fetch("/api/admin/community")
      if (res.ok) {
        const { data } = await res.json()
        setPosts(data)
      } else {
        toast.error("Failed to load community posts")
      }
    } catch (e) {
      toast.error("Error loading community posts")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchPosts()
    }
    run()
  }, [])

  const deletePost = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    try {
      const res = await fetch(`/api/admin/community/${id}`, {
        method: "DELETE",
      })
      if (res.ok) {
        toast.success("Post deleted successfully")
        fetchPosts()
      } else {
        toast.error("Failed to delete post")
      }
    } catch (e) {
      toast.error("Error deleting post")
    }
  }

  const filteredPosts = posts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.user.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Community Moderation</h2>
          <p className="text-sm text-slate-400">Moderate forum posts and community engagement.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search posts..." 
              className="pl-8 bg-slate-900 border-slate-700 text-slate-100"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="rounded-md border border-slate-800 bg-slate-900/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-800 hover:bg-transparent">
              <TableHead className="text-slate-400">Post Title</TableHead>
              <TableHead className="text-slate-400">Author</TableHead>
              <TableHead className="text-slate-400">Category</TableHead>
              <TableHead className="text-slate-400">Upvotes</TableHead>
              <TableHead className="text-right text-slate-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-slate-500">Loading posts...</TableCell>
              </TableRow>
            ) : filteredPosts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24 text-slate-500">No posts found.</TableCell>
              </TableRow>
            ) : (
              filteredPosts.map((post) => (
                <TableRow key={post.id} className="border-slate-800 hover:bg-slate-800/50">
                  <TableCell className="font-medium text-slate-200 truncate max-w-xs">{post.title}</TableCell>
                  <TableCell>
                    <div className="text-sm">{post.user?.name}</div>
                    <div className="text-xs text-slate-500">{post.user?.email}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="border-slate-700 text-slate-300">
                      {post.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-slate-400">{post.upvotes}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="h-8 w-8 p-0 flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-slate-900 border-slate-700 text-slate-200">
                        <DropdownMenuLabel>Moderation</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => deletePost(post.id)} className="text-red-500 hover:bg-slate-800 cursor-pointer font-medium">
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Post
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
