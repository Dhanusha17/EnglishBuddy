"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Users, BookOpen, FileText, BrainCircuit, Users2, 
  FileBox, ShieldAlert, LayoutDashboard, Settings, 
  Menu, Search, Bell, Shield, Medal, Database
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

const sidebarSections = [
  {
    title: "Core",
    links: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { name: "Users & Roles", href: "/admin/users", icon: Users },
      { name: "Analytics", href: "/admin/analytics", icon: Database },
    ]
  },
  {
    title: "Content Management",
    links: [
      { name: "Courses & Lessons", href: "/admin/courses", icon: BookOpen },
      { name: "Tests & Exams", href: "/admin/exams", icon: FileText },
      { name: "AI Prompts & Modes", href: "/admin/ai", icon: BrainCircuit },
      { name: "Resource Library", href: "/admin/resources", icon: FileBox },
    ]
  },
  {
    title: "Community & Engagement",
    links: [
      { name: "Forum Moderation", href: "/admin/community", icon: Users2 },
      { name: "Badges & Rewards", href: "/admin/badges", icon: Medal },
      { name: "Notifications", href: "/admin/notifications", icon: Bell },
    ]
  },
  {
    title: "System",
    links: [
      { name: "Platform Settings", href: "/admin/settings", icon: Settings },
      { name: "Activity Logs", href: "/admin/logs", icon: ShieldAlert },
    ]
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const SidebarContent = () => (
    <>
      <div className="flex h-16 items-center px-6 border-b border-border/10 bg-slate-900">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 text-white">
            <Shield className="h-5 w-5" />
          </div>
          <span className="font-bold tracking-tight text-lg text-slate-100">Admin Portal</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4 bg-slate-900">
        <div className="space-y-6 px-4">
          {sidebarSections.map((section) => (
            <div key={section.title}>
              <h4 className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                {section.title}
              </h4>
              <nav className="space-y-1">
                {section.links.map((link) => {
                  const isActive = pathname === link.href
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                        isActive 
                          ? "bg-indigo-500/10 text-indigo-400" 
                          : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </Link>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 border-t border-border/10 bg-slate-900">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            SA
          </div>
          <div className="flex flex-col text-sm">
            <span className="font-medium text-slate-200 leading-none">Super Admin</span>
            <span className="text-[10px] text-slate-500 mt-1">system@englishbuddy</span>
          </div>
        </div>
        <Link
          href="/dashboard"
          className="mt-4 flex items-center justify-center w-full rounded-lg px-3 py-2 text-xs font-medium text-slate-400 border border-slate-700 hover:bg-slate-800 transition-all"
        >
          Exit to Student App
        </Link>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-muted/30 overflow-hidden font-sans">
      
      {/* Desktop Sidebar (Dark Theme Forced for Admin) */}
      <aside className="hidden lg:flex w-64 flex-col border-r shadow-xl z-20 dark">
        {SidebarContent()}
      </aside>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 border-r shadow-2xl z-50 flex flex-col lg:hidden dark"
            >
              {SidebarContent()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* Admin Top Navigation */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 z-10 shadow-sm">
          <div className="flex items-center gap-4 flex-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden shrink-0"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            
            <div className="hidden sm:flex relative w-full max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Global Admin Search (Users, Courses, Logs)..."
                className="w-full bg-muted/50 pl-9 border-none focus-visible:ring-1 focus-visible:bg-background h-9 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-500 border-2 border-card" />
            </Button>
            <Button variant="outline" size="sm" className="hidden sm:flex h-9 border-dashed text-muted-foreground">
              v1.4.0-stable
            </Button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  )
}
