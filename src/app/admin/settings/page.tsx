"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    dailyStudyGoalMins: 30,
    emailNotifications: true,
    pushNotifications: true,
    theme: "system",
    isPublicProfile: true
  })

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      if (res.ok) {
        const { data } = await res.json()
        setSettings({
          dailyStudyGoalMins: data.dailyStudyGoalMins || 30,
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
          theme: data.theme || "system",
          isPublicProfile: data.isPublicProfile
        })
      }
    } catch (e) {
      toast.error("Failed to load settings")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const run = async () => {
      await fetchSettings()
    }
    run()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      })
      if (res.ok) {
        toast.success("Settings saved successfully")
      } else {
        toast.error("Failed to save settings")
      }
    } catch (e) {
      toast.error("An error occurred while saving")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-indigo-500" /></div>
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-100">Admin Preferences</h2>
        <p className="text-sm text-slate-400">Manage your administrative account settings and system preferences.</p>
      </div>

      <div className="grid gap-6">
        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">System Preferences</CardTitle>
            <CardDescription className="text-slate-400">Configure global dashboard behavior.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme" className="text-slate-300">Default Theme</Label>
              <Select value={settings.theme} onValueChange={(val) => setSettings({...settings, theme: val || ""})}>
                <SelectTrigger id="theme" className="bg-slate-950 border-slate-800 text-slate-200">
                  <SelectValue placeholder="Select a theme" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                  <SelectItem value="system">System Default</SelectItem>
                  <SelectItem value="light">Light Mode</SelectItem>
                  <SelectItem value="dark">Dark Mode</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal" className="text-slate-300">Daily Study Goal (Minutes)</Label>
              <Input 
                id="goal" 
                type="number"
                className="bg-slate-950 border-slate-800 text-slate-200"
                value={settings.dailyStudyGoalMins}
                onChange={(e) => setSettings({...settings, dailyStudyGoalMins: parseInt(e.target.value) || 0})}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Notifications</CardTitle>
            <CardDescription className="text-slate-400">Manage how you receive alerts.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Email Notifications</Label>
                <p className="text-xs text-slate-500">Receive administrative alerts via email.</p>
              </div>
              <Switch 
                checked={settings.emailNotifications} 
                onCheckedChange={(val) => setSettings({...settings, emailNotifications: val})} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Push Notifications</Label>
                <p className="text-xs text-slate-500">Receive alerts inside the dashboard.</p>
              </div>
              <Switch 
                checked={settings.pushNotifications} 
                onCheckedChange={(val) => setSettings({...settings, pushNotifications: val})} 
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900/50 border-slate-800">
          <CardHeader>
            <CardTitle className="text-slate-200">Privacy</CardTitle>
            <CardDescription className="text-slate-400">Manage your profile visibility.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-slate-300">Public Profile</Label>
                <p className="text-xs text-slate-500">Allow students to see your administrative profile.</p>
              </div>
              <Switch 
                checked={settings.isPublicProfile} 
                onCheckedChange={(val) => setSettings({...settings, isPublicProfile: val})} 
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
        <Button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700">
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </div>
  )
}
