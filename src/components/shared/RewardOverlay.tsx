"use client"

import { useEffect, useRef } from "react"
import { useAppStore } from "@/store/useAppStore"
import confetti from "canvas-confetti"
import { toast } from "sonner"

export function RewardOverlay() {
  const xp = useAppStore((state) => state.user.xp)
  const prevXpRef = useRef(xp)

  useEffect(() => {
    if (xp > prevXpRef.current) {
      const gained = xp - prevXpRef.current
      
      // Trigger confetti and toast
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.8 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b']
      })
      
      toast.success(`+${gained} XP Earned!`, {
        description: "Keep up the great work!",
        duration: 4000,
      })
    }
    prevXpRef.current = xp
  }, [xp])

  return null
}
