"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { flightSearchSchema, FlightSearchInput } from "@/lib/validators/flight";
import { FlightSearchParams } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plane } from "lucide-react";
import { useState } from "react";

type FlightSearchFormProps = {
  onSearch: (params: FlightSearchParams) => void;
  isLoading?: boolean;
  defaultValues?: Partial<FlightSearchParams>;
};

const ORIGIN_SUGGESTIONS = ["VIX", "GIG", "GRU", "CNF"];

const CABIN_OPTIONS = [
  { value: "economy", label: "Econômica" },
  { value: "premium_economy", label: "Premium Economy" },
  { value: "business", label: "Executiva" },
  { value: "first", label: "Primeira" },
] as const;

export function FlightSearchForm({
  onSearch,
  isLoading,
  defaultValues,
}: FlightSearchFormProps) {
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FlightSearchInput>({
    resolver: zodResolver(flightSearchSchema) as any,
    defaultValues: {
      origin: defaultValues?.origin ?? "",
      destination: defaultValues?.destination ?? "",
      departureDate: defaultValues?.departureDate ?? "",
      returnDate: defaultValues?.returnDate ?? undefined,
      adults: defaultValues?.adults ?? 1,
      children: defaultValues?.children ?? 0,
      cabinClass: defaultValues?.cabinClass ?? "economy",
      directOnly: defaultValues?.directOnly ?? false,
      maxStops: defaultValues?.maxStops ?? undefined,
      currency: defaultValues?.currency ?? "BRL",
      maxResults: defaultValues?.maxResults ?? 20,
    },
  });

  const directOnly = watch("directOnly");
  const [alternativeAirports, setAlternativeAirports] = useState(false);

  const onSubmit = (data: FlightSearchInput) => {
    onSearch(data as FlightSearchParams);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Origin */}
        <div className="space-y-1.5 relative">
          <Label htmlFor="origin">Origem</Label>
          <Input
            id="origin"
            placeholder="Ex: VIX, GRU..."
            {...register("origin")}
            onFocus={() => setShowOriginSuggestions(true)}
            onBlur={() =>
              setTimeout(() => setShowOriginSuggestions(false), 150)
            }
          />
          {showOriginSuggestions && (
            <div className="absolute z-10 top-full mt-1 w-full bg-background border rounded-md shadow-md">
              {ORIGIN_SUGGESTIONS.map((code) => (
                <button
                  key={code}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent"
                  onClick={() => {
                    setValue("origin", code);
                    setShowOriginSuggestions(false);
                  }}
                >
                  {code}
                </button>
              ))}
            </div>
          )}
          {errors.origin && (
            <p className="text-xs text-destructive">{errors.origin.message}</p>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-1.5">
          <Label htmlFor="destination">Destino</Label>
          <Input
            id="destination"
            placeholder="Ex: LIS, CDG..."
            {...register("destination")}
          />
          {errors.destination && (
            <p className="text-xs text-destructive">
              {errors.destination.message}
            </p>
          )}
        </div>

        {/* Departure Date */}
        <div className="space-y-1.5">
          <Label htmlFor="departureDate">Data de ida</Label>
          <Input
            id="departureDate"
            type="date"
            {...register("departureDate")}
          />
          {errors.departureDate && (
            <p className="text-xs text-destructive">
              {errors.departureDate.message}
            </p>
          )}
        </div>

        {/* Return Date */}
        <div className="space-y-1.5">
          <Label htmlFor="returnDate">Data de volta</Label>
          <Input id="returnDate" type="date" {...register("returnDate")} />
        </div>

        {/* Adults */}
        <div className="space-y-1.5">
          <Label htmlFor="adults">Adultos</Label>
          <Input
            id="adults"
            type="number"
            min={1}
            {...register("adults", { valueAsNumber: true })}
          />
        </div>

        {/* Children */}
        <div className="space-y-1.5">
          <Label htmlFor="children">Crianças</Label>
          <Input
            id="children"
            type="number"
            min={0}
            {...register("children", { valueAsNumber: true })}
          />
        </div>

        {/* Cabin Class */}
        <div className="space-y-1.5">
          <Label>Classe</Label>
          <Select
            defaultValue={defaultValues?.cabinClass ?? "economy"}
            onValueChange={(v) =>
              setValue("cabinClass", v as FlightSearchInput["cabinClass"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione a classe" />
            </SelectTrigger>
            <SelectContent>
              {CABIN_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Checkboxes */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Checkbox
            id="directOnly"
            checked={directOnly}
            onCheckedChange={(checked) =>
              setValue("directOnly", checked === true)
            }
          />
          <Label htmlFor="directOnly" className="text-sm cursor-pointer">
            Apenas voos diretos
          </Label>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="alternativeAirports"
            checked={alternativeAirports}
            onCheckedChange={(checked) =>
              setAlternativeAirports(checked === true)
            }
          />
          <Label
            htmlFor="alternativeAirports"
            className="text-sm cursor-pointer"
          >
            Aeroportos alternativos
          </Label>
        </div>
      </div>

      {/* Max Stops (shown if not direct only) */}
      {!directOnly && (
        <div className="space-y-1.5 max-w-[200px]">
          <Label htmlFor="maxStops">Máximo de conexões</Label>
          <Input
            id="maxStops"
            type="number"
            min={1}
            max={3}
            {...register("maxStops", { valueAsNumber: true })}
          />
        </div>
      )}

      {/* Submit */}
      <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
        <Plane className="mr-2 h-4 w-4" />
        {isLoading ? "Pesquisando..." : "Pesquisar"}
      </Button>
    </form>
  );
}
