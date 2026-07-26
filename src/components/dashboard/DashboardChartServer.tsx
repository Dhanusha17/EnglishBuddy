import { getDashboardChartData } from "@/lib/data/dashboard";
import DashboardChartClient from "./DashboardChartClient";

export default async function DashboardChartServer({ userId }: { userId: string }) {
  const chartData = await getDashboardChartData(userId);
  return <DashboardChartClient data={chartData} />;
}
