"use client";

import { useState } from "react";
import { PenTool, Loader2 } from "lucide-react";

const ScoreBar = ({ label, score, color }: { label: string, score: number, color: string }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-sm font-medium">
      <span className="text-gray-700 dark:text-gray-300">{label}</span>
      <span className="text-gray-900 dark:text-white">{score}/100</span>
    </div>
    <div className="h-2 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
      <div className={`h-full \${color} transition-all duration-1000 ease-out`} style={{ width: `\${score}%` }} />
    </div>
  </div>
);

export default function WritingAssistantPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleEvaluate = async () => {
    if (text.length < 50) {
      setError("Please enter at least 50 characters to evaluate.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/ai/writing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || "An error occurred");
      }
    } catch (err) {
      setError("Network error occurred.");
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <div className="p-2 bg-orange-100 text-orange-600 rounded-xl"><PenTool size={24} /></div> Writing Assistant
        </h1>
        <p className="text-gray-500 mt-2">Get comprehensive feedback on your essays, emails, or creative writing.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4 flex flex-col h-[600px]">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Start writing or paste your document here (min 50 characters)..."
            className="flex-1 w-full p-6 border-2 border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:border-orange-500 focus:outline-none resize-none shadow-sm text-lg leading-relaxed"
          />
          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
          <button
            onClick={handleEvaluate}
            disabled={isLoading || text.length < 50}
            className="w-full py-4 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-lg transition-colors disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
          >
            {isLoading && <Loader2 className="animate-spin" size={24} />}
            {isLoading ? "Analyzing Text..." : "Evaluate Writing"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 h-[600px] overflow-y-auto shadow-sm">
          {result ? (
            <div className="space-y-8 animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Evaluation Results</h3>
              
              <div className="space-y-5">
                <ScoreBar label="Grammar & Mechanics" score={result.grammarScore} color="bg-green-500" />
                <ScoreBar label="Vocabulary Range" score={result.vocabularyScore} color="bg-purple-500" />
                <ScoreBar label="Clarity & Flow" score={result.clarityScore} color="bg-blue-500" />
                <ScoreBar label="Structure & Logic" score={result.structureScore} color="bg-orange-500" />
                <ScoreBar label="Tone & Professionalism" score={result.toneScore} color="bg-pink-500" />
              </div>

              {result.suggestions && result.suggestions.length > 0 && (
                <div className="mt-8">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    Key Suggestions
                  </h4>
                  <ul className="space-y-3">
                    {result.suggestions.map((s: string, idx: number) => (
                      <li key={idx} className="flex gap-3 text-gray-700 dark:text-gray-300 p-4 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900">
                        <span className="text-orange-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <PenTool size={64} className="mb-4 opacity-20" />
              <p className="text-lg text-center max-w-sm">Write or paste your text to get detailed metrics on clarity, structure, and vocabulary.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
