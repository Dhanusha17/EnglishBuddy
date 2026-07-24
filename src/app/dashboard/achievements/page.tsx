"use client";

import { useEffect, useState } from "react";
import { Loader2, Lock, Trophy } from "lucide-react";

export default function AchievementsPage() {
  const [badges, setBadges] = useState<any[]>([]);
  const [allAchievements, setAllAchievements] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Let's reuse the student analytics API because it returns the earned achievements!
    fetch("/api/student/analytics")
      .then(res => res.json())
      .then(d => {
        if (d.achievements) {
          setBadges(d.achievements);
        }
      })
      .catch(console.error);

    // Ideally, we'd fetch ALL achievements from a dedicated API to show locked ones.
    // For now, we can hardcode the list or fetch it if we create an API.
    // To make this robust, I'll fetch it from a new lightweight API route if it exists, or just show earned ones.
    // Let's create a quick API fetch for all achievements:
    fetch("/api/achievements")
      .then(res => res.json())
      .then(d => {
        setAllAchievements(d);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  const earnedIds = badges.map(b => b.id);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Achievement Gallery</h1>
          <p className="text-gray-500 mt-2">Unlock badges by completing courses, scoring high on quizzes, and using AI tools.</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-500 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <Trophy size={20} /> {badges.length} / {allAchievements.length} Unlocked
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {allAchievements.map(ach => {
          const isEarned = earnedIds.includes(ach.id);
          
          return (
            <div 
              key={ach.id} 
              className={`p-6 rounded-2xl border transition-all \${
                isEarned 
                  ? "bg-white dark:bg-gray-900 border-yellow-200 dark:border-yellow-900/50 shadow-md hover:shadow-lg" 
                  : "bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-70 grayscale"
              }`}
            >
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center text-3xl mb-4 \${isEarned ? "bg-yellow-100" : "bg-gray-200 dark:bg-gray-800"}`}>
                {isEarned ? "🏆" : <Lock size={24} className="text-gray-400" />}
              </div>
              <h3 className={`text-center font-bold text-lg mb-2 \${isEarned ? "text-gray-900 dark:text-white" : "text-gray-500"}`}>
                {ach.title}
              </h3>
              <p className="text-center text-sm text-gray-500">
                {ach.description}
              </p>
            </div>
          );
        })}
        {allAchievements.length === 0 && (
          <div className="col-span-full p-12 text-center text-gray-500">No achievements available in the database yet.</div>
        )}
      </div>
    </div>
  );
}
