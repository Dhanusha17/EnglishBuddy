import { Flame } from "lucide-react";
import { getDashboardHeaderData } from "@/lib/data/dashboard";

export default async function DashboardHeader({ userId }: { userId: string }) {
  const data = await getDashboardHeaderData(userId);
  const progressPercent = Math.min(100, Math.round((data.currentXp / data.nextLevelXp) * 100));

  return (
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
          <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>
    </div>
  );
}
