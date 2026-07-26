import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import DashboardAchievements from "@/components/dashboard/DashboardAchievements";
import DashboardChartServer from "@/components/dashboard/DashboardChartServer";

export default async function StudentDashboardPage() {
  const session = await getSession();
  if (!session) redirect("/auth/login");

  const userId = session.sub;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & XP Progress */}
      <Suspense fallback={<Skeleton className="h-48 w-full rounded-3xl" />}>
        <DashboardHeader userId={userId} />
      </Suspense>

      {/* STATS */}
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
        </div>
      }>
        <DashboardStats userId={userId} />
      </Suspense>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* CHART */}
        <Suspense fallback={<Skeleton className="lg:col-span-2 h-80 rounded-2xl" />}>
          <DashboardChartServer userId={userId} />
        </Suspense>

        {/* ACHIEVEMENTS */}
        <Suspense fallback={<Skeleton className="h-80 rounded-2xl" />}>
          <DashboardAchievements userId={userId} />
        </Suspense>
        
      </div>
    </div>
  );
}

