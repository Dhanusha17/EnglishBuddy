"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, BookOpen, BrainCircuit, Bell, Palette, Shield, Download, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { PreferenceCard } from "@/components/settings/preference-card"

export default function SettingsHubPage() {
  return (
    <div className="max-w-5xl mx-auto flex flex-col gap-8">
      
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg">Manage your account preferences, learning goals, and notifications.</p>
      </div>

      <Tabs defaultValue="account" className="flex flex-col md:flex-row gap-8">
        
        <div className="w-full md:w-64 shrink-0">
          <TabsList className="flex md:flex-col h-auto bg-transparent p-0 justify-start overflow-x-auto w-full custom-scrollbar">
            <TabsTrigger value="account" className="justify-start w-full px-4 py-3 data-[state=active]:bg-card border border-transparent data-[state=active]:border-border shadow-none data-[state=active]:shadow-sm rounded-lg"><User className="mr-3 h-4 w-4" /> Account</TabsTrigger>
            <TabsTrigger value="learning" className="justify-start w-full px-4 py-3 data-[state=active]:bg-card border border-transparent data-[state=active]:border-border shadow-none data-[state=active]:shadow-sm rounded-lg"><BookOpen className="mr-3 h-4 w-4" /> Learning Goals</TabsTrigger>
            <TabsTrigger value="ai" className="justify-start w-full px-4 py-3 data-[state=active]:bg-card border border-transparent data-[state=active]:border-border shadow-none data-[state=active]:shadow-sm rounded-lg"><BrainCircuit className="mr-3 h-4 w-4" /> AI Preferences</TabsTrigger>
            <TabsTrigger value="notifications" className="justify-start w-full px-4 py-3 data-[state=active]:bg-card border border-transparent data-[state=active]:border-border shadow-none data-[state=active]:shadow-sm rounded-lg"><Bell className="mr-3 h-4 w-4" /> Notifications</TabsTrigger>
            <TabsTrigger value="appearance" className="justify-start w-full px-4 py-3 data-[state=active]:bg-card border border-transparent data-[state=active]:border-border shadow-none data-[state=active]:shadow-sm rounded-lg"><Palette className="mr-3 h-4 w-4" /> Appearance</TabsTrigger>
            <TabsTrigger value="privacy" className="justify-start w-full px-4 py-3 data-[state=active]:bg-card border border-transparent data-[state=active]:border-border shadow-none data-[state=active]:shadow-sm rounded-lg"><Shield className="mr-3 h-4 w-4" /> Privacy & Data</TabsTrigger>
          </TabsList>
        </div>

        <div className="flex-1 min-w-0">
          
          <TabsContent value="account" className="mt-0 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Profile Information</h2>
              <div className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input defaultValue="Dhanusha" />
                </div>
                <div className="space-y-2">
                  <Label>Username</Label>
                  <Input defaultValue="@dhanusha_learns" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="dhanusha@example.com" disabled />
                </div>
                <Button className="mt-2">Save Changes</Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="learning" className="mt-0 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Study Preferences</h2>
              <div className="space-y-3">
                <PreferenceCard title="Auto-Resume Lessons" description="Automatically open the last viewed lesson upon login." defaultChecked={true} />
                <PreferenceCard title="Strict Daily Goals" description="Require completing all skills (L, S, R, W) to count streak." defaultChecked={false} />
                <PreferenceCard title="Placement Focused" description="Prioritize interview and technical lessons in recommendations." defaultChecked={true} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="mt-0 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Push & Email Alerts</h2>
              <div className="space-y-3">
                <PreferenceCard title="Daily Practice Reminder" description="Receive a reminder at your preferred study time." defaultChecked={true} />
                <PreferenceCard title="Weekly Progress Report" description="Receive a summary of your stats every Monday." defaultChecked={true} />
                <PreferenceCard title="Community Replies" description="Notify when someone replies to your forum post." defaultChecked={true} />
                <PreferenceCard title="Placement Alerts" description="Notify about upcoming mock interviews and events." defaultChecked={true} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="privacy" className="mt-0 space-y-6">
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4">Visibility & Data</h2>
              <div className="space-y-3 mb-6">
                <PreferenceCard title="Public Profile" description="Allow other learners to see your achievements and rank." defaultChecked={true} />
                <PreferenceCard title="Show Online Status" description="Show when you are active in practice rooms." defaultChecked={true} />
              </div>
              
              <Separator className="my-6" />
              
              <h3 className="text-lg font-bold mb-4">Account Actions</h3>
              <div className="flex flex-col gap-3 max-w-sm">
                <Button variant="outline" className="justify-between">
                  <span className="flex items-center"><Download className="mr-2 h-4 w-4" /> Export All Data</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Button>
                <Button variant="destructive" className="justify-between bg-destructive/10 text-destructive hover:bg-destructive hover:text-white border-transparent">
                  <span className="flex items-center"><Trash2 className="mr-2 h-4 w-4" /> Delete Account</span>
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Other tabs omitted for brevity, use same pattern */}
          <TabsContent value="appearance" className="mt-0">
             <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center justify-center h-48 text-muted-foreground border-dashed">
                Use the top navigation to toggle Light/Dark Mode. Advanced color theming placeholder.
             </div>
          </TabsContent>

          <TabsContent value="ai" className="mt-0">
             <div className="bg-card border rounded-xl p-6 shadow-sm flex items-center justify-center h-48 text-muted-foreground border-dashed">
                Configure AI personality and memory preferences placeholder.
             </div>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  )
}
