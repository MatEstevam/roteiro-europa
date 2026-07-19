"use client";

import { TripPreferences } from "@/types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Globe, MapPin } from "lucide-react";

interface DestinationSelectorProps {
  data: Partial<TripPreferences>;
  onUpdate: (data: Partial<TripPreferences>) => void;
}

const EUROPEAN_COUNTRIES = [
  "Portugal",
  "Espanha",
  "França",
  "Itália",
  "Alemanha",
  "Holanda",
  "Bélgica",
  "Suíça",
  "Áustria",
  "Reino Unido",
  "Irlanda",
  "Grécia",
  "Croácia",
  "República Tcheca",
  "Hungria",
  "Polônia",
  "Turquia",
  "Noruega",
  "Suécia",
  "Dinamarca",
];

const COUNTRY_CITIES: Record<string, string[]> = {
  Portugal: ["Lisboa", "Porto", "Sintra", "Faro", "Évora"],
  Espanha: ["Barcelona", "Madri", "Sevilha", "Valência", "Granada"],
  França: ["Paris", "Nice", "Lyon", "Marselha", "Bordeaux"],
  Itália: ["Roma", "Florença", "Veneza", "Milão", "Nápoles", "Amalfi"],
  Alemanha: ["Berlim", "Munique", "Frankfurt", "Hamburgo", "Colônia"],
  Holanda: ["Amsterdã", "Roterdã", "Haia", "Utrecht"],
  Bélgica: ["Bruxelas", "Bruges", "Gante", "Antuérpia"],
  Suíça: ["Zurique", "Genebra", "Berna", "Interlaken", "Lucerna"],
  Áustria: ["Viena", "Salzburgo", "Innsbruck", "Hallstatt"],
  "Reino Unido": ["Londres", "Edimburgo", "Manchester", "Liverpool", "Oxford"],
  Irlanda: ["Dublin", "Galway", "Cork", "Belfast"],
  Grécia: ["Atenas", "Santorini", "Mykonos", "Creta", "Tessalônica"],
  Croácia: ["Dubrovnik", "Split", "Zagreb", "Plitvice"],
  "República Tcheca": ["Praga", "Český Krumlov", "Brno"],
  Hungria: ["Budapeste", "Eger"],
  Polônia: ["Cracóvia", "Varsóvia", "Gdansk"],
  Turquia: ["Istambul", "Capadócia", "Antalya"],
  Noruega: ["Oslo", "Bergen", "Tromsø"],
  Suécia: ["Estocolmo", "Gotemburgo", "Malmö"],
  Dinamarca: ["Copenhague", "Aarhus"],
};

export function DestinationSelector({ data, onUpdate }: DestinationSelectorProps) {
  const selectedCountries = data.countries ?? [];
  const selectedCities = data.preferredCities ?? [];
  const pace = data.pace ?? "balanced";

  function toggleCountry(country: string) {
    const updated = selectedCountries.includes(country)
      ? selectedCountries.filter((c) => c !== country)
      : [...selectedCountries, country];
    onUpdate({ countries: updated });
  }

  function toggleCity(city: string) {
    const updated = selectedCities.includes(city)
      ? selectedCities.filter((c) => c !== city)
      : [...selectedCities, city];
    onUpdate({ preferredCities: updated });
  }

  return (
    <div className="space-y-6">
      {/* Countries */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <Globe className="w-5 h-5 text-primary" />
          <span>Quais países você quer visitar?</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {EUROPEAN_COUNTRIES.map((country) => (
            <div
              key={country}
              className="flex items-center space-x-2 min-h-[44px]"
            >
              <Checkbox
                id={`country-${country}`}
                checked={selectedCountries.includes(country)}
                onCheckedChange={() => toggleCountry(country)}
              />
              <Label
                htmlFor={`country-${country}`}
                className="cursor-pointer text-sm"
              >
                {country}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Cities for selected countries */}
      {selectedCountries.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Cidades de interesse (opcional)</span>
          </div>

          {selectedCountries.map((country) => {
            const cities = COUNTRY_CITIES[country];
            if (!cities) return null;
            return (
              <div key={country} className="space-y-2">
                <Label className="font-medium">{country}</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {cities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center space-x-2 min-h-[44px]"
                    >
                      <Checkbox
                        id={`city-${city}`}
                        checked={selectedCities.includes(city)}
                        onCheckedChange={() => toggleCity(city)}
                      />
                      <Label
                        htmlFor={`city-${city}`}
                        className="cursor-pointer text-sm"
                      >
                        {city}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Travel style */}
      <div className="space-y-4">
        <Label className="text-lg font-semibold">Estilo de viagem</Label>
        <RadioGroup
          value={pace === "slow" ? "many" : pace === "intense" ? "many" : "calm"}
          onValueChange={(value) =>
            onUpdate({ pace: value === "many" ? "intense" : "slow" })
          }
          className="grid grid-cols-1 sm:grid-cols-2 gap-3"
        >
          <div className="flex items-center space-x-3 border rounded-lg p-4 min-h-[44px] cursor-pointer hover:bg-accent">
            <RadioGroupItem value="many" id="style-many" />
            <Label htmlFor="style-many" className="cursor-pointer">
              Quero visitar muitos lugares
            </Label>
          </div>
          <div className="flex items-center space-x-3 border rounded-lg p-4 min-h-[44px] cursor-pointer hover:bg-accent">
            <RadioGroupItem value="calm" id="style-calm" />
            <Label htmlFor="style-calm" className="cursor-pointer">
              Prefiro viajar com calma
            </Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );
}
