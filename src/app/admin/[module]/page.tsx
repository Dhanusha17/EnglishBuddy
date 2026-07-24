"use client"

import { useParams } from "next/navigation"
import { DataTable } from "@/components/admin/data-table"

// Mock Schemas and Data for the CMS generator
const cmsConfig: Record<string, any> = {
  users: {
    title: "User Management",
    description: "Manage students, instructors, and admin accounts.",
    columns: [
      { key: "name", label: "Full Name", type: "text" },
      { key: "email", label: "Email Address", type: "text" },
      { key: "role", label: "Role", type: "badge" },
      { key: "status", label: "Status", type: "badge" },
      { key: "lastLogin", label: "Last Login", type: "text" },
    ],
    data: [
      { name: "Dhanusha", email: "dhanusha@example.com", role: "Student", status: "Active", lastLogin: "2 mins ago" },
      { name: "Rahul Sharma", email: "rahul@example.com", role: "Student", status: "Active", lastLogin: "1 hour ago" },
      { name: "Sarah Jenkins", email: "sarah@englishbuddy.com", role: "Instructor", status: "Active", lastLogin: "Yesterday" },
      { name: "Test User 4", email: "test4@example.com", role: "Student", status: "Suspended", lastLogin: "2 weeks ago" },
    ]
  },
  courses: {
    title: "Course & Lesson Management",
    description: "Create, edit, and arrange learning paths.",
    columns: [
      { key: "title", label: "Course Title", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "lessons", label: "Total Lessons", type: "text" },
      { key: "status", label: "Status", type: "badge" },
      { key: "updated", label: "Last Updated", type: "text" },
    ],
    data: [
      { title: "A1 Beginner English", category: "General", lessons: "45", status: "Published", updated: "Jul 15, 2026" },
      { title: "B2 Upper Intermediate", category: "General", lessons: "60", status: "Published", updated: "Jul 20, 2026" },
      { title: "Advanced Business English", category: "Specialized", lessons: "12", status: "Draft", updated: "Today" },
      { title: "Placement Interview Prep", category: "Placement", lessons: "24", status: "Published", updated: "Yesterday" },
    ]
  },
  exams: {
    title: "Exam & Assessment Management",
    description: "Configure tests, passing scores, and mock interviews.",
    columns: [
      { key: "title", label: "Exam Title", type: "text" },
      { key: "type", label: "Exam Type", type: "text" },
      { key: "questions", label: "Questions", type: "text" },
      { key: "passScore", label: "Passing Score", type: "text" },
      { key: "status", label: "Status", type: "badge" },
    ],
    data: [
      { title: "B2 Final Assessment", type: "Comprehensive", questions: "100", passScore: "75%", status: "Published" },
      { title: "TCS Ninja Mock Test", type: "Placement", questions: "40", passScore: "60%", status: "Published" },
      { title: "Conditionals Quiz", type: "Grammar", questions: "15", passScore: "80%", status: "Published" },
    ]
  },
  resources: {
    title: "Resource Library",
    description: "Upload and categorize PDFs, Audio, and Templates.",
    columns: [
      { key: "title", label: "Resource Name", type: "text" },
      { key: "type", label: "File Type", type: "text" },
      { key: "category", label: "Category", type: "text" },
      { key: "downloads", label: "Downloads", type: "text" },
      { key: "status", label: "Visibility", type: "badge" },
    ],
    data: [
      { title: "100 Phrasal Verbs", type: "PDF", category: "Vocabulary", downloads: "4.2k", status: "Published" },
      { title: "Business Meeting Audio", type: "MP3", category: "Listening", downloads: "1.1k", status: "Published" },
      { title: "Tech Resume 2026", type: "DOCX", category: "Placement", downloads: "12.5k", status: "Published" },
    ]
  }
}

export default function AdminDynamicModulePage() {
  const params = useParams()
  const moduleId = params.module as string
  
  // Default to a 404-like state if config doesn't exist, though we could redirect
  const config = cmsConfig[moduleId] || {
    title: `Module: ${moduleId}`,
    description: "This module is currently under construction or has no predefined mock schema.",
    columns: [{ key: "id", label: "ID" }, { key: "name", label: "Name" }],
    data: []
  }

  const handleAdd = () => {
    // In a real app, this would open a slide-out panel or modal with a form specific to the module
    alert(`Opening creation modal for ${moduleId}...`)
  }

  return (
    <div className="max-w-7xl mx-auto flex flex-col gap-6">
      
      <div className="mb-2">
        <h1 className="text-3xl font-bold tracking-tight mb-2">{config.title}</h1>
        <p className="text-muted-foreground">{config.description}</p>
      </div>

      <DataTable 
        title={`${config.title} Records`}
        columns={config.columns}
        data={config.data}
        onAdd={handleAdd}
      />

    </div>
  )
}
