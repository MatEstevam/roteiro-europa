"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ItineraryCity } from "@/types";
import { format } from "date-fns";
import { MapPin, Plane } from "lucide-react";

const countryFlags: Record<string, string> = {
  Brasil: "🇧🇷",
  Portugal: "🇵🇹",
  França: "🇫🇷",
  Itália: "🇮🇹",
  Espanha: "🇪🇸",
  Alemanha: "🇩🇪",
  "Reino Unido": "🇬🇧",
  Holanda: "🇳🇱",
  Suíça: "🇨🇭",
  Grécia: "🇬🇷",
};

type CityTimelineProps = {
  cities: ItineraryCity[];
  selectedCity?: string;
  onCityClick?: (city: string) => void;
};

export function CityTimeline({
  cities,
  selectedCity,
  onCityClick,
}: CityTimelineProps) {
  const handleCityClick = (city: string) => {
    onCityClick?.(city);
    const element = document.getElementById(`city-${city.toLowerCase()}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="w-full">
      {/* Desktop: horizontal timeline */}
      <div className="hidden md:flex items-center justify-center gap-2 overflow-x-auto py-4">
        {cities.map((city, index) => (
          <div key={city.city} className="flex items-center">
            <Card
              className={cn(
                "px-4 py-3 cursor-pointer transition-all hover:shadow-md min-w-[140px] text-center",
                selectedCity === city.city &&
                  "ring-2 ring-primary shadow-md bg-primary/5"
              )}
              onClick={() => handleCityClick(city.city)}
            >
              <div className="flex flex-col items-center gap-1">
                <span className="text-2xl">
                  {countryFlags[city.country] || "🌍"}
                </span>
                <span className="font-semibold text-sm">{city.city}</span>
                <Badge variant="secondary" className="text-xs">
                  {city.numberOfNights}{" "}
                  {city.numberOfNights === 1 ? "noite" : "noites"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(city.arrivalDate), "dd/MM")} —{" "}
                  {format(new Date(city.departureDate), "dd/MM")}
                </span>
              </div>
            </Card>
            {index < cities.length - 1 && (
              <div className="flex items-center mx-2 text-muted-foreground">
                <div className="w-6 border-t-2 border-dashed border-muted-foreground/40" />
                <Plane className="h-4 w-4 mx-1" />
                <div className="w-6 border-t-2 border-dashed border-muted-foreground/40" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile: vertical timeline */}
      <div className="md:hidden flex flex-col gap-3 py-4">
        {cities.map((city, index) => (
          <div key={city.city} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center border-2",
                  selectedCity === city.city
                    ? "border-primary bg-primary/10"
                    : "border-muted-foreground/30 bg-background"
                )}
              >
                <MapPin className="h-4 w-4" />
              </div>
              {index < cities.length - 1 && (
                <div className="w-0.5 h-8 bg-muted-foreground/30 border-l border-dashed" />
              )}
            </div>
            <Card
              className={cn(
                "flex-1 px-3 py-2 cursor-pointer transition-all hover:shadow-md",
                selectedCity === city.city &&
                  "ring-2 ring-primary shadow-md bg-primary/5"
              )}
              onClick={() => handleCityClick(city.city)}
            >
              <div className="flex items-center gap-2">
                <span className="text-lg">
                  {countryFlags[city.country] || "🌍"}
                </span>
                <div className="flex-1">
                  <span className="font-semibold text-sm">{city.city}</span>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {city.numberOfNights}{" "}
                      {city.numberOfNights === 1 ? "noite" : "noites"}
                    </span>
                    <span>
                      {format(new Date(city.arrivalDate), "dd/MM")} —{" "}
                      {format(new Date(city.departureDate), "dd/MM")}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
