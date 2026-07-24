"use client";

import { useEffect, useState } from "react";
import { Loader2, TrendingUp, BookOpen, Star, Flame, Trophy, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Link from "next/link";

export default function StudentDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/analytics")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setIsLoading(false);
      })
      .catch(console.error);
  }, []);

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-100px)] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600 w-12 h-12" />
      </div>
    );
  }

  if (data?.error) {
    return <div className="p-8 text-red-500">Error loading dashboard: {data.error}</div>;
  }

  const progressPercent = Math.min(100, Math.round((data.currentXp / data.nextLevelXp) * 100));

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & XP Progress */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <div className="w-32 h-32 rounded-full border-4 border-blue-500 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 shrink-0">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-bold uppercase tracking-widest">Level</div>
            <div className="text-5xl font-black text-gray-900 dark:text-white">{data.level}</div>
          </div>
        </div>
        <div className="flex-1 w-full space-y-4">
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Progress</h1>
              <p className="text-gray-500 font-medium">{data.currentXp} / {data.nextLevelXp} XP to Level {data.level + 1}</p>
            </div>
            <div className="flex items-center gap-2 text-orange-500 font-bold bg-orange-50 dark:bg-orange-900/20 px-4 py-2 rounded-full">
              <Flame fill="currentColor" /> {data.streak} Day Streak
            </div>
          </div>
          <div className="h-4 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out" style={{ width: `\${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <BookOpen className="text-blue-500 mb-4 w-8 h-8" />
          <div className="text-4xl font-black text-gray-900 dark:text-white">{data.lessonsCompleted}</div>
          <div className="text-sm font-medium text-gray-500 mt-1">Lessons Completed</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <Star className="text-yellow-500 mb-4 w-8 h-8" />
          <div className="text-4xl font-black text-gray-900 dark:text-white">{data.quizzesCompleted}</div>
          <div className="text-sm font-medium text-gray-500 mt-1">Quizzes Passed</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <TrendingUp className="text-green-500 mb-4 w-8 h-8" />
          <div className="text-4xl font-black text-gray-900 dark:text-white">{data.avgQuizScore}%</div>
          <div className="text-sm font-medium text-gray-500 mt-1">Avg Quiz Score</div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <Award className="text-purple-500 mb-4 w-8 h-8" />
          <div className="text-4xl font-black text-gray-900 dark:text-white">{data.aiUsageCount}</div>
          <div className="text-sm font-medium text-gray-500 mt-1">AI Interactions</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Activity This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.chartData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
                <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">Achievements</h3>
            <Trophy className="text-yellow-500 w-5 h-5" />
          </div>
          <div className="space-y-4">
            {data.achievements?.length > 0 ? (
              data.achievements.map((ach: any) => (
                <div key={ach.id} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center shrink-0 text-2xl" title={ach.title}>
                    🏆
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{ach.title}</h4>
                    <p className="text-xs text-gray-500">{ach.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm italic">Complete lessons and AI tools to unlock achievements!</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
