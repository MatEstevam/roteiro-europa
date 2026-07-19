import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Clock, ExternalLink } from "lucide-react";
import { FlightOffer } from "@/types";

type FlightOfferCardProps = {
  offer: FlightOffer;
  highlights?: {
    cheapest?: boolean;
    fastest?: boolean;
    bestBalance?: boolean;
  };
  isDemo?: boolean;
};

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m.toString().padStart(2, "0")}min`;
}

function formatStops(segment: FlightOffer["outbound"]): string {
  if (segment.stops === 0) return "Direto";
  const details = segment.stopDetails
    .map(
      (s) =>
        `${s.airport} - ${Math.floor(s.durationMinutes / 60)}h${(s.durationMinutes % 60).toString().padStart(2, "0")}`
    )
    .join(", ");
  return `${segment.stops} conexão (${details})`;
}

function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

export function FlightOfferCard({
  offer,
  highlights,
  isDemo,
}: FlightOfferCardProps) {
  const lastUpdated = new Date(offer.lastUpdatedAt).toLocaleString("pt-BR");

  return (
    <Card className="relative overflow-hidden">
      {isDemo && (
        <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-800 text-xs px-2 py-0.5 rounded-bl">
          Demo
        </div>
      )}
      <CardContent className="p-4 space-y-3">
        {/* Badges */}
        <div className="flex flex-wrap gap-1.5">
          {highlights?.cheapest && (
            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
              Mais barato
            </Badge>
          )}
          {highlights?.fastest && (
            <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
              Mais rápido
            </Badge>
          )}
          {highlights?.bestBalance && (
            <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
              Melhor equilíbrio
            </Badge>
          )}
          {offer.baggageIncluded && (
            <Badge variant="outline">Bagagem incluída</Badge>
          )}
        </div>

        {/* Airline */}
        <div className="flex items-center gap-2">
          {offer.airlineLogo ? (
            <img
              src={offer.airlineLogo}
              alt={offer.airline}
              className="h-6 w-6 object-contain"
            />
          ) : (
            <Plane className="h-5 w-5 text-muted-foreground" />
          )}
          <span className="font-medium text-sm">{offer.airline}</span>
        </div>

        {/* Route */}
        <div className="space-y-2">
          {/* Outbound */}
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <span className="font-semibold">
                {offer.outbound.departureAirport} →{" "}
                {offer.outbound.arrivalAirport}
              </span>
              <div className="text-muted-foreground text-xs">
                {offer.outbound.departureTime} → {offer.outbound.arrivalTime}
              </div>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(offer.outbound.durationMinutes)}
              </div>
              <div>{formatStops(offer.outbound)}</div>
            </div>
          </div>

          {/* Inbound */}
          {offer.inbound && (
            <div className="flex items-center justify-between border-t pt-2">
              <div className="text-sm">
                <span className="font-semibold">
                  {offer.inbound.departureAirport} →{" "}
                  {offer.inbound.arrivalAirport}
                </span>
                <div className="text-muted-foreground text-xs">
                  {offer.inbound.departureTime} → {offer.inbound.arrivalTime}
                </div>
              </div>
              <div className="text-right text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDuration(offer.inbound.durationMinutes)}
                </div>
                <div>{formatStops(offer.inbound)}</div>
              </div>
            </div>
          )}
        </div>

        {/* Price + Action */}
        <div className="flex items-end justify-between border-t pt-3">
          <div>
            <p className="text-lg font-bold">
              {formatPrice(offer.totalPrice, offer.currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatPrice(offer.pricePerPerson, offer.currency)} por pessoa
            </p>
          </div>
          {offer.bookingUrl && (
            <a
              href={offer.bookingUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="sm" variant="outline">
                Ver oferta
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </a>
          )}
        </div>

        {/* Last updated */}
        <p className="text-[10px] text-muted-foreground">
          Atualizado em {lastUpdated}
        </p>
      </CardContent>
    </Card>
  );
}
