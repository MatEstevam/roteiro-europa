"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ConfiguracoesPage() {
  const [language, setLanguage] = useState("pt-BR");
  const [currency, setCurrency] = useState("BRL");
  const [defaultAirport, setDefaultAirport] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const settings = localStorage.getItem("roteiro_settings");
    if (settings) {
      const parsed = JSON.parse(settings);
      setLanguage(parsed.language || "pt-BR");
      setCurrency(parsed.currency || "BRL");
      setDefaultAirport(parsed.defaultAirport || "");
    }
  }, []);

  function handleSave() {
    localStorage.setItem(
      "roteiro_settings",
      JSON.stringify({ language, currency, defaultAirport })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl space-y-8">
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>

        <Card>
          <CardHeader>
            <CardTitle>Preferências gerais</CardTitle>
            <CardDescription>
              Configure suas preferências padrão para o planejamento de viagens.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (R$)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                  <SelectItem value="USD">Dólar (US$)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultAirport">Aeroporto padrão</Label>
              <Input
                id="defaultAirport"
                placeholder="Ex: GRU, CGH, GIG..."
                value={defaultAirport}
                onChange={(e) => setDefaultAirport(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Código IATA do aeroporto que será preenchido automaticamente nas pesquisas.
              </p>
            </div>

            <Button onClick={handleSave}>
              <Save className="mr-2 h-4 w-4" />
              {saved ? "Salvo!" : "Salvar configurações"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sobre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Mais opções de personalização serão adicionadas em breve, incluindo integração com contas,
              preferências de viagem avançadas e notificações de preço.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
