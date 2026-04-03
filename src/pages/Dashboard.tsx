import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { ApiChart } from "@/components/dashboard/ApiChart";

interface KpiData {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  avgLatency: number;
}

interface ChartDataPoint {
  date: string;
  success: number;
  error: number;
}

export default function Dashboard() {
  const [days, setDays] = useState(7);

  const { data: kpi } = useQuery<KpiData>({
    queryKey: ["kpi", days],
    queryFn: () => api("/api/analytics/kpi", { params: { days: String(days) } }),
  });

  const { data: chartData } = useQuery<ChartDataPoint[]>({
    queryKey: ["chart", days],
    queryFn: () => api("/api/analytics/chart", { params: { days: String(days) } }),
  });

  const defaultKpi: KpiData = { totalRequests: 0, successCount: 0, errorCount: 0, avgLatency: 0 };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">Your screenshot API performance at a glance</p>
      </div>
      <KpiCards data={kpi ?? defaultKpi} />
      <ApiChart data={chartData ?? []} days={days} onDaysChange={setDays} />
    </div>
  );
}
