"use client";

import { useState } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

export default function GrammarCheckerPage() {
  const [text, setText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    if (text.length < 10) {
      setError("Please enter at least a short sentence.");
      return;
    }
    setError("");
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/ai/grammar", {
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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
          <CheckCircle className="text-green-500" /> Grammar Checker
        </h1>
        <p className="text-gray-500 mt-2">Paste your text below to get instant grammar corrections and feedback.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-80 p-4 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none resize-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={handleCheck}
            disabled={isLoading || text.length === 0}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isLoading && <Loader2 className="animate-spin" size={20} />}
            {isLoading ? "Checking..." : "Check Grammar"}
          </button>
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 h-80 lg:h-auto overflow-y-auto shadow-sm">
          {result ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Results</h3>
                <div className="px-4 py-1 bg-green-100 text-green-700 rounded-full font-bold">
                  Score: {result.score}/100
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Corrected Text</h4>
                <div className="p-4 bg-green-50/50 dark:bg-green-900/10 rounded-lg text-gray-800 dark:text-gray-200 border border-green-100 dark:border-green-900">
                  {result.correctedText}
                </div>
              </div>

              {result.mistakes && result.mistakes.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500 mb-2">Mistakes Identified</h4>
                  <ul className="space-y-3">
                    {result.mistakes.map((m: any, idx: number) => (
                      <li key={idx} className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900 text-sm">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="line-through text-red-500">{m.original}</span>
                          <span className="text-green-600 font-medium">→ {m.correction}</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{m.explanation}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Overall Feedback</h4>
                <p className="text-gray-700 dark:text-gray-300">{result.explanation}</p>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <CheckCircle size={48} className="mb-4 opacity-20" />
              <p>Your results will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
