import { Trophy } from "lucide-react";
import { getDashboardAchievementsData } from "@/lib/data/dashboard";

export default async function DashboardAchievements({ userId }: { userId: string }) {
  const achievements = await getDashboardAchievementsData(userId);

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Achievements</h3>
        <Trophy className="text-yellow-500 w-5 h-5" />
      </div>
      <div className="space-y-4">
        {achievements?.length > 0 ? (
          achievements.map((ach: any) => (
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
  );
}
