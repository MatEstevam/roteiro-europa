"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Calendar, Users, DollarSign, RefreshCw, Save, Share2, Edit, MapPin, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CityTimeline } from "@/components/itinerary/CityTimeline";
import { ItineraryDayCard } from "@/components/itinerary/ItineraryDayCard";
import { TripFlightSuggestions } from "@/components/flights/TripFlightSuggestions";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { DataFreshnessNotice } from "@/components/shared/DataFreshnessNotice";
import { ApiStatusBadge } from "@/components/shared/ApiStatusBadge";
import { DEMO_GENERATED_ITINERARY } from "@/lib/demo/trip-data";
import { cn } from "@/lib/utils";
import type { GeneratedItinerary } from "@/types";

type FilterType = "all" | "free" | "paid" | "reservation";

type TripMeta = {
  id: string;
  originCity?: string;
  originAirport?: string;
  travelers?: any[];
  startDate?: string;
  endDate?: string;
};

export function TripViewContent() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [tripMeta, setTripMeta] = useState<TripMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<FilterType>("all");
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      try {
        if (id === "demo") {
          setItinerary(DEMO_GENERATED_ITINERARY);
          setTripMeta({ id: "demo", originAirport: "VIX", originCity: "Vitoria" });
        } else if (id === "preview") {
          const stored = sessionStorage.getItem("generatedItinerary");
          if (!stored) {
            setError("Nenhum roteiro em preview. Crie um novo roteiro.");
            return;
          }
          const itin = JSON.parse(stored) as GeneratedItinerary;
          setItinerary(itin);
          setTripMeta({ id: "preview", originAirport: "VIX", originCity: "Vitoria" });
        } else {
          const res = await fetch(`/api/trips/${id}`);
          if (!res.ok) throw new Error("Nao foi possivel carregar a viagem.");
          const data = await res.json();

          // The API returns a Prisma Trip row; itinerary is in generatedItinerary
          const itin = data.generatedItinerary as GeneratedItinerary;
          if (!itin) {
            setError("Este roteiro ainda nao foi gerado.");
            return;
          }
          setItinerary(itin);
          setTripMeta({
            id: data.id,
            originCity: data.originCity,
            originAirport: data.originAirport,
            travelers: data.travelers,
            startDate: data.startDate,
            endDate: data.endDate,
          });
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
  if (error || !itinerary) return <ErrorState message={error || "Viagem nao encontrada."} />;

  const { title, totalDays, cities, estimatedTotalCostPerPerson, days } = itinerary;

  const formatDate = (d: string) => new Date(d).toLocaleDateString("pt-BR");

  const startDate = cities.length > 0 ? cities[0].arrivalDate : "";
  const endDate = cities.length > 0 ? cities[cities.length - 1].departureDate : "";
  const countries = [...new Set(cities.map((c) => c.country))];
  const cityNames = cities.map((c) => c.city);

  const travelerCount = tripMeta?.travelers?.length || 2;
  const adultsCount = tripMeta?.travelers?.filter((t: any) => t.type === "adult").length || travelerCount;
  const childrenCount = tripMeta?.travelers?.filter((t: any) => t.type === "child").length || 0;

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

  async function handleShare() {
    if (id === "demo" || id === "preview") {
      alert("Salve a viagem antes de compartilhar.");
      return;
    }
    setSharing(true);
    try {
      const res = await fetch(`/api/trips/${id}/share`, { method: "POST" });
      if (!res.ok) throw new Error("Erro ao gerar link de compartilhamento.");
      const { shareUrl } = await res.json();
      await navigator.clipboard.writeText(shareUrl);
      alert("Link copiado para a área de transferência!");
    } catch (err: any) {
      alert(err.message || "Erro ao compartilhar.");
    } finally {
      setSharing(false);
    }
  }

  return (
    <div className="flex-1">
      {/* Gradient Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-yellow-300/20 blur-2xl" />

        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
              <Plane className="h-7 w-7 text-white" />
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl drop-shadow-sm">
                {title}
              </h1>

              <div className="flex flex-wrap items-center gap-3 text-sm text-white/90">
                {startDate && endDate && (
                  <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                    <Calendar className="h-4 w-4" />
                    {formatDate(startDate)} - {formatDate(endDate)}
                  </span>
                )}
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                  <MapPin className="h-4 w-4" />
                  {totalDays} dias
                </span>
                <span className="flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm">
                  <Users className="h-4 w-4" />
                  {travelerCount} viajante{travelerCount !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {countries.map((c) => (
                  <Badge key={c} className="border-0 bg-white/25 text-white backdrop-blur-sm hover:bg-white/35">
                    {c}
                  </Badge>
                ))}
                {cityNames.map((c) => (
                  <Badge key={c} className="border border-white/30 bg-transparent text-white/90 hover:bg-white/15">
                    {c}
                  </Badge>
                ))}
              </div>

              {estimatedTotalCostPerPerson && (
                <div className="inline-flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 backdrop-blur-sm">
                  <DollarSign className="h-5 w-5 text-white" />
                  <span className="text-lg font-semibold text-white">
                    R$ {estimatedTotalCostPerPerson.min.toLocaleString("pt-BR")} - R$ {estimatedTotalCostPerPerson.max.toLocaleString("pt-BR")}
                  </span>
                  <span className="text-sm text-white/70">/ pessoa</span>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-wrap gap-2">
            <Button
              size="sm"
              className="bg-white text-indigo-700 shadow-md hover:bg-white/90"
              onClick={() => router.push(`/viagens/${id}/editar`)}
            >
              <Edit className="mr-1.5 h-4 w-4" />
              Editar preferencias
            </Button>
            <Button size="sm" className="bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30">
              <RefreshCw className="mr-1.5 h-4 w-4" />
              Regenerar
            </Button>
            <Button
              size="sm"
              className="bg-white/20 text-white backdrop-blur-sm border-white/30 hover:bg-white/30"
              onClick={handleShare}
              disabled={sharing}
            >
              <Share2 className="mr-1.5 h-4 w-4" />
              {sharing ? "Gerando link..." : "Compartilhar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* City Timeline */}
        <CityTimeline cities={cities} selectedCity={cityFilter !== "all" ? cityFilter : undefined} onCityClick={(city) => setCityFilter(city === cityFilter ? "all" : city)} />

        {/* Flight Suggestions */}
        {tripMeta && id !== "demo" && cities.length > 0 && (
          <TripFlightSuggestions
            originAirport={tripMeta.originAirport || "GRU"}
            firstCityName={cities[0].city}
            startDate={startDate}
            endDate={endDate}
            adults={adultsCount}
            children={childrenCount}
          />
        )}

        {/* Filters */}
        <div className="rounded-xl border bg-gradient-to-r from-indigo-50/50 to-blue-50/50 dark:from-indigo-950/20 dark:to-blue-950/20 p-4 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <Select value={cityFilter} onValueChange={(v) => setCityFilter(v || "all")}>
              <SelectTrigger className="w-[200px] bg-white dark:bg-background shadow-sm">
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as cidades</SelectItem>
                {cityNames.map((city) => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-border hidden sm:block" />

            <div className="flex gap-2">
              <Badge
                variant={typeFilter === "free" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  typeFilter === "free"
                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                    : "hover:border-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-400"
                )}
                onClick={() => setTypeFilter(typeFilter === "free" ? "all" : "free")}
              >
                Gratuitas
              </Badge>
              <Badge
                variant={typeFilter === "paid" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  typeFilter === "paid"
                    ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                    : "hover:border-blue-400 hover:text-blue-700 dark:hover:text-blue-400"
                )}
                onClick={() => setTypeFilter(typeFilter === "paid" ? "all" : "paid")}
              >
                Pagas
              </Badge>
              <Badge
                variant={typeFilter === "reservation" ? "default" : "outline"}
                className={cn(
                  "cursor-pointer transition-all",
                  typeFilter === "reservation"
                    ? "bg-purple-600 hover:bg-purple-700 text-white shadow-sm"
                    : "hover:border-purple-400 hover:text-purple-700 dark:hover:text-purple-400"
                )}
                onClick={() => setTypeFilter(typeFilter === "reservation" ? "all" : "reservation")}
              >
                Reserva necessaria
              </Badge>
            </div>
          </div>
        </div>

        {/* Day Cards */}
        <div className="space-y-6">
          {filteredDays.map((day, index) => (
            <ItineraryDayCard key={index} day={day} isDemo={id === "demo"} />
          ))}
          {filteredDays.length === 0 && (
            <div className="rounded-xl border-2 border-dashed p-12 text-center">
              <MapPin className="mx-auto h-10 w-10 text-muted-foreground/50" />
              <p className="mt-3 text-muted-foreground">Nenhum dia encontrado com os filtros selecionados.</p>
            </div>
          )}
        </div>

        {/* Footer notices */}
        <div className="space-y-2 rounded-lg border bg-muted/30 p-4">
          <DataFreshnessNotice isDemo={id === "demo"} />
          <ApiStatusBadge isDemo={id === "demo"} />
        </div>
      </div>
    </div>
  );
}
