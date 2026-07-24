"use client";

import { useEffect, useState } from "react";
import { Loader2, Users, CheckCircle, Activity, Award } from "lucide-react";

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
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
        <Loader2 className="animate-spin text-teal-600 w-12 h-12" />
      </div>
    );
  }

  if (data?.error) {
    return <div className="p-8 text-red-500">Error loading analytics: {data.error}</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Analytics Overview</h1>
        <p className="text-gray-500 mt-2">Platform-wide statistics and student leaderboard.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-teal-100 text-teal-600 rounded-2xl">
            <Users size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{data.totalUsers}</div>
            <div className="text-sm font-medium text-gray-500">Total Students</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-green-100 text-green-600 rounded-2xl">
            <CheckCircle size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{data.activeUsers}</div>
            <div className="text-sm font-medium text-gray-500">Active Students</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-purple-100 text-purple-600 rounded-2xl">
            <Award size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{data.courseCompletionRate}%</div>
            <div className="text-sm font-medium text-gray-500">Course Completion Rate</div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-blue-100 text-blue-600 rounded-2xl">
            <Activity size={28} />
          </div>
          <div>
            <div className="text-3xl font-black text-gray-900 dark:text-white">{data.aiInteractions}</div>
            <div className="text-sm font-medium text-gray-500">AI Interactions</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* LEADERBOARD */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
              <Award className="text-teal-600" /> Student Leaderboard (Top XP)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-800/30 text-gray-500 text-sm font-semibold border-b border-gray-200 dark:border-gray-800">
                  <th className="p-4">Rank</th>
                  <th className="p-4">Student</th>
                  <th className="p-4">Level</th>
                  <th className="p-4">Total XP</th>
                  <th className="p-4">Streak</th>
                </tr>
              </thead>
              <tbody>
                {data.leaderboard?.map((student: any, idx: number) => (
                  <tr key={student.id} className="border-b border-gray-100 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/20 transition-colors">
                    <td className="p-4">
                      {idx === 0 ? <span className="text-2xl">🥇</span> : idx === 1 ? <span className="text-2xl">🥈</span> : idx === 2 ? <span className="text-2xl">🥉</span> : <span className="font-bold text-gray-400">#{idx + 1}</span>}
                    </td>
                    <td className="p-4">
                      <div className="font-semibold text-gray-900 dark:text-white">{student.name}</div>
                      <div className="text-xs text-gray-500">{student.email}</div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">Lvl {student.level}</span>
                    </td>
                    <td className="p-4 font-black text-gray-900 dark:text-white">{student.xp} XP</td>
                    <td className="p-4 text-orange-500 font-bold flex items-center gap-1 mt-1">🔥 {student.streak}</td>
                  </tr>
                ))}
                {data.leaderboard?.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-gray-500">No students on the leaderboard yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECONDARY STATS */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Engagement Stats</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Total Quizzes Passed</span>
                <span className="font-black text-2xl text-teal-600">{data.totalQuizzes}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <span className="font-medium text-gray-700 dark:text-gray-300">Pending Approvals</span>
                <span className="font-black text-2xl text-yellow-600">{data.pendingUsers}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
