import { BookOpen, Star, TrendingUp, Award } from "lucide-react";
import { getDashboardStatsData } from "@/lib/data/dashboard";

export default async function DashboardStats({ userId }: { userId: string }) {
  const data = await getDashboardStatsData(userId);

  return (
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
  );
}
