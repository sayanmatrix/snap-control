import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Plan {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  highlighted?: boolean;
}

interface PlanCardProps {
  plan: Plan;
  currentPlanId?: string;
  onSelect: (planId: string) => void;
  loading?: boolean;
}

export function PlanCard({ plan, currentPlanId, onSelect, loading }: PlanCardProps) {
  const isCurrent = plan.id === currentPlanId;

  return (
    <Card className={cn("flex flex-col", plan.highlighted && "border-primary shadow-lg")}>
      {plan.highlighted && (
        <div className="bg-primary px-4 py-1 text-center text-xs font-medium text-primary-foreground">
          Most Popular
        </div>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>{plan.description}</CardDescription>
        <p className="mt-2 text-3xl font-bold">{plan.price}<span className="text-sm font-normal text-muted-foreground">/mo</span></p>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-2">
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrent ? "outline" : plan.highlighted ? "default" : "outline"}
          disabled={isCurrent || loading}
          onClick={() => onSelect(plan.id)}
        >
          {isCurrent ? "Current Plan" : "Upgrade"}
        </Button>
      </CardFooter>
    </Card>
  );
}
