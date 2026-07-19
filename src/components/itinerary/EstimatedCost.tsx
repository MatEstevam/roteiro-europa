import { cn, formatCurrency } from "@/lib/utils";
import { CostEstimate } from "@/types";

type EstimatedCostProps = {
  cost: CostEstimate;
  perPerson?: boolean;
  className?: string;
};

export function EstimatedCost({ cost, perPerson, className }: EstimatedCostProps) {
  const { min, max, currency } = cost;

  if (min === 0 && max === 0) {
    return (
      <span className={cn("text-green-600 font-medium", className)}>
        Gratuito
      </span>
    );
  }

  const suffix = perPerson ? " por pessoa" : "";

  if (min === max) {
    return (
      <span className={cn("text-muted-foreground italic", className)}>
        ~{formatCurrency(min, currency)}
        {suffix}
      </span>
    );
  }

  return (
    <span className={cn("text-muted-foreground italic", className)}>
      ~{formatCurrency(min, currency)} - {formatCurrency(max, currency)}
      {suffix}
    </span>
  );
}
