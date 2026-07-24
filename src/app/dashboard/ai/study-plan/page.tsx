"use client";

import { useState } from "react";
import { Calendar, Loader2, Target, TrendingUp, AlertCircle } from "lucide-react";

export default function StudyPlannerPage() {
  const [currentLevel, setCurrentLevel] = useState("Intermediate (B1)");
  const [goal, setGoal] = useState("");
  const [weakTopics, setWeakTopics] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) {
      setError("Please specify your learning goal.");
      return;
    }
    
    setError("");
    setIsLoading(true);
    setResult(null);
    
    try {
      const res = await fetch("/api/ai/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentLevel,
          goal,
          weakTopics: weakTopics.split(",").map(s => s.trim()).filter(Boolean)
        })
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
      <div className="text-center">
        <div className="inline-flex items-center justify-center p-4 bg-rose-100 rounded-full mb-4">
          <Calendar className="text-rose-600 w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Planner</h1>
        <p className="text-gray-500 mt-2 max-w-xl mx-auto">
          Generate a personalized 4-week study plan based on your goals and weak areas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm h-fit">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Your Profile</h2>
          <form onSubmit={handleGenerate} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <TrendingUp size={16} className="text-rose-500" /> Current Level
              </label>
              <select
                value={currentLevel}
                onChange={(e) => setCurrentLevel(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                <option>Beginner (A1-A2)</option>
                <option>Intermediate (B1)</option>
                <option>Upper Intermediate (B2)</option>
                <option>Advanced (C1-C2)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Target size={16} className="text-rose-500" /> Goal
              </label>
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Crack a software engineering interview"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <AlertCircle size={16} className="text-rose-500" /> Weak Topics (comma separated)
              </label>
              <input
                type="text"
                value={weakTopics}
                onChange={(e) => setWeakTopics(e.target.value)}
                placeholder="e.g., grammar, speaking fluently"
                className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
            >
              {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Calendar size={20} />}
              {isLoading ? "Generating Plan..." : "Generate Plan"}
            </button>
          </form>
        </div>

        <div className="lg:col-span-2">
          {result ? (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
              {result.planDetails?.map((week: any, idx: number) => (
                <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-sm font-bold text-rose-600 uppercase tracking-wider mb-1">Week {week.week}</h3>
                      <h4 className="text-xl font-semibold text-gray-900 dark:text-white">{week.focus}</h4>
                    </div>
                  </div>
                  <ul className="space-y-3 mt-4">
                    {week.activities?.map((act: string, actIdx: number) => (
                      <li key={actIdx} className="flex gap-3 text-gray-700 dark:text-gray-300">
                        <span className="text-rose-500 font-bold mt-0.5">•</span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800">
              <Calendar size={64} className="mb-4 opacity-20" />
              <p className="text-lg text-center max-w-sm">Fill out your profile and click generate to create your custom 4-week study plan.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
