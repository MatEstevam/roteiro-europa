"use client";

import { useEffect, useState } from "react";
import { Plane, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FlightOfferCard } from "./FlightOfferCard";
import { useFlightSearch } from "@/hooks/use-flight-search";
import { getCityIata } from "@/lib/flights/city-iata";
import { buildSkyscannerUrl } from "@/lib/flights/skyscanner-deeplink";

type TripFlightSuggestionsProps = {
  originAirport: string;
  firstCityName: string;
  startDate: string;
  endDate: string;
  adults: number;
  children: number;
};

export function TripFlightSuggestions({
  originAirport,
  firstCityName,
  startDate,
  endDate,
  adults,
  children,
}: TripFlightSuggestionsProps) {
  const { results, loading, error, search, highlights } = useFlightSearch();
  const [searched, setSearched] = useState(false);

  const destIata = getCityIata(firstCityName);

  const skyscannerFallbackUrl = buildSkyscannerUrl({
    origin: originAirport,
    destination: destIata || originAirport,
    departureDate: startDate,
    returnDate: endDate,
    adults,
    children,
  });

  useEffect(() => {
    if (!destIata || searched) return;

    search({
      origin: originAirport,
      destination: destIata,
      departureDate: startDate,
      returnDate: endDate,
      adults,
      children,
      cabinClass: "economy",
      directOnly: false,
      currency: "BRL",
      maxResults: 5,
    });
    setSearched(true);
  }, [destIata, originAirport, startDate, endDate, adults, children, search, searched]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Plane className="h-5 w-5 text-indigo-600" />
          <h2 className="text-xl font-semibold">Passagens Sugeridas</h2>
        </div>
        <a
          href={skyscannerFallbackUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="outline" size="sm">
            Buscar no Skyscanner
            <ExternalLink className="ml-1 h-3 w-3" />
          </Button>
        </a>
      </div>

      <p className="text-sm text-muted-foreground">
        {originAirport} &rarr; {firstCityName}
        {destIata ? ` (${destIata})` : ""} &middot;{" "}
        {new Date(startDate).toLocaleDateString("pt-BR")} -{" "}
        {new Date(endDate).toLocaleDateString("pt-BR")}
      </p>

      {!destIata && (
        <div className="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Nao encontramos o aeroporto de {firstCityName} automaticamente.
          </p>
          <a
            href={skyscannerFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white border-0">
              Ver precos no Skyscanner
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-500 mr-2" />
          <span className="text-sm text-muted-foreground">
            Buscando passagens...
          </span>
        </div>
      )}

      {error && !loading && (
        <div className="rounded-lg border border-dashed border-amber-200 bg-amber-50/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Nao foi possivel buscar passagens automaticamente.
          </p>
          <a
            href={skyscannerFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white border-0">
              Ver precos no Skyscanner
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.slice(0, 5).map((offer) => (
            <FlightOfferCard
              key={offer.id}
              offer={offer}
              highlights={{
                cheapest: highlights.cheapest === offer.id,
                fastest: highlights.fastest === offer.id,
                bestBalance: highlights.bestBalance === offer.id,
              }}
              skyscannerUrl={buildSkyscannerUrl({
                origin: offer.outbound.departureAirport,
                destination: offer.outbound.arrivalAirport,
                departureDate: startDate,
                returnDate: endDate,
                adults,
                children,
              })}
            />
          ))}
        </div>
      )}

      {!loading && !error && searched && results.length === 0 && destIata && (
        <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50/50 p-6 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            Nenhum voo encontrado para essas datas.
          </p>
          <a
            href={skyscannerFallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button className="bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white border-0">
              Tentar no Skyscanner
              <ExternalLink className="ml-1 h-4 w-4" />
            </Button>
          </a>
        </div>
      )}
    </section>
  );
}
