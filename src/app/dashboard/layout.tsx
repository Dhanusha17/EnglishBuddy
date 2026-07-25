"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { usePathname, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  Bell, BookOpen, BrainCircuit, Briefcase, FileText, Globe2, 
  LayoutDashboard, LogOut, Menu, Moon, Search, Settings, 
  Sun, Trophy, Users, X, Activity, BookMarked, Brain,
  GraduationCap, Home, Target, HelpCircle, Layout, Sparkles, MessageSquare, Award, Shield
} from "lucide-react"
import { GlobalSearch } from "@/components/shared/GlobalSearch"
import { useTheme } from "next-themes"
import { useAppStore } from "@/store/useAppStore"
import { NotificationBell } from "@/components/notifications/NotificationBell"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"

const sidebarLinks = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Learning", href: "/dashboard/learning", icon: BookOpen },
  { name: "Practice", href: "/dashboard/practice", icon: Activity },
  { name: "Tests & Exams", href: "/dashboard/tests", icon: FileText },
  { name: "Placement Prep", href: "/dashboard/placement", icon: Briefcase },
  { name: "AI Hub", href: "/dashboard/ai", icon: BrainCircuit },
  { name: "Progress", href: "/dashboard/progress", icon: Trophy },
  { name: "Community", href: "/dashboard/community", icon: Users },
  { name: "Profile", href: "/dashboard/profile", icon: Settings }, // Profile usually has User/Settings icon
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { setTheme, theme } = useTheme()
  const { user, setUser } = useAppStore()

  useEffect(() => {
    if (searchParams.get("error") === "unauthorized") {
      toast.error("You do not have permission to access this page.", { id: "unauthorized" })
      // Optionally remove the query parameter so it doesn't stay in the URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete("error")
      window.history.replaceState({}, '', newUrl)
    }
  }, [searchParams])

  useEffect(() => {
    // Fetch user session when dashboard mounts
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me")
        if (res.ok) {
          const data = await res.json()
          setUser({
            name: data.name || "User",
            level: data.profile?.englishLevel || "A1",
            xp: data.profile?.currentXp || 0,
            coins: data.profile?.coins || 0,
            streak: data.profile?.currentStreak || 0,
            rank: data.profile?.englishLevel || "Beginner",
            role: data.role?.name || "student",
          })
        }
      } catch (err) {
        console.error("Failed to fetch user session", err)
      }
    }
    fetchUser()
  }, [setUser])

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/auth/login")
    } catch (e) {
      console.error("Logout failed", e)
    }
  }

  const renderSidebarContent = (isMobile = false) => (
    <>
      <div className={`flex h-16 items-center border-b ${isMobile ? 'px-6' : 'px-4 lg:px-6 justify-center lg:justify-start'}`}>
        <Link href="/dashboard" className="flex items-center gap-2" onClick={() => isMobile && setIsMobileMenuOpen(false)}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary">
            <Globe2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className={`font-bold tracking-tight text-lg ${isMobile ? 'block' : 'hidden lg:block'}`}>EnglishBuddy</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 py-4 overflow-hidden">
        <nav className={`space-y-1 ${isMobile ? 'px-4' : 'px-2 lg:px-4'}`}>
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => isMobile && setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg py-2.5 font-medium transition-all ${isMobile ? 'px-3 text-sm' : 'justify-center lg:justify-start px-0 lg:px-3 text-sm'} ${
                  isActive 
                    ? "bg-primary text-primary-foreground shadow-sm" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
                title={!isMobile ? link.name : undefined}
              >
                <link.icon className="h-5 w-5 shrink-0" />
                <span className={isMobile ? 'block' : 'hidden lg:block'}>{link.name}</span>
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
      <div className={`border-t ${isMobile ? 'p-4' : 'p-2 lg:p-4'} flex flex-col gap-1 overflow-hidden`}>
        {(user?.role === 'admin' || user?.role === 'super_admin') && (
          <Link
            href="/admin"
            className={`flex items-center gap-3 rounded-lg py-2.5 font-medium text-indigo-500 hover:bg-indigo-500/10 hover:text-indigo-600 transition-all ${isMobile ? 'px-3 text-sm' : 'justify-center lg:justify-start px-0 lg:px-3 text-sm'}`}
            title={!isMobile ? "Admin Panel" : undefined}
          >
            <Shield className="h-5 w-5 shrink-0" />
            <span className={isMobile ? 'block' : 'hidden lg:block'}>Admin Panel</span>
          </Link>
        )}
        <Link
          href="/dashboard/settings"
          className={`flex items-center gap-3 rounded-lg py-2.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all ${isMobile ? 'px-3 text-sm' : 'justify-center lg:justify-start px-0 lg:px-3 text-sm'}`}
          title={!isMobile ? "Settings" : undefined}
        >
          <Settings className="h-5 w-5 shrink-0" />
          <span className={isMobile ? 'block' : 'hidden lg:block'}>Settings</span>
        </Link>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 rounded-lg py-2.5 font-medium text-destructive hover:bg-destructive/10 transition-all ${isMobile ? 'px-3 text-sm' : 'justify-center lg:justify-start px-0 lg:px-3 text-sm'}`}
          title={!isMobile ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          <span className={isMobile ? 'block' : 'hidden lg:block'}>Logout</span>
        </button>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* Desktop & Tablet Sidebar */}
      <aside className="hidden md:flex flex-col bg-card border-r shadow-sm z-20 transition-all duration-300 w-16 lg:w-64">
        {renderSidebarContent(false)}
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
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.3 }}
              className="fixed inset-y-0 left-0 w-64 bg-card border-r shadow-xl z-50 flex flex-col lg:hidden"
            >
              {renderSidebarContent(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-16 bg-card border-b flex items-center justify-between px-4 sm:px-6 z-10">
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
              <GlobalSearch />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>

            <NotificationBell />

            <DropdownMenu>
              <DropdownMenuTrigger className="relative h-9 w-auto flex items-center gap-2 pl-2 pr-4 rounded-full border border-border/50 hover:bg-muted/50 cursor-pointer outline-none">
                  <Avatar className="h-7 w-7">
                    <AvatarImage src="/placeholder-user.jpg" alt="@user" />
                    <AvatarFallback className="bg-primary/20 text-primary text-xs">{(user?.name || 'User').split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start leading-none">
                    <span className="text-sm font-medium">{(user?.name || 'User').split(' ')[0]}</span>
                    <span className="text-[10px] text-muted-foreground font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block"></span> Level {(user?.level || 'A1').split(' ')[0]}
                    </span>
                  </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user?.name || 'User'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.name ? `${(user.name.split(' ')[0] || 'user').toLowerCase()}@example.com` : 'user@example.com'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem><Link href="/dashboard/profile" className="w-full cursor-pointer">Profile</Link></DropdownMenuItem>
                <DropdownMenuItem><Link href="/dashboard/settings" className="w-full cursor-pointer">Settings</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
