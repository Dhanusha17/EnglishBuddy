"use client"

import { useState, useEffect } from "react"
import { Play, CheckCircle2, XCircle, Clock, Code2, AlertCircle, ChevronRight, Terminal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function CodingPracticePage() {
  const [problems, setProblems] = useState<any[]>([])
  const [selectedProblem, setSelectedProblem] = useState<any>(null)
  
  const [code, setCode] = useState("")
  const [language, setLanguage] = useState("Python")
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetch("/api/placement/coding")
      .then(res => res.json())
      .then(data => setProblems(data))
  }, [])

  const handleSelect = (prob: any) => {
    setSelectedProblem(prob)
    setCode("")
    setResult(null)
    
    // Provide starter code based on language
    if (language === "Python") setCode("def solve(input):\n    # Write your code here\n    pass")
    if (language === "Java") setCode("class Solution {\n    public void solve() {\n        // Write your code here\n    }\n}")
    if (language === "JavaScript") setCode("function solve(input) {\n    // Write your code here\n}")
  }

  const submitCode = async () => {
    if (!selectedProblem || !code) return
    setIsEvaluating(true)
    setResult(null)

    try {
      const res = await fetch("/api/ai/code-evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId: selectedProblem.id, code, language })
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data.evaluation)
        
        // Update problem list status locally
        if (data.evaluation.status === "ACCEPTED") {
          setProblems(prev => prev.map(p => p.id === selectedProblem.id ? { ...p, isSolved: true } : p))
        }
      } else {
        toast.error("Evaluation failed")
      }
    } catch (e) {
      toast.error("Network error")
    }
    setIsEvaluating(false)
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Coding Practice</h1>
        <p className="text-muted-foreground mt-1">Hone your technical skills with our AI-powered coding evaluator.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        
        {/* Problem List */}
        <div className="lg:col-span-1 space-y-4">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <Code2 className="h-5 w-5" /> Problem Set
          </h2>
          <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
            {problems.map(prob => (
              <div 
                key={prob.id}
                onClick={() => handleSelect(prob)}
                className={`p-4 border rounded-xl cursor-pointer transition-colors \${selectedProblem?.id === prob.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50 bg-card'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{prob.title}</h3>
                  {prob.isSolved && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <div className="flex gap-2 text-xs">
                  <Badge variant={prob.difficulty === "EASY" ? "secondary" : prob.difficulty === "MEDIUM" ? "default" : "destructive"}>
                    {prob.difficulty}
                  </Badge>
                  <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{prob.category}</span>
                </div>
              </div>
            ))}
            {problems.length === 0 && (
              <div className="text-center p-8 text-muted-foreground border rounded-xl border-dashed">
                No problems available.
              </div>
            )}
          </div>
        </div>

        {/* Code Editor & Evaluator */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {!selectedProblem ? (
            <div className="flex-1 border rounded-xl border-dashed flex flex-col items-center justify-center text-muted-foreground p-12 text-center h-[500px]">
              <Terminal className="h-12 w-12 mb-4 opacity-20" />
              <p>Select a problem from the left to start coding.</p>
            </div>
          ) : (
            <>
              {/* Problem Description */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold">{selectedProblem.title}</h2>
                  </div>
                  <div className="prose prose-sm dark:prose-invert max-w-none mb-6">
                    <p className="whitespace-pre-wrap">{selectedProblem.description}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
                    <strong>Test Cases:</strong><br/>
                    <span className="text-muted-foreground whitespace-pre-wrap">{selectedProblem.testCases}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Editor */}
              <div className="border rounded-xl overflow-hidden bg-card flex flex-col">
                <div className="flex justify-between items-center bg-muted p-2 border-b">
                  <div className="flex gap-2">
                    {["Python", "Java", "JavaScript", "SQL", "C"].map(lang => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors \${language === lang ? 'bg-background shadow-sm' : 'hover:bg-background/50 text-muted-foreground'}`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                  <Button size="sm" onClick={submitCode} disabled={isEvaluating || !code}>
                    <Play className="h-4 w-4 mr-2" /> {isEvaluating ? "Evaluating..." : "Run Code"}
                  </Button>
                </div>
                <Textarea 
                  className="font-mono text-sm border-0 focus-visible:ring-0 rounded-none resize-y min-h-[300px] p-4 bg-zinc-950 text-zinc-50"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  spellCheck={false}
                />
              </div>

              {/* Execution Result */}
              {result && (
                <Card className={`border-2 \${result.status === 'ACCEPTED' ? 'border-green-500/50 bg-green-500/5' : 'border-red-500/50 bg-red-500/5'}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      {result.status === "ACCEPTED" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-500" />
                      )}
                      <h3 className={`text-lg font-bold \${result.status === 'ACCEPTED' ? 'text-green-500' : 'text-red-500'}`}>
                        {result.status === "ACCEPTED" ? "Accepted!" : "Wrong Answer / Error"}
                      </h3>
                      <div className="ml-auto flex items-center gap-1 text-sm text-muted-foreground font-mono bg-background px-3 py-1 rounded-full border">
                        <Clock className="h-3 w-3" /> {result.executionTimeMs} ms
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-1">Feedback</h4>
                        <p className="text-sm">{result.feedback}</p>
                      </div>
                      
                      {result.optimizations && result.optimizations.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-1">Optimization Tips</h4>
                          <ul className="space-y-1">
                            {result.optimizations.map((opt: string, i: number) => (
                              <li key={i} className="text-sm flex items-start gap-2">
                                <ChevronRight className="h-4 w-4 text-primary shrink-0" />
                                {opt}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  )
}
