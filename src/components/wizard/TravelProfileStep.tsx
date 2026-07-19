"use client";

import { TripPreferences } from "@/types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Gauge, Heart, Wallet, Train } from "lucide-react";

interface TravelProfileStepProps {
  data: Partial<TripPreferences>;
  onUpdate: (data: Partial<TripPreferences>) => void;
}

const PACE_OPTIONS: {
  value: TripPreferences["pace"];
  label: string;
  description: string;
}[] = [
  { value: "slow", label: "Tranquilo", description: "Poucos compromissos, muita flexibilidade" },
  { value: "balanced", label: "Equilibrado", description: "Mix de atividades e tempo livre" },
  { value: "intense", label: "Intenso", description: "Aproveitar o máximo possível cada dia" },
];

const BUDGET_OPTIONS: {
  value: TripPreferences["budgetLevel"];
  label: string;
  description: string;
}[] = [
  { value: "economic", label: "Econômico", description: "Hostels, transporte público, ~€50-80/dia" },
  { value: "moderate", label: "Moderado", description: "Hotéis 3★, mix de transporte, ~€100-180/dia" },
  { value: "comfortable", label: "Confortável", description: "Hotéis 4★+, mais flexibilidade, ~€200+/dia" },
];

const INTEREST_OPTIONS = [
  "História",
  "Gastronomia",
  "Museus",
  "Arquitetura",
  "Natureza",
  "Compras",
  "Parques",
  "Futebol",
  "Vida noturna",
  "Experiências religiosas",
  "Passeios com crianças",
];

const TRANSPORT_OPTIONS = ["Avião", "Trem", "Ônibus", "Carro", "Sem preferência"];

export function TravelProfileStep({ data, onUpdate }: TravelProfileStepProps) {
  const selectedInterests = data.interests ?? [];
  const selectedTransport = data.transportationPreferences ?? [];

  function toggleInterest(interest: string) {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter((i) => i !== interest)
      : [...selectedInterests, interest];
    onUpdate({ interests: updated });
  }

  function toggleTransport(transport: string) {
    const updated = selectedTransport.includes(transport)
      ? selectedTransport.filter((t) => t !== transport)
      : [...selectedTransport, transport];
    onUpdate({ transportationPreferences: updated });
  }

  return (
    <div className="space-y-8">
      {/* Pace */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Gauge className="w-5 h-5 text-primary" />
          <span>Ritmo da viagem</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {PACE_OPTIONS.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:border-primary ${
                data.pace === option.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => onUpdate({ pace: option.value })}
            >
              <CardContent className="p-4 text-center min-h-[80px] flex flex-col justify-center">
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Heart className="w-5 h-5 text-primary" />
          <span>O que te interessa?</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {INTEREST_OPTIONS.map((interest) => (
            <div
              key={interest}
              className="flex items-center space-x-2 min-h-[44px]"
            >
              <Checkbox
                id={`interest-${interest}`}
                checked={selectedInterests.includes(interest)}
                onCheckedChange={() => toggleInterest(interest)}
              />
              <Label htmlFor={`interest-${interest}`} className="cursor-pointer text-sm">
                {interest}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Wallet className="w-5 h-5 text-primary" />
          <span>Nível de orçamento</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {BUDGET_OPTIONS.map((option) => (
            <Card
              key={option.value}
              className={`cursor-pointer transition-all hover:border-primary ${
                data.budgetLevel === option.value
                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                  : ""
              }`}
              onClick={() => onUpdate({ budgetLevel: option.value })}
            >
              <CardContent className="p-4 text-center min-h-[80px] flex flex-col justify-center">
                <p className="font-semibold">{option.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Transportation */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Train className="w-5 h-5 text-primary" />
          <span>Transporte entre cidades</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {TRANSPORT_OPTIONS.map((transport) => (
            <div
              key={transport}
              className="flex items-center space-x-2 min-h-[44px]"
            >
              <Checkbox
                id={`transport-${transport}`}
                checked={selectedTransport.includes(transport)}
                onCheckedChange={() => toggleTransport(transport)}
              />
              <Label htmlFor={`transport-${transport}`} className="cursor-pointer text-sm">
                {transport}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Optional fields */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="accessibility">Necessidades de acessibilidade (opcional)</Label>
          <Textarea
            id="accessibility"
            value={data.accessibilityNeeds ?? ""}
            onChange={(e) => onUpdate({ accessibilityNeeds: e.target.value })}
            placeholder="Ex: cadeira de rodas, mobilidade reduzida..."
            className="min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dietary">Preferências alimentares (opcional)</Label>
          <Input
            id="dietary"
            value={data.dietaryPreferences?.join(", ") ?? ""}
            onChange={(e) =>
              onUpdate({
                dietaryPreferences: e.target.value
                  ? e.target.value.split(",").map((s) => s.trim())
                  : [],
              })
            }
            placeholder="Ex: vegetariano, sem glúten, kosher"
            className="min-h-[44px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mandatory">Lugares obrigatórios (opcional, um por linha)</Label>
          <Textarea
            id="mandatory"
            value={data.mandatoryPlaces?.join("\n") ?? ""}
            onChange={(e) =>
              onUpdate({
                mandatoryPlaces: e.target.value
                  ? e.target.value.split("\n").filter((s) => s.trim())
                  : [],
              })
            }
            placeholder={"Ex:\nTorre Eiffel\nColiseu\nSagrada Família"}
            rows={4}
            className="min-h-[44px]"
          />
        </div>
      </div>
    </div>
  );
}
