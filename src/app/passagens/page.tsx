"use client";

import { useState } from "react";
import { Search, ArrowRightLeft, Plane } from "lucide-react";
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
import { cn } from "@/lib/utils";

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

  function handleSwap() {
    setOrigin(destination);
    setDestination(origin);
  }

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
    <div className="flex-1">
      {/* Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iYSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVHJhbnNmb3JtPSJyb3RhdGUoNDUpIj48cGF0aCBkPSJNLTEwIDMwaDYwdjJILTEweiIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="relative mx-auto max-w-5xl">
          <div className="flex items-center gap-3 text-white">
            <div className="rounded-full bg-white/20 p-2.5 backdrop-blur-sm">
              <Plane className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Pesquisa de Passagens</h1>
              <p className="mt-1 text-sm text-blue-100">Encontre as melhores ofertas para sua viagem</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Search Form */}
          <Card className="-mt-16 relative z-10 border-0 shadow-xl shadow-blue-900/10">
            <CardContent className="pt-6">
              <form onSubmit={handleSearch} className="space-y-6">
                {/* Origin / Destination with swap */}
                <div className="relative grid gap-4 sm:grid-cols-[1fr_auto_1fr]">
                  <div className="space-y-2">
                    <Label htmlFor="origin" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Origem</Label>
                    <Input
                      id="origin"
                      placeholder="GRU, CGH..."
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      required
                      className="h-12 text-lg font-semibold uppercase tracking-wide"
                    />
                  </div>
                  <div className="flex items-end justify-center pb-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={handleSwap}
                      className="h-10 w-10 rounded-full border-2 border-dashed border-blue-300 text-blue-600 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200"
                    >
                      <ArrowRightLeft className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="destination" className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Destino</Label>
                    <Input
                      id="destination"
                      placeholder="CDG, LHR..."
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      required
                      className="h-12 text-lg font-semibold uppercase tracking-wide"
                    />
                  </div>
                </div>

                {/* Dates */}
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Datas da viagem</p>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="departureDate" className="text-sm">Data de ida</Label>
                      <Input id="departureDate" type="date" value={departureDate} onChange={(e) => setDepartureDate(e.target.value)} required className="h-11" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="returnDate" className="text-sm">Data de volta</Label>
                      <Input id="returnDate" type="date" value={returnDate} onChange={(e) => setReturnDate(e.target.value)} className="h-11" />
                    </div>
                  </div>
                </div>

                {/* Passengers & Class */}
                <div className="rounded-lg border border-border/50 bg-muted/30 p-4">
                  <p className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Passageiros e classe</p>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                      <Label htmlFor="adults" className="text-sm">Adultos</Label>
                      <Select value={adults} onValueChange={(v) => setAdults(v || "1")}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((n) => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="children" className="text-sm">Crianças</Label>
                      <Select value={children} onValueChange={(v) => setChildren(v || "0")}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {[0, 1, 2, 3, 4].map((n) => (<SelectItem key={n} value={String(n)}>{n}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cabinClass" className="text-sm">Classe</Label>
                      <Select value={cabinClass} onValueChange={(v) => setCabinClass(v || "economy")}>
                        <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Econômica</SelectItem>
                          <SelectItem value="premium_economy">Premium Economy</SelectItem>
                          <SelectItem value="business">Executiva</SelectItem>
                          <SelectItem value="first">Primeira</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Options & Submit */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="directOnly" checked={directOnly} onCheckedChange={(checked) => setDirectOnly(checked === true)} />
                      <Label htmlFor="directOnly" className="cursor-pointer text-sm">Somente voos diretos</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="alternativeAirports" checked={alternativeAirports} onCheckedChange={(checked) => setAlternativeAirports(checked === true)} />
                      <Label htmlFor="alternativeAirports" className="cursor-pointer text-sm">Aeroportos alternativos</Label>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-11 bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-base font-semibold shadow-lg shadow-blue-600/25 hover:from-blue-700 hover:to-indigo-700 hover:shadow-blue-600/40 transition-all duration-200"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? "Pesquisando..." : "Pesquisar"}
                  </Button>
                </div>
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
                <p className="text-sm font-medium text-muted-foreground">
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
                  <Card
                    key={offer.id || index}
                    className={cn(
                      "group border transition-all duration-200 hover:shadow-lg hover:shadow-blue-900/5 hover:-translate-y-0.5",
                      offer.isBestPrice && "border-green-200 bg-green-50/30",
                      offer.isFastest && "border-blue-200 bg-blue-50/30"
                    )}
                  >
                    <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                      {/* Flight info */}
                      <div className="flex-1 space-y-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base font-semibold">{offer.airline || "Companhia"}</span>
                          {offer.isBestPrice && (
                            <Badge className="border-0 bg-emerald-100 text-emerald-700 font-medium">
                              Melhor preço
                            </Badge>
                          )}
                          {offer.isFastest && (
                            <Badge className="border-0 bg-sky-100 text-sky-700 font-medium">
                              Mais rápido
                            </Badge>
                          )}
                        </div>

                        {/* Visual route */}
                        <div className="flex items-center gap-3">
                          <div className="text-center">
                            <p className="text-lg font-bold">{offer.departureTime || "--:--"}</p>
                            <p className="text-xs font-medium uppercase text-muted-foreground">{origin || "---"}</p>
                          </div>

                          <div className="flex flex-1 items-center gap-1 px-2">
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-blue-300 to-indigo-300 rounded" />
                            <div className="relative">
                              <Plane className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="h-[2px] flex-1 bg-gradient-to-r from-indigo-300 to-blue-300 rounded" />
                          </div>

                          <div className="text-center">
                            <p className="text-lg font-bold">{offer.arrivalTime || "--:--"}</p>
                            <p className="text-xs font-medium uppercase text-muted-foreground">{destination || "---"}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className={cn(
                            "text-xs font-medium",
                            offer.stops === 0
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-amber-200 bg-amber-50 text-amber-700"
                          )}>
                            {offer.stops === 0 ? "Direto" : `${offer.stops} conexão${offer.stops > 1 ? "ões" : ""}`}
                          </Badge>
                          {offer.duration && (
                            <span className="text-xs text-muted-foreground font-medium">{offer.duration}</span>
                          )}
                        </div>
                      </div>

                      {/* Price */}
                      <div className="sm:text-right sm:pl-6 sm:border-l sm:border-border/50">
                        <p className="text-sm text-muted-foreground mb-0.5">a partir de</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
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
    </div>
  );
}
