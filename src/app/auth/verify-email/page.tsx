"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle2, MailOpen } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function VerifyEmailPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-6 text-center"
    >
      <div className="flex justify-center">
        <div className="relative">
          <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center">
            <MailOpen className="h-10 w-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 h-6 w-6 bg-background rounded-full flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Verify your email</h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.
        </p>
      </div>
      
      <div className="pt-4 flex flex-col gap-3">
        <Link href="/onboarding" className="w-full">
          <Button className="w-full">
            Proceed to Profile Setup (Demo)
          </Button>
        </Link>
        <Button variant="outline" className="w-full">
          Resend verification email
        </Button>
      </div>
      
      <p className="px-8 text-center text-sm text-muted-foreground mt-4">
        Wrong email?{" "}
        <Link href="/auth/register" className="underline underline-offset-4 hover:text-primary">
          Change email address
        </Link>
      </p>
    </motion.div>
  )
}
