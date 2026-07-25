"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Check, ChevronLeft, ChevronRight, Globe2 } from "lucide-react"
import Link from "next/link"

const levels = ["A0", "A1", "A2", "B1", "B2", "C1", "C2"]
const goals = [
  "Speak English Fluently",
  "Placement Preparation",
  "Interview Preparation",
  "Grammar",
  "Vocabulary",
  "Business English"
]
const studyTimes = ["15 Minutes", "30 Minutes", "1 Hour"]

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    country: "",
    nativeLanguage: "",
    level: "",
    goal: "",
    studyTime: "",
    reminder: ""
  })

  const updateForm = <K extends keyof typeof formData>(key: K, value: typeof formData[K]) => {
    setFormData(prev => ({ ...prev, [key]: value }))
  }

  const handleNext = () => setStep(s => Math.min(3, s + 1))
  const handlePrev = () => setStep(s => Math.max(1, s - 1))
  
  const handleFinish = () => {
    setIsLoading(true)
    setTimeout(() => {
      window.location.href = "/dashboard"
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-muted/30 flex flex-col">
      <header className="h-16 border-b bg-background flex items-center px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Globe2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">EnglishBuddy</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          {/* Progress Bar */}
          <div className="mb-8 flex items-center justify-between gap-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: step >= s ? "100%" : "0%" }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            ))}
          </div>

          <Card className="p-8 shadow-xl bg-background/50 backdrop-blur-xl border-border/50">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Set up your profile</h2>
                    <p className="text-muted-foreground">Let&apos;s get to know you better.</p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div className="relative h-24 w-24 rounded-full bg-secondary flex items-center justify-center group cursor-pointer border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors">
                      <Camera className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors" />
                      <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="text-xs text-white font-medium">Upload</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Full Name</Label>
                      <Input 
                        placeholder="Your full name" 
                        value={formData.fullName} 
                        onChange={(e) => updateForm('fullName', e.target.value)} 
                      />
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Country</Label>
                        <Select onValueChange={(v: string | null) => { if(v) updateForm('country', v) }}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Native Language</Label>
                        <Select onValueChange={(v: string | null) => v && updateForm('nativeLanguage', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="hi">Hindi</SelectItem>
                            <SelectItem value="ta">Tamil</SelectItem>
                            <SelectItem value="te">Telugu</SelectItem>
                            <SelectItem value="mr">Marathi</SelectItem>
                            <SelectItem value="bn">Bengali</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Your English goals</h2>
                    <p className="text-muted-foreground">This helps us personalize your lessons.</p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Current English Level</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:grid-cols-7 gap-2">
                      {levels.map(level => (
                        <div 
                          key={level}
                          onClick={() => updateForm('level', level)}
                          className={`flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all ${
                            formData.level === level 
                              ? 'bg-primary/10 border-primary text-primary font-medium shadow-sm' 
                              : 'hover:bg-muted bg-background text-muted-foreground'
                          }`}
                        >
                          {level}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Primary Learning Goal</Label>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {goals.map(goal => (
                        <div 
                          key={goal}
                          onClick={() => updateForm('goal', goal)}
                          className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                            formData.goal === goal 
                              ? 'bg-primary/10 border-primary shadow-sm' 
                              : 'hover:border-primary/50 bg-background'
                          }`}
                        >
                          <span className={formData.goal === goal ? 'font-medium text-foreground' : 'text-muted-foreground'}>
                            {goal}
                          </span>
                          {formData.goal === goal && <Check className="h-5 w-5 text-primary" />}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center space-y-2 mb-8">
                    <h2 className="text-3xl font-bold tracking-tight">Build a habit</h2>
                    <p className="text-muted-foreground">Consistency is key to mastering a language.</p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Daily Study Goal</Label>
                    <div className="grid sm:grid-cols-3 gap-4">
                      {studyTimes.map(time => (
                        <div 
                          key={time}
                          onClick={() => updateForm('studyTime', time)}
                          className={`flex flex-col items-center justify-center p-6 rounded-xl border cursor-pointer transition-all ${
                            formData.studyTime === time 
                              ? 'bg-primary text-primary-foreground shadow-lg scale-105 border-primary' 
                              : 'hover:border-primary/50 bg-background text-muted-foreground hover:bg-secondary'
                          }`}
                        >
                          <span className="font-bold text-lg">{time.split(" ")[0]}</span>
                          <span className="text-sm opacity-80">{time.split(" ")[1]}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base">Daily Reminder Time</Label>
                    <Input 
                      type="time" 
                      className="h-12 text-lg"
                      value={formData.reminder}
                      onChange={(e) => updateForm('reminder', e.target.value)}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between mt-10 pt-6 border-t">
              <Button 
                variant="ghost" 
                onClick={handlePrev} 
                disabled={step === 1 || isLoading}
                className="text-muted-foreground"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back
              </Button>

              {step < 3 ? (
                <Button onClick={handleNext} className="min-w-[120px]">
                  Continue
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  onClick={handleFinish} 
                  disabled={isLoading}
                  className="min-w-[200px] shadow-glow"
                >
                  {isLoading ? "Setting up..." : "Create My Learning Journey"}
                </Button>
              )}
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}
