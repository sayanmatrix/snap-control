import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { PlanCard } from "@/components/subscription/PlanCard";
import { useToast } from "@/hooks/use-toast";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    description: "For personal projects and testing",
    features: ["100 screenshots/month", "720p resolution", "5s timeout", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    description: "For growing businesses",
    features: ["10,000 screenshots/month", "4K resolution", "30s timeout", "Priority support", "Custom headers", "Webhooks"],
    highlighted: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$99",
    description: "For large-scale operations",
    features: ["Unlimited screenshots", "4K resolution", "60s timeout", "Dedicated support", "Custom headers", "Webhooks", "SLA guarantee", "Custom domain"],
  },
];

export default function Subscription() {
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const { data: currentPlan } = useQuery<{ planId: string }>({
    queryKey: ["subscription"],
    queryFn: () => api("/api/subscription"),
  });

  const selectMutation = useMutation({
    mutationFn: (planId: string) => {
      setLoadingPlan(planId);
      return api("/api/subscription", {
        method: "POST",
        body: JSON.stringify({ planId }),
      });
    },
    onSuccess: () => {
      toast({ title: "Plan updated successfully" });
      setLoadingPlan(null);
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Failed to update plan", description: err.message });
      setLoadingPlan(null);
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Subscription</h2>
        <p className="text-muted-foreground">Choose the plan that fits your needs</p>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        {plans.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            currentPlanId={currentPlan?.planId}
            onSelect={(id) => selectMutation.mutate(id)}
            loading={loadingPlan === plan.id}
          />
        ))}
      </div>
    </div>
  );
}
