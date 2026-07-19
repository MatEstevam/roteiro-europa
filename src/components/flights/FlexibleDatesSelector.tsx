"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type FlexibleDatesSelectorProps = {
  value: string;
  onChange: (v: string) => void;
  departureDate?: string;
};

function getDateRange(baseDate: string, days: number): string {
  if (!baseDate) return "";
  const date = new Date(baseDate + "T00:00:00");
  const before = new Date(date);
  before.setDate(before.getDate() - days);
  const after = new Date(date);
  after.setDate(after.getDate() + days);

  const fmt = (d: Date) =>
    d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });

  return `${fmt(before)} a ${fmt(after)}`;
}

const OPTIONS = [
  { value: "exact", label: "Datas exatas" },
  { value: "3days", label: "+/- 3 dias" },
  { value: "7days", label: "+/- 7 dias" },
] as const;

export function FlexibleDatesSelector({
  value,
  onChange,
  departureDate,
}: FlexibleDatesSelectorProps) {
  const rangeText =
    departureDate && value === "3days"
      ? getDateRange(departureDate, 3)
      : departureDate && value === "7days"
        ? getDateRange(departureDate, 7)
        : null;

  return (
    <div className="space-y-2">
      <Label className="text-sm font-medium">Flexibilidade de datas</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        {OPTIONS.map((opt) => (
          <div key={opt.value} className="flex items-center gap-1.5">
            <RadioGroupItem value={opt.value} id={`flex-${opt.value}`} />
            <Label
              htmlFor={`flex-${opt.value}`}
              className="text-sm cursor-pointer"
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
      {rangeText && (
        <p className="text-xs text-muted-foreground">
          Buscando entre {rangeText}
        </p>
      )}
    </div>
  );
}
