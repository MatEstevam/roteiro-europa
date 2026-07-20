"use client";

import { useMemo } from "react";
import { TripPreferences } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Users } from "lucide-react";

interface DateRangeStepProps {
  data: Partial<TripPreferences>;
  onUpdate: (data: Partial<TripPreferences>) => void;
}

export function DateRangeStep({ data, onUpdate }: DateRangeStepProps) {
  const duration = useMemo(() => {
    if (!data.startDate || !data.endDate) return null;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (days <= 0) return null;
    const nights = days;
    return { days: days + 1, nights };
  }, [data.startDate, data.endDate]);

  const adults = data.travelers?.adults ?? 2;
  const children = data.travelers?.children ?? 0;
  const childrenAges = data.travelers?.childrenAges ?? [];

  function updateTravelers(updates: Partial<TripPreferences["travelers"]>) {
    const current = data.travelers ?? { adults: 2, children: 0 };
    const newTravelers = { ...current, ...updates };

    // Adjust childrenAges array length when children count changes
    if (updates.children !== undefined) {
      const newCount = updates.children;
      const currentAges = current.childrenAges ?? [];
      if (newCount > currentAges.length) {
        newTravelers.childrenAges = [
          ...currentAges,
          ...Array(newCount - currentAges.length).fill(5),
        ];
      } else {
        newTravelers.childrenAges = currentAges.slice(0, newCount);
      }
    }

    onUpdate({ travelers: newTravelers });
  }

  function updateChildAge(index: number, age: number) {
    const ages = [...(data.travelers?.childrenAges ?? [])];
    ages[index] = age;
    onUpdate({
      travelers: { ...data.travelers!, childrenAges: ages },
    });
  }

  return (
    <div className="space-y-6">
      {/* Dates */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Calendar className="w-5 h-5 text-primary" />
          <span>Quando você quer viajar?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startDate">Data de ida</Label>
            <Input
              id="startDate"
              type="date"
              value={data.startDate ?? ""}
              onChange={(e) => onUpdate({ startDate: e.target.value })}
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDate">Data de volta</Label>
            <Input
              id="endDate"
              type="date"
              value={data.endDate ?? ""}
              onChange={(e) => onUpdate({ endDate: e.target.value })}
              className="min-h-[44px]"
            />
          </div>
        </div>

        {duration && (
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="py-3 px-4">
              <p className="text-sm font-medium text-primary">
                {duration.days} dias e {duration.nights} noites
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Travelers */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Users className="w-5 h-5 text-primary" />
          <span>Quem vai viajar?</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="adults">Adultos</Label>
            <Input
              id="adults"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={adults}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  updateTravelers({ adults: 0 });
                  return;
                }
                const num = parseInt(val);
                if (!isNaN(num) && num >= 0 && num <= 10) {
                  updateTravelers({ adults: num });
                }
              }}
              onBlur={() => {
                if (adults < 1) updateTravelers({ adults: 1 });
              }}
              className="min-h-[44px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="children">Crianças (0-17 anos)</Label>
            <Input
              id="children"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              value={children}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "") {
                  updateTravelers({ children: 0 });
                  return;
                }
                const num = parseInt(val);
                if (!isNaN(num) && num >= 0 && num <= 8) {
                  updateTravelers({ children: num });
                }
              }}
              className="min-h-[44px]"
            />
          </div>
        </div>

        {children > 0 && (
          <div className="space-y-3">
            <Label>Idade das crianças</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: children }).map((_, i) => (
                <div key={i} className="space-y-1">
                  <Label htmlFor={`childAge-${i}`} className="text-xs text-muted-foreground">
                    Criança {i + 1}
                  </Label>
                  <Input
                    id={`childAge-${i}`}
                    type="number"
                    min={0}
                    max={17}
                    value={childrenAges[i] ?? 5}
                    onChange={(e) =>
                      updateChildAge(i, parseInt(e.target.value) || 0)
                    }
                    className="min-h-[44px]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
