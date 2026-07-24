"use client"

import { useState, useEffect } from "react"
import { Save, Download, FileText, Wand2, Plus, Trash2, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"

export default function ResumeBuilderPage() {
  const [resumeId, setResumeId] = useState<string | null>(null)
  const [title, setTitle] = useState("My Software Engineer Resume")
  
  const [personalInfo, setPersonalInfo] = useState({ name: "", email: "", phone: "", linkedin: "", summary: "" })
  const [experience, setExperience] = useState([{ id: 1, title: "", company: "", duration: "", description: "" }])
  const [education, setEducation] = useState([{ id: 1, degree: "", institution: "", year: "", score: "" }])
  const [skills, setSkills] = useState("")
  const [projects, setProjects] = useState([{ id: 1, title: "", description: "" }])

  const [aiReview, setAiReview] = useState<any>(null)
  const [isReviewing, setIsReviewing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Load first resume if exists
    fetch("/api/placement/resume")
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          const res = data[0]
          setResumeId(res.id)
          setTitle(res.title)
          if (res.versions && res.versions.length > 0) {
            const content = JSON.parse(res.versions[0].content)
            if (content.personalInfo) setPersonalInfo(content.personalInfo)
            if (content.experience) setExperience(content.experience)
            if (content.education) setEducation(content.education)
            if (content.skills) setSkills(content.skills.join(", "))
            if (content.projects) setProjects(content.projects)
          }
          if (res.reviews && res.reviews.length > 0) {
            setAiReview(JSON.parse(res.reviews[0].feedback))
          }
        }
      })
  }, [])

  const handleSave = async () => {
    setIsSaving(true)
    const content = {
      personalInfo,
      experience,
      education,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
      projects
    }

    try {
      let res
      if (resumeId) {
        res = await fetch(`/api/placement/resume/\${resumeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        })
      } else {
        res = await fetch(`/api/placement/resume`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content })
        })
        const data = await res.json()
        setResumeId(data.id)
      }
      
      if (res.ok) toast.success("Resume saved successfully!")
      else toast.error("Failed to save resume.")
    } catch (e) {
      toast.error("Network error")
    }
    setIsSaving(false)
  }

  const handleAIReview = async () => {
    if (!resumeId) {
      toast.error("Please save your resume first.")
      return
    }
    setIsReviewing(true)
    const content = { personalInfo, experience, education, skills: skills.split(",").map(s => s.trim()).filter(Boolean), projects }
    
    try {
      const res = await fetch(`/api/ai/resume-review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId, resumeData: content })
      })
      if (res.ok) {
        const data = await res.json()
        setAiReview(data.review)
        toast.success("AI Review completed!")
      } else {
        toast.error("Failed to generate AI review")
      }
    } catch (e) {
      toast.error("Network error")
    }
    setIsReviewing(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resume Builder</h1>
          <p className="text-muted-foreground mt-1">Create an ATS-friendly resume and evaluate it with Gemini AI.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleSave} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" /> {isSaving ? "Saving..." : "Save Draft"}
          </Button>
          <Button variant="secondary" onClick={handleAIReview} disabled={isReviewing}>
            <Wand2 className="h-4 w-4 mr-2" /> {isReviewing ? "Analyzing..." : "AI Review"}
          </Button>
          {resumeId && (
            <a href={`/api/placement/resume/\${resumeId}/download`} target="_blank" rel="noreferrer">
              <Button>
                <Download className="h-4 w-4 mr-2" /> Download PDF
              </Button>
            </a>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Builder Form */}
        <div className="lg:col-span-2 space-y-8">
          
          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" /> Personal Information
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={personalInfo.name} onChange={e => setPersonalInfo({...personalInfo, name: e.target.value})} placeholder="John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={personalInfo.email} onChange={e => setPersonalInfo({...personalInfo, email: e.target.value})} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone</Label>
                  <Input value={personalInfo.phone} onChange={e => setPersonalInfo({...personalInfo, phone: e.target.value})} placeholder="+1 234 567 890" />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn / Portfolio</Label>
                  <Input value={personalInfo.linkedin} onChange={e => setPersonalInfo({...personalInfo, linkedin: e.target.value})} placeholder="linkedin.com/in/johndoe" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label>Professional Summary</Label>
                  <Textarea value={personalInfo.summary} onChange={e => setPersonalInfo({...personalInfo, summary: e.target.value})} placeholder="A highly motivated software engineer..." rows={3} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Experience</h2>
              {experience.map((exp, index) => (
                <div key={exp.id} className="p-4 border rounded-xl space-y-4 bg-muted/20 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => setExperience(experience.filter(e => e.id !== exp.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Job Title</Label>
                      <Input value={exp.title} onChange={e => { const newExp = [...experience]; newExp[index].title = e.target.value; setExperience(newExp); }} placeholder="Software Engineer Intern" />
                    </div>
                    <div className="space-y-2">
                      <Label>Company</Label>
                      <Input value={exp.company} onChange={e => { const newExp = [...experience]; newExp[index].company = e.target.value; setExperience(newExp); }} placeholder="Google" />
                    </div>
                    <div className="space-y-2">
                      <Label>Duration</Label>
                      <Input value={exp.duration} onChange={e => { const newExp = [...experience]; newExp[index].duration = e.target.value; setExperience(newExp); }} placeholder="May 2023 - Aug 2023" />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <Label>Description</Label>
                      <Textarea value={exp.description} onChange={e => { const newExp = [...experience]; newExp[index].description = e.target.value; setExperience(newExp); }} placeholder="Developed a REST API..." rows={2} />
                    </div>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed" onClick={() => setExperience([...experience, { id: Date.now(), title: "", company: "", duration: "", description: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Experience
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Education</h2>
              {education.map((edu, index) => (
                <div key={edu.id} className="grid md:grid-cols-2 gap-4 p-4 border rounded-xl bg-muted/20 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => setEducation(education.filter(e => e.id !== edu.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-2">
                    <Label>Degree</Label>
                    <Input value={edu.degree} onChange={e => { const newEdu = [...education]; newEdu[index].degree = e.target.value; setEducation(newEdu); }} placeholder="B.Tech Computer Science" />
                  </div>
                  <div className="space-y-2">
                    <Label>Institution</Label>
                    <Input value={edu.institution} onChange={e => { const newEdu = [...education]; newEdu[index].institution = e.target.value; setEducation(newEdu); }} placeholder="MIT" />
                  </div>
                  <div className="space-y-2">
                    <Label>Year / Expected</Label>
                    <Input value={edu.year} onChange={e => { const newEdu = [...education]; newEdu[index].year = e.target.value; setEducation(newEdu); }} placeholder="2020 - 2024" />
                  </div>
                  <div className="space-y-2">
                    <Label>Score (CGPA/%)</Label>
                    <Input value={edu.score} onChange={e => { const newEdu = [...education]; newEdu[index].score = e.target.value; setEducation(newEdu); }} placeholder="3.8 / 4.0" />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed" onClick={() => setEducation([...education, { id: Date.now(), degree: "", institution: "", year: "", score: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Education
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Skills</h2>
              <div className="space-y-2">
                <Label>Comma separated skills</Label>
                <Textarea value={skills} onChange={e => setSkills(e.target.value)} placeholder="JavaScript, React, Node.js, Python, SQL" rows={3} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <h2 className="text-xl font-semibold">Projects</h2>
              {projects.map((proj, index) => (
                <div key={proj.id} className="grid gap-4 p-4 border rounded-xl bg-muted/20 relative">
                  <Button variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:text-destructive" onClick={() => setProjects(projects.filter(p => p.id !== proj.id))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="space-y-2 w-[calc(100%-2rem)]">
                    <Label>Project Title</Label>
                    <Input value={proj.title} onChange={e => { const newP = [...projects]; newP[index].title = e.target.value; setProjects(newP); }} placeholder="E-commerce Web App" />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea value={proj.description} onChange={e => { const newP = [...projects]; newP[index].description = e.target.value; setProjects(newP); }} placeholder="Built a fullstack app using Next.js..." rows={2} />
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed" onClick={() => setProjects([...projects, { id: Date.now(), title: "", description: "" }])}>
                <Plus className="h-4 w-4 mr-2" /> Add Project
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Right Sidebar: AI Review */}
        <div className="space-y-6">
          <div className="sticky top-6">
            <Card className="bg-primary/5 border-primary/20 overflow-hidden">
              <div className="bg-primary p-4 text-primary-foreground">
                <h3 className="font-semibold flex items-center gap-2">
                  <Wand2 className="h-5 w-5" /> Gemini AI Resume Review
                </h3>
              </div>
              <CardContent className="p-6">
                {!aiReview ? (
                  <div className="text-center space-y-4 py-8">
                    <div className="h-16 w-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto text-primary animate-pulse">
                      <Wand2 className="h-8 w-8" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Click the <strong>AI Review</strong> button to evaluate your resume for ATS compatibility and get improvement suggestions.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col items-center justify-center p-6 bg-card rounded-xl border shadow-sm">
                      <span className="text-sm text-muted-foreground font-medium uppercase tracking-wider mb-2">ATS Score</span>
                      <div className="relative">
                        <svg className="w-24 h-24 transform -rotate-90">
                          <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted" />
                          <circle cx="48" cy="48" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" 
                            strokeDasharray="226.19" 
                            strokeDashoffset={226.19 - (226.19 * aiReview.score) / 100}
                            className={aiReview.score > 80 ? "text-green-500" : aiReview.score > 60 ? "text-yellow-500" : "text-red-500"} 
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-3xl font-bold">{aiReview.score}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Grammar & Tone</h4>
                      <p className="text-sm">{aiReview.grammar}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Missing Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {aiReview.missingKeywords?.map((k: string, i: number) => (
                          <span key={i} className="px-2 py-1 bg-destructive/10 text-destructive text-xs rounded font-medium">{k}</span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Improvement Suggestions</h4>
                      <ul className="space-y-2">
                        {aiReview.improvementSuggestions?.map((tip: string, i: number) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

      </div>
    </div>
  )
}
