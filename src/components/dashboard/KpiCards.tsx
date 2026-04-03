import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react";

interface KpiData {
  totalRequests: number;
  successCount: number;
  errorCount: number;
  avgLatency: number;
}

const icons = [
  { icon: Activity, label: "Total Requests", key: "totalRequests" as const, format: (v: number) => v.toLocaleString() },
  { icon: CheckCircle, label: "Successful", key: "successCount" as const, format: (v: number) => v.toLocaleString() },
  { icon: XCircle, label: "Errors", key: "errorCount" as const, format: (v: number) => v.toLocaleString() },
  { icon: Clock, label: "Avg Latency", key: "avgLatency" as const, format: (v: number) => `${v}ms` },
];

export function KpiCards({ data }: { data: KpiData }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {icons.map(({ icon: Icon, label, key, format }) => (
        <Card key={key}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
            <Icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{format(data[key])}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
