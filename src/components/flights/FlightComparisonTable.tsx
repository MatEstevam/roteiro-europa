import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AirportComparison = {
  airport: string;
  city: string;
  bestPrice: number;
  duration: number;
  stops: number;
};

type FlightComparisonTableProps = {
  comparisons: AirportComparison[];
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

function formatPrice(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function FlightComparisonTable({
  comparisons,
}: FlightComparisonTableProps) {
  if (comparisons.length === 0) return null;

  const cheapestPrice = Math.min(...comparisons.map((c) => c.bestPrice));

  return (
    <div className="space-y-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Aeroporto</TableHead>
            <TableHead>Melhor Preço</TableHead>
            <TableHead>Duração</TableHead>
            <TableHead>Conexões</TableHead>
            <TableHead>Economia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comparisons.map((row) => {
            const isCheapest = row.bestPrice === cheapestPrice;
            const savings = row.bestPrice - cheapestPrice;
            return (
              <TableRow
                key={row.airport}
                className={isCheapest ? "bg-green-50 dark:bg-green-950/20" : ""}
              >
                <TableCell className="font-medium">
                  {row.airport}{" "}
                  <span className="text-muted-foreground text-xs">
                    ({row.city})
                  </span>
                </TableCell>
                <TableCell className={isCheapest ? "font-bold" : ""}>
                  {formatPrice(row.bestPrice)}
                </TableCell>
                <TableCell>{formatDuration(row.duration)}</TableCell>
                <TableCell>
                  {row.stops === 0 ? "Direto" : `${row.stops} conexão`}
                </TableCell>
                <TableCell>
                  {isCheapest ? (
                    <span className="text-green-600 font-medium">
                      Melhor preço
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      +{formatPrice(savings)}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <p className="text-xs text-muted-foreground italic">
        Considere custos adicionais: transporte ao aeroporto, hospedagem,
        alimentação, estacionamento
      </p>
    </div>
  );
}
