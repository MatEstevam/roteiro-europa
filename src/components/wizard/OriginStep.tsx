"use client";

import { useEffect } from "react";
import { TripPreferences } from "@/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MapPin, Plane } from "lucide-react";

interface OriginStepProps {
  data: Partial<TripPreferences>;
  onUpdate: (data: Partial<TripPreferences>) => void;
}

const CITY_AIRPORTS: Record<string, string> = {
  Vitória: "VIX",
  "Rio de Janeiro": "GIG",
  "São Paulo": "GRU",
  "Belo Horizonte": "CNF",
};

const CITY_OPTIONS = ["Vitória", "Rio de Janeiro", "São Paulo", "Belo Horizonte", "Outro"];

export function OriginStep({ data, onUpdate }: OriginStepProps) {
  const selectedCity = data.originCity ?? "Vitória";
  const isOther = !CITY_OPTIONS.slice(0, -1).includes(selectedCity) && selectedCity !== "";
  const displayCity = isOther ? "Outro" : selectedCity;
  const acceptAlternative = (data as Record<string, unknown>).acceptAlternativeAirports as boolean ?? false;
  const maxDistance = (data as Record<string, unknown>).maxAirportDistance as number ?? 200;

  useEffect(() => {
    if (!isOther && selectedCity && CITY_AIRPORTS[selectedCity]) {
      onUpdate({ originAirport: CITY_AIRPORTS[selectedCity] });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity]);

  function handleCityChange(value: string) {
    if (value === "Outro") {
      onUpdate({ originCity: "", originAirport: "" });
    } else {
      onUpdate({ originCity: value, originAirport: CITY_AIRPORTS[value] ?? "" });
    }
  }

  return (
    <div className="space-y-6">
      {/* City selection */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <MapPin className="w-5 h-5 text-primary" />
          <span>De onde você vai sair?</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="originCity">Cidade de origem</Label>
          <Select value={displayCity} onValueChange={(value) => handleCityChange(value ?? "")}>
            <SelectTrigger className="min-h-[44px]">
              <SelectValue placeholder="Selecione a cidade" />
            </SelectTrigger>
            <SelectContent>
              {CITY_OPTIONS.map((city) => (
                <SelectItem key={city} value={city}>
                  {city}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {displayCity === "Outro" && (
          <div className="space-y-2">
            <Label htmlFor="customCity">Nome da cidade</Label>
            <Input
              id="customCity"
              value={selectedCity}
              onChange={(e) => onUpdate({ originCity: e.target.value })}
              placeholder="Digite o nome da sua cidade"
              className="min-h-[44px]"
            />
          </div>
        )}
      </div>

      {/* Airport */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Plane className="w-5 h-5 text-primary" />
          <span>Aeroporto</span>
        </div>

        <div className="space-y-2">
          <Label htmlFor="originAirport">Código do aeroporto</Label>
          <Input
            id="originAirport"
            value={data.originAirport ?? ""}
            onChange={(e) => onUpdate({ originAirport: e.target.value.toUpperCase() })}
            placeholder="Ex: VIX, GRU, GIG"
            maxLength={4}
            className="min-h-[44px] uppercase"
          />
          {!isOther && selectedCity && CITY_AIRPORTS[selectedCity] && (
            <p className="text-xs text-muted-foreground">
              Sugerido: {CITY_AIRPORTS[selectedCity]}
              {selectedCity === "Rio de Janeiro" && " ou SDU"}
              {selectedCity === "São Paulo" && " ou CGH"}
            </p>
          )}
        </div>

        {/* Alternative airports */}
        <div className="flex items-center space-x-3 min-h-[44px]">
          <Checkbox
            id="acceptAlternative"
            checked={acceptAlternative}
            onCheckedChange={(checked) =>
              onUpdate({ acceptAlternativeAirports: !!checked } as Partial<TripPreferences>)
            }
          />
          <Label htmlFor="acceptAlternative" className="cursor-pointer">
            Aceito embarcar de aeroportos alternativos se o preço for melhor
          </Label>
        </div>

        {acceptAlternative && (
          <div className="space-y-2">
            <Label htmlFor="maxDistance">Distância máxima do aeroporto alternativo (km)</Label>
            <Input
              id="maxDistance"
              type="number"
              min={50}
              max={500}
              step={50}
              value={maxDistance}
              onChange={(e) =>
                onUpdate({ maxAirportDistance: parseInt(e.target.value) || 200 } as Partial<TripPreferences>)
              }
              className="min-h-[44px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
