"use client";

import { useState } from "react";
import { Search, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { EmptyState } from "@/components/shared/EmptyState";
import { ApiStatusBadge } from "@/components/shared/ApiStatusBadge";
import { DataFreshnessNotice } from "@/components/shared/DataFreshnessNotice";

type SortOption = "price" | "duration" | "stops" | "balance" | "time";

export default function PassagensPage() {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [adults, setAdults] = useState("1");
  const [children, setChildren] = useState("0");
  const [cabinClass, setCabinClass] = useState("economy");
  const [directOnly, setDirectOnly] = useState(false);
  const [alternativeAirports, setAlternativeAirports] = useState(false);

  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("price");

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch("/api/flights/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin,
          destination,
          departureDate,
          returnDate: returnDate || undefined,
          adults: Number(adults),
          children: Number(children),
          cabinClass,
          directOnly,
          alternativeAirports,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || "Erro na pesquisa.");
      }

      const data = await res.json();
      setResults(data.offers || data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const sortedResults = [...results].sort((a, b) => {
    switch (sortBy) {
      case "price": return (a.price || 0) - (b.price || 0);
      case "duration": return (a.totalDuration || 0) - (b.totalDuration || 0);
      case "stops": return (a.stops || 0) - (b.stops || 0);
      case "time": return (a.departureTime || "").localeCompare(b.departureTime || "");
      default: return (a.score || 0) - (b.score || 0);
    }
  });

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Pesquisa de Passagens</h1>

        {/* Search Form */}
        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="origin">Origem</Label>
                  <Input
                    id="origin"
                    placeholder="GRU, CGH..."
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination">Destino</Label>
                  <Input
                    id="destination"
                    placeholder="CDG, LHR..."
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureDate">Data de ida</Label>
                  <Input
                    id="departureDate"
                    type="date"
                    value={departureDate}
                    onChange={(e) => setDepartureDate(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="returnDate">Data de volta</Label>
                  <Input
                    id="returnDate"
                    type="date"
                    value={returnDate}
                    onChange={(e) => setReturnDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-2">
                  <Label htmlFor="adults">Adultos</Label>
                  <Select value={adults} onValueChange={(v) => setAdults(v || "1")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="children">Crianças</Label>
                  <Select value={children} onValueChange={(v) => setChildren(v || "0")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[0, 1, 2, 3, 4].map((n) => (
                        <SelectItem key={n} value={String(n)}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cabinClass">Classe</Label>
                  <Select value={cabinClass} onValueChange={(v) => setCabinClass(v || "economy")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Econômica</SelectItem>
                      <SelectItem value="premium_economy">Premium Economy</SelectItem>
                      <SelectItem value="business">Executiva</SelectItem>
                      <SelectItem value="first">Primeira</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="directOnly"
                    checked={directOnly}
                    onCheckedChange={(checked) => setDirectOnly(checked === true)}
                  />
                  <Label htmlFor="directOnly" className="cursor-pointer">Somente voos diretos</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="alternativeAirports"
                    checked={alternativeAirports}
                    onCheckedChange={(checked) => setAlternativeAirports(checked === true)}
                  />
                  <Label htmlFor="alternativeAirports" className="cursor-pointer">Aeroportos alternativos</Label>
                </div>
              </div>

              <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                <Search className="mr-2 h-4 w-4" />
                {loading ? "Pesquisando..." : "Pesquisar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading && <LoadingSkeleton variant="page" />}

        {error && <ErrorState message={error} />}

        {!loading && !error && searched && results.length === 0 && (
          <EmptyState
            title="Nenhum voo encontrado"
            description="Tente ajustar as datas ou destinos da pesquisa."
            action={{ label: "Nova pesquisa", onClick: () => setSearched(false) }}
          />
        )}

        {!loading && !error && results.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {results.length} resultado{results.length !== 1 ? "s" : ""} encontrado{results.length !== 1 ? "s" : ""}
              </p>
              <Select value={sortBy} onValueChange={(v) => v && setSortBy(v as SortOption)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price">Menor preço</SelectItem>
                  <SelectItem value="duration">Menor duração</SelectItem>
                  <SelectItem value="stops">Menos conexões</SelectItem>
                  <SelectItem value="balance">Melhor equilíbrio</SelectItem>
                  <SelectItem value="time">Melhor horário</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              {sortedResults.map((offer, index) => (
                <Card key={offer.id || index} className="transition-shadow hover:shadow-md">
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{offer.airline || "Companhia"}</span>
                        {offer.isBestPrice && <Badge className="bg-green-100 text-green-800">Melhor preço</Badge>}
                        {offer.isFastest && <Badge className="bg-blue-100 text-blue-800">Mais rápido</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {offer.departureTime || "--:--"} <ArrowRightLeft className="inline h-3 w-3 mx-1" /> {offer.arrivalTime || "--:--"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {offer.stops === 0 ? "Direto" : `${offer.stops} conexão${offer.stops > 1 ? "ões" : ""}`}
                        {offer.duration && ` · ${offer.duration}`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">
                        R$ {(offer.price || 0).toLocaleString("pt-BR")}
                      </p>
                      <p className="text-xs text-muted-foreground">por pessoa</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer notices */}
        <div className="space-y-2">
          <ApiStatusBadge isDemo={true} />
          <DataFreshnessNotice />
        </div>
      </div>
    </div>
  );
}
