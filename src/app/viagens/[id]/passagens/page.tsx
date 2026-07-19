"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { DEMO_TRIP_PREFERENCES } from "@/lib/demo/trip-data";
import type { TripPreferences } from "@/types";

export default function TripFlightsPage() {
  const params = useParams();
  const id = params.id as string;

  const [preferences, setPreferences] = useState<Partial<TripPreferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    async function loadTrip() {
      try {
        if (id === "demo") {
          setPreferences(DEMO_TRIP_PREFERENCES);
        } else {
          const res = await fetch(`/api/trips/${id}`);
          if (!res.ok) throw new Error("Não foi possível carregar a viagem.");
          const data = await res.json();
          setPreferences(data.preferences);
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar viagem.");
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [id]);

  async function handleSearch() {
    if (!preferences) return;
    setSearching(true);
    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: preferences.originAirport || preferences.originCity,
          destination: preferences.preferredCities?.[0] || "",
          departureDate: preferences.startDate,
          returnDate: preferences.endDate,
          adults: preferences.travelers?.adults || 1,
          children: preferences.travelers?.children || 0,
          cabinClass: "economy",
          directOnly: false,
          currency: "BRL",
          maxResults: 20,
        }),
      });
      if (!res.ok) throw new Error("Erro na busca de passagens.");
      const data = await res.json();
      setResults(data.offers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSearching(false);
    }
  }

  if (loading) return <LoadingSkeleton variant="page" />;
  if (error || !preferences) return <ErrorState message={error || "Viagem não encontrada."} />;

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex items-center gap-4">
          <Link href={`/viagens/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Voltar ao roteiro
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Passagens Aéreas</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Buscar Voos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label>Origem</Label>
                <Input value={preferences.originAirport || preferences.originCity || ""} readOnly />
              </div>
              <div>
                <Label>Destino</Label>
                <Input value={preferences.preferredCities?.[0] || ""} readOnly />
              </div>
              <div>
                <Label>Ida</Label>
                <Input value={preferences.startDate || ""} readOnly />
              </div>
              <div>
                <Label>Volta</Label>
                <Input value={preferences.endDate || ""} readOnly />
              </div>
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              <Search className="mr-2 h-4 w-4" />
              {searching ? "Buscando..." : "Buscar passagens"}
            </Button>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">{results.length} voos encontrados</h2>
            {results.map((offer: any, idx: number) => (
              <Card key={offer.id || idx}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{offer.airline}</p>
                    <p className="text-sm text-muted-foreground">
                      {offer.outbound?.departureAirport} → {offer.outbound?.arrivalAirport}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      R$ {offer.totalPrice?.toLocaleString("pt-BR")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {offer.outbound?.stops === 0 ? "Direto" : `${offer.outbound?.stops} parada(s)`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
