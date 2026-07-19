import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { FlightSearchResult } from "@/types";

type AlternativeAirportComparisonProps = {
  results: Record<string, FlightSearchResult>;
  originCity: string;
};

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

const ADDITIONAL_COST_WARNINGS = [
  "Transporte terrestre até o aeroporto alternativo",
  "Possível necessidade de hospedagem próxima ao aeroporto",
  "Alimentação durante o deslocamento",
  "Estacionamento (se aplicável)",
  "Tempo adicional de deslocamento",
];

export function AlternativeAirportComparison({
  results,
  originCity,
}: AlternativeAirportComparisonProps) {
  const airports = Object.keys(results);

  if (airports.length < 2) return null;

  // Find cheapest per airport
  const airportPrices = airports.map((airport) => {
    const offers = results[airport].offers;
    const cheapest = offers.length > 0
      ? Math.min(...offers.map((o) => o.totalPrice))
      : Infinity;
    return { airport, cheapest };
  });

  const overallCheapest = Math.min(...airportPrices.map((a) => a.cheapest));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">
          Comparação de aeroportos - {originCity}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Airport cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {airportPrices.map(({ airport, cheapest }) => {
            const isBest = cheapest === overallCheapest;
            const savings = cheapest - overallCheapest;

            return (
              <div
                key={airport}
                className={`p-3 rounded-lg border ${
                  isBest
                    ? "border-green-300 bg-green-50 dark:bg-green-950/20"
                    : "border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{airport}</span>
                  {isBest && (
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100 text-xs">
                      Mais barato
                    </Badge>
                  )}
                </div>
                <p className="text-lg font-bold mt-1">
                  {cheapest === Infinity
                    ? "Sem resultados"
                    : formatPrice(cheapest)}
                </p>
                {!isBest && cheapest !== Infinity && (
                  <p className="text-xs text-muted-foreground">
                    +{formatPrice(savings)} comparado ao melhor
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Potential savings */}
        {airportPrices.length > 1 && (
          <div className="text-sm">
            <span className="font-medium">Economia potencial: </span>
            <span className="text-green-600 font-semibold">
              {formatPrice(
                Math.max(...airportPrices.map((a) => a.cheapest).filter((p) => p !== Infinity)) -
                  overallCheapest
              )}
            </span>
          </div>
        )}

        {/* Warnings */}
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              Custos adicionais a considerar
            </span>
          </div>
          <ul className="text-xs text-amber-700 dark:text-amber-300 space-y-1 list-disc list-inside">
            {ADDITIONAL_COST_WARNINGS.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
