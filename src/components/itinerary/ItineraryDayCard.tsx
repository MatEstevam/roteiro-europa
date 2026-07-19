"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ItineraryDay } from "@/types";
import { format } from "date-fns";
import { ActivityCard } from "./ActivityCard";
import { EstimatedCost } from "./EstimatedCost";
import { MapPin } from "lucide-react";

type ItineraryDayCardProps = {
  day: ItineraryDay;
  isDemo?: boolean;
};

export function ItineraryDayCard({ day, isDemo }: ItineraryDayCardProps) {
  return (
    <Card id={`city-${day.city.toLowerCase()}`} className="relative">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold">
              Dia {day.dayNumber} — {day.title}
            </h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <span>{format(new Date(day.date), "dd/MM")}</span>
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {day.city}, {day.country}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <EstimatedCost
              cost={day.estimatedDailyCostPerPerson}
              perPerson
              className="text-sm"
            />
            {isDemo && (
              <Badge variant="outline" className="text-xs text-yellow-600">
                Demonstração
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted-foreground/20" />

          <div className="space-y-4">
            {day.activities.map((activity) => (
              <div key={activity.id} className="relative pl-10">
                {/* Timeline dot */}
                <div className="absolute left-[11px] top-4 w-3 h-3 rounded-full bg-primary border-2 border-background" />
                <ActivityCard activity={activity} isDemo={isDemo} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
