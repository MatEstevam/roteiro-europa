"use client";

import { TripPreferences } from "@/types";
import { WizardStep } from "@/hooks/use-trip-wizard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users, Gauge, Heart, Wallet, Train, Pencil } from "lucide-react";

interface TripSummaryStepProps {
  data: Partial<TripPreferences>;
  goToStep: (step: WizardStep) => void;
}

export function TripSummaryStep({ data, goToStep }: TripSummaryStepProps) {
  const duration = (() => {
    if (!data.startDate || !data.endDate) return null;
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = end.getTime() - start.getTime();
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (days <= 0) return null;
    return { days: days + 1, nights: days };
  })();

  const paceLabels: Record<string, string> = {
    slow: "Tranquilo",
    balanced: "Equilibrado",
    intense: "Intenso",
  };

  const budgetLabels: Record<string, string> = {
    economic: "Econômico",
    moderate: "Moderado",
    comfortable: "Confortável",
  };

  function formatDate(dateStr?: string) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Resumo da viagem</h3>
      <p className="text-sm text-muted-foreground">
        Confira os detalhes antes de gerar seu roteiro personalizado.
      </p>

      {/* Dates & Travelers */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium">Datas e viajantes</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => goToStep("dates")} className="min-h-[44px]">
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </div>
          <div className="text-sm text-muted-foreground space-y-1 pl-6">
            <p>
              {formatDate(data.startDate)} — {formatDate(data.endDate)}
              {duration && <span className="ml-2 font-medium">({duration.days} dias, {duration.nights} noites)</span>}
            </p>
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3" />
              <span>
                {data.travelers?.adults ?? 2} adulto(s)
                {(data.travelers?.children ?? 0) > 0 &&
                  `, ${data.travelers!.children} criança(s)`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Origin */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Origem</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => goToStep("origin")} className="min-h-[44px]">
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </div>
          <div className="text-sm text-muted-foreground pl-6">
            <p>
              {data.originCity ?? "—"} ({data.originAirport ?? "—"})
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Destinations */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="font-medium">Destinos</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => goToStep("destinations")} className="min-h-[44px]">
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </div>
          <div className="text-sm text-muted-foreground pl-6 space-y-2">
            {data.countries && data.countries.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {data.countries.map((country) => (
                  <Badge key={country} variant="secondary">
                    {country}
                  </Badge>
                ))}
              </div>
            ) : (
              <p>Nenhum país selecionado</p>
            )}
            {data.preferredCities && data.preferredCities.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {data.preferredCities.map((city) => (
                  <Badge key={city} variant="outline">
                    {city}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Profile */}
      <Card>
        <CardContent className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary" />
              <span className="font-medium">Perfil de viagem</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => goToStep("profile")} className="min-h-[44px]">
              <Pencil className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </div>
          <div className="text-sm text-muted-foreground pl-6 space-y-2">
            <div className="flex items-center gap-2">
              <Gauge className="w-3 h-3" />
              <span>Ritmo: {paceLabels[data.pace ?? "balanced"]}</span>
            </div>
            <div className="flex items-center gap-2">
              <Wallet className="w-3 h-3" />
              <span>Orçamento: {budgetLabels[data.budgetLevel ?? "moderate"]}</span>
            </div>
            {data.interests && data.interests.length > 0 && (
              <div className="flex items-start gap-2">
                <Heart className="w-3 h-3 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {data.interests.map((interest) => (
                    <Badge key={interest} variant="outline" className="text-xs">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {data.transportationPreferences && data.transportationPreferences.length > 0 && (
              <div className="flex items-center gap-2">
                <Train className="w-3 h-3" />
                <span>Transporte: {data.transportationPreferences.join(", ")}</span>
              </div>
            )}
            {data.accessibilityNeeds && (
              <p>Acessibilidade: {data.accessibilityNeeds}</p>
            )}
            {data.dietaryPreferences && data.dietaryPreferences.length > 0 && (
              <p>Alimentação: {data.dietaryPreferences.join(", ")}</p>
            )}
            {data.mandatoryPlaces && data.mandatoryPlaces.length > 0 && (
              <p>Lugares obrigatórios: {data.mandatoryPlaces.join(", ")}</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
