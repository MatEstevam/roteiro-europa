"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Calendar, Users, DollarSign, RefreshCw, Save, Share2, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CityTimeline } from "@/components/itinerary/CityTimeline";
import { ItineraryDayCard } from "@/components/itinerary/ItineraryDayCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataFreshnessNotice } from "@/components/shared/DataFreshnessNotice";
import { ApiStatusBadge } from "@/components/shared/ApiStatusBadge";
import { DEMO_GENERATED_ITINERARY } from "@/lib/demo/trip-data";
import type { GeneratedItinerary } from "@/types";

type FilterType = "all" | "free" | "paid" | "reservation";

export default function TripViewPage() {
  const params = useParams();
  const id = params.id as string;

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");

  useEffect(() => {
    async function loadTrip() {
      try {
        if (id === "demo") {
          setItinerary(DEMO_GENERATED_ITINERARY);
        } else {
          const res = await fetch(`/api/trips/${id}`);
          if (!res.ok) throw new Error("Não foi possível carregar a viagem.");
          const data = await res.json();
          setItinerary(data);
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar viagem.");
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [id]);

  if (loading) return <LoadingSkeleton variant="page" />;
  if (error || !itinerary) return <ErrorState message={error || "Viagem não encontrada."} />;

  const { title, totalDays, cities, estimatedTotalCostPerPerson, days } = itinerary;

  const formatDate = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("pt-BR");
  };

  // Derive start/end dates, countries and city names from cities array
  const startDate = cities.length > 0 ? cities[0].arrivalDate : "";
  const endDate = cities.length > 0 ? cities[cities.length - 1].departureDate : "";
  const countries = [...new Set(cities.map((c) => c.country))];
  const cityNames = cities.map((c) => c.city);

  const filteredDays = (days || []).filter((day) => {
    if (cityFilter !== "all" && day.city !== cityFilter) return false;
    if (typeFilter === "all") return true;
    return day.activities?.some((act) => {
      if (typeFilter === "free") return act.estimatedCostPerPerson.min === 0 && act.estimatedCostPerPerson.max === 0;
      if (typeFilter === "paid") return act.estimatedCostPerPerson.max > 0;
      if (typeFilter === "reservation") return act.bookingRecommended === true;
      return true;
    });
  });

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {startDate && endDate && (
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(startDate)} - {formatDate(endDate)}
              </span>
            )}
            <span>{totalDays} dias</span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              2 viajantes
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {countries.map((c) => (
              <Badge key={c} variant="secondary">{c}</Badge>
            ))}
            {cityNames.map((c) => (
              <Badge key={c} variant="outline">{c}</Badge>
            ))}
          </div>

          {estimatedTotalCostPerPerson && (
            <p className="flex items-center gap-1 text-lg font-semibold">
              <DollarSign className="h-5 w-5" />
              Custo estimado: R$ {estimatedTotalCostPerPerson.min.toLocaleString("pt-BR")} - R$ {estimatedTotalCostPerPerson.max.toLocaleString("pt-BR")}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Edit className="mr-1 h-4 w-4" />
              Editar preferências
            </Button>
            <Button variant="outline" size="sm">
              <RefreshCw className="mr-1 h-4 w-4" />
              Regenerar
            </Button>
            <Button variant="outline" size="sm">
              <Save className="mr-1 h-4 w-4" />
              Salvar
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1 h-4 w-4" />
              Compartilhar
            </Button>
          </div>
        </div>

        {/* City Timeline */}
        <CityTimeline cities={cities} selectedCity={cityFilter !== "all" ? cityFilter : undefined} onCityClick={(city) => setCityFilter(city === cityFilter ? "all" : city)} />

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3">
          <Select value={cityFilter} onValueChange={(v) => setCityFilter(v || "all")}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Todas as cidades" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as cidades</SelectItem>
              {cityNames.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <Badge
              variant={typeFilter === "free" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter(typeFilter === "free" ? "all" : "free")}
            >
              Gratuitas
            </Badge>
            <Badge
              variant={typeFilter === "paid" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter(typeFilter === "paid" ? "all" : "paid")}
            >
              Pagas
            </Badge>
            <Badge
              variant={typeFilter === "reservation" ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setTypeFilter(typeFilter === "reservation" ? "all" : "reservation")}
            >
              Reserva necessária
            </Badge>
          </div>
        </div>

        {/* Day Cards */}
        <div className="space-y-6">
          {filteredDays.map((day, index) => (
            <ItineraryDayCard key={index} day={day} isDemo={id === "demo"} />
          ))}
        </div>

        {/* Footer notices */}
        <div className="space-y-2">
          <DataFreshnessNotice isDemo={id === "demo"} />
          <ApiStatusBadge isDemo={id === "demo"} />
        </div>
      </div>
    </div>
  );
}
