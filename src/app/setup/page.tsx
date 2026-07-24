import { redirect } from "next/navigation"
import db from "@/lib/db"
import SetupForm from "./SetupForm"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "First Admin Setup - EnglishBuddy",
  description: "Configure the initial administrator account.",
}

export default async function SetupPage() {
  // Check if an admin already exists
  const existingAdmin = await db.user.findFirst({
    where: {
      role: {
        name: "admin",
      },
    },
  })

  // If an admin already exists, permanently disable this page by redirecting
  if (existingAdmin) {
    redirect("/auth/login")
  }

  return <SetupForm />
}
