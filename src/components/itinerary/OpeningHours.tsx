import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

type OpeningHoursProps = {
  hours?: string[];
  className?: string;
};

export function OpeningHours({ hours, className }: OpeningHoursProps) {
  if (!hours || hours.length === 0) {
    return (
      <div className={cn("flex items-center gap-1 text-xs text-muted-foreground", className)}>
        <Clock className="h-3 w-3" />
        <span>Consultar site oficial</span>
      </div>
    );
  }

  const today = new Date().getDay();
  // Map JS day (0=Sun) to typical display order (0=Mon in many APIs)
  // We highlight based on index matching if hours has 7 entries
  const hasDailyHours = hours.length === 7;
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to Mon=0 format

  return (
    <div className={cn("text-xs text-muted-foreground", className)}>
      <div className="flex items-start gap-1">
        <Clock className="h-3 w-3 shrink-0 mt-0.5" />
        <div className="flex flex-col">
          {hours.length <= 2 ? (
            // Compact: show inline
            <span>{hours.join(" | ")}</span>
          ) : (
            // List format for multiple entries
            <div className="space-y-0.5">
              {hours.map((hour, index) => (
                <span
                  key={index}
                  className={cn(
                    hasDailyHours && index === todayIndex && "font-semibold text-foreground"
                  )}
                >
                  {hour}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
