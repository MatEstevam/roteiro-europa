"use client";

import { useEffect, useState } from "react";
import { Save, Globe, Coins, Plane, Settings, Info, CheckCircle2, Sparkles } from "lucide-react";
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
    <div className="flex-1">
      {/* Gradient Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 via-slate-700 to-zinc-800 px-4 py-12 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDE4YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzem0wIDM2YzEuNjU3IDAgMy0xLjM0MyAzLTNzLTEuMzQzLTMtMy0zLTMgMS4zNDMtMyAzIDEuMzQzIDMgMyAzeiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
        <div className="relative mx-auto max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm ring-1 ring-white/20">
              <Settings className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">Configura&#231;&#245;es</h1>
              <p className="mt-1 text-sm text-slate-300">Personalize sua experi&#234;ncia de planejamento</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Success Toast */}
          <div
            className={`fixed right-4 top-4 z-50 flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-500 ${
              saved
                ? "translate-y-0 opacity-100"
                : "-translate-y-4 opacity-0 pointer-events-none"
            }`}
          >
            <CheckCircle2 className="h-5 w-5 animate-bounce" />
            Configura&#231;&#245;es salvas com sucesso!
          </div>

          {/* Preferences Card */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 dark:shadow-none dark:ring-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700">
                  <Sparkles className="h-5 w-5 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <CardTitle>Prefer&#234;ncias gerais</CardTitle>
                  <CardDescription>Configure suas prefer&#234;ncias padr&#227;o para o planejamento de viagens.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Language */}
              <div className="group rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-100 dark:bg-blue-900/30">
                    <Globe className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="language" className="text-sm font-medium">Idioma</Label>
                    <Select value={language} onValueChange={(v) => v && setLanguage(v)}>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-BR">Portugu&#234;s (Brasil)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Currency */}
              <div className="group rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-emerald-100 dark:bg-emerald-900/30">
                    <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="currency" className="text-sm font-medium">Moeda</Label>
                    <Select value={currency} onValueChange={(v) => v && setCurrency(v)}>
                      <SelectTrigger className="bg-white dark:bg-slate-800">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="BRL">Real (R$)</SelectItem>
                        <SelectItem value="EUR">{`Euro (\u20AC)`}</SelectItem>
                        <SelectItem value="USD">{`D\u00F3lar (US$)`}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Default Airport */}
              <div className="group rounded-lg border border-slate-100 bg-slate-50/50 p-4 transition-colors hover:border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-slate-700 dark:hover:bg-slate-900">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-amber-100 dark:bg-amber-900/30">
                    <Plane className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="defaultAirport" className="text-sm font-medium">Aeroporto padr&#227;o</Label>
                    <Input
                      id="defaultAirport"
                      placeholder="Ex: GRU, CGH, GIG..."
                      value={defaultAirport}
                      onChange={(e) => setDefaultAirport(e.target.value)}
                      className="bg-white dark:bg-slate-800"
                    />
                    <p className="text-xs text-muted-foreground">
                      C&#243;digo IATA do aeroporto que ser&#225; preenchido automaticamente nas pesquisas.
                    </p>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2">
                <Button
                  onClick={handleSave}
                  className={`w-full transition-all duration-300 sm:w-auto ${
                    saved
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-gradient-to-r from-slate-700 to-slate-800 hover:from-slate-800 hover:to-slate-900"
                  }`}
                  size="lg"
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4 animate-bounce" />
                      Salvo!
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {`Salvar configura\u00E7\u00F5es`}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* About Card */}
          <Card className="border-0 shadow-lg shadow-slate-200/50 ring-1 ring-slate-200/60 dark:shadow-none dark:ring-slate-800">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30">
                  <Info className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <CardTitle>Sobre</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg bg-gradient-to-br from-slate-50 to-zinc-50 p-4 dark:from-slate-900/50 dark:to-zinc-900/50">
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Mais op&#231;&#245;es de personaliza&#231;&#227;o ser&#227;o adicionadas em breve, incluindo integra&#231;&#227;o com contas,
                  prefer&#234;ncias de viagem avan&#231;adas e notifica&#231;&#245;es de pre&#231;o.
                </p>
                <div className="mt-4 flex items-center gap-2 border-t border-slate-200/60 pt-4 dark:border-slate-700/60">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">Roteiro Europa v1.0</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
