import { Badge } from "@/components/ui/badge";

type ApiStatusBadgeProps = {
  isDemo: boolean;
  provider?: string;
};

export function ApiStatusBadge({ isDemo, provider }: ApiStatusBadgeProps) {
  if (isDemo) {
    return (
      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300">
        [Demonstração]
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
      {provider || "API"}
    </Badge>
  );
}
