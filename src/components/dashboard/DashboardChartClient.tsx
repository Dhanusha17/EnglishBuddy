"use client"
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Dynamically import Recharts to avoid loading it on the server
// and to split the bundle so it only loads when the chart is rendered.
const LazyBarChart = dynamic(
  () => import("recharts").then(mod => ({
    default: ({ data }: { data: any }) => {
      const { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } = mod;
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#888'}} />
            <Tooltip cursor={{fill: '#f3f4f6'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Bar dataKey="active" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    }
  })),
  { 
    ssr: false, 
    loading: () => <Skeleton className="w-full h-full rounded-xl" /> 
  }
);

export default function DashboardChartClient({ data }: { data: any[] }) {
  return (
    <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-lg mb-6 text-gray-900 dark:text-white">Activity This Week</h3>
      <div className="h-64">
        <LazyBarChart data={data} />
      </div>
    </div>
  );
}
