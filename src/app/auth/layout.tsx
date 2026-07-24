import Link from "next/link"
import { Globe2 } from "lucide-react"
import db from "@/lib/db"
import { redirect } from "next/navigation"

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if an admin exists. If not, force redirect to first-time setup
  const existingAdmin = await db.user.findFirst({
    where: { role: { name: "admin" } }
  });

  if (!existingAdmin) {
    redirect("/setup");
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left side - Auth Form */}
      <div className="flex flex-col justify-center items-center p-8 sm:p-12">
        <div className="w-full max-w-sm space-y-6">
          <Link href="/" className="flex items-center gap-2 mb-8">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Globe2 className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight">EnglishBuddy</span>
          </Link>
          {children}
        </div>
      </div>
      
      {/* Right side - Illustration/Gradient */}
      <div className="hidden lg:flex flex-col justify-center items-center bg-primary/5 p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />
        <div className="relative z-10 text-center max-w-md space-y-6">
          <div className="inline-flex items-center justify-center rounded-2xl bg-white/50 backdrop-blur-xl p-4 shadow-xl border border-white/20 mb-8">
            <Globe2 className="w-24 h-24 text-primary" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight">Your journey to fluency starts here.</h2>
          <p className="text-muted-foreground text-lg">
            Join thousands of learners mastering English for their dream placements.
          </p>
        </div>
      </div>
    </div>
  )
}
