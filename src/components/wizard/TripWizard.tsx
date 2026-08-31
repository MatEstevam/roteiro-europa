"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTripWizard, WizardStep } from "@/hooks/use-trip-wizard";
import { DateRangeStep } from "./DateRangeStep";
import { OriginStep } from "./OriginStep";
import { DestinationSelector } from "./DestinationSelector";
import { TravelProfileStep } from "./TravelProfileStep";
import { TripSummaryStep } from "./TripSummaryStep";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";

const STEP_NAMES: Record<WizardStep, string> = {
  dates: "Datas",
  origin: "Origem",
  destinations: "Destinos",
  profile: "Perfil",
  summary: "Resumo",
};

export function TripWizard() {
  const router = useRouter();
  const wizard = useTripWizard();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  async function handleSubmit() {
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      // Step 1: Generate itinerary (streams from OpenAI to avoid timeout)
      const genResponse = await fetch("/api/itinerary/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(wizard.formData),
      });

      if (!genResponse.ok) {
        let msg = "Erro ao gerar roteiro. Tente novamente.";
        try {
          const errorData = await genResponse.json();
          msg = errorData?.error?.message || errorData?.error?.details?.[0]?.message || msg;
        } catch {
          // Response wasn't JSON (e.g. Vercel error page)
        }
        throw new Error(msg);
      }

      let itinerary;
      const contentType = genResponse.headers.get("content-type") || "";

      if (contentType.includes("text/event-stream")) {
        // Streaming response from OpenAI — read SSE until done
        const reader = genResponse.body!.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });

          // Process complete SSE lines
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const payload = JSON.parse(line.slice(6));
            if (payload.error) throw new Error(payload.error);
            if (payload.done) {
              itinerary = payload.itinerary;
            }
          }
        }

        if (!itinerary) throw new Error("Roteiro incompleto. Tente novamente.");
      } else {
        // Non-streaming (deterministic fallback)
        const data = await genResponse.json();
        itinerary = data.itinerary;
      }

      // Step 2: Save trip to database
      const saveResponse = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: itinerary.title,
          preferences: wizard.formData,
          itinerary,
        }),
      });

      if (saveResponse.ok) {
        const saved = await saveResponse.json();
        router.push(`/viagens/${saved.id}`);
      } else {
        // Save failed but itinerary was generated — store in sessionStorage and show anyway
        sessionStorage.setItem("generatedItinerary", JSON.stringify(itinerary));
        sessionStorage.setItem("generatedPreferences", JSON.stringify(wizard.formData));
        router.push("/viagens/preview");
      }
    } catch (error: any) {
      console.error("Erro ao gerar roteiro:", error);
      setSubmitError(error.message || "Erro ao gerar roteiro. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  function renderStep() {
    switch (wizard.currentStep) {
      case "dates":
        return <DateRangeStep data={wizard.formData} onUpdate={wizard.updateData} />;
      case "origin":
        return <OriginStep data={wizard.formData} onUpdate={wizard.updateData} />;
      case "destinations":
        return <DestinationSelector data={wizard.formData} onUpdate={wizard.updateData} />;
      case "profile":
        return <TravelProfileStep data={wizard.formData} onUpdate={wizard.updateData} />;
      case "summary":
        return <TripSummaryStep data={wizard.formData} goToStep={wizard.goToStep} />;
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Planejar Viagem</h2>
          <span className="text-sm text-muted-foreground">
            Passo {wizard.stepIndex + 1} de {wizard.totalSteps}
          </span>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1">
          {(["dates", "origin", "destinations", "profile", "summary"] as WizardStep[]).map(
            (step, index) => (
              <div key={step} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className={`h-2 w-full rounded-full transition-colors ${
                    index <= wizard.stepIndex ? "bg-primary" : "bg-muted"
                  }`}
                />
                <span
                  className={`text-xs hidden sm:block ${
                    index === wizard.stepIndex
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {STEP_NAMES[step]}
                </span>
              </div>
            )
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {renderStep()}

        {submitError && (
          <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            size="lg"
            onClick={wizard.back}
            disabled={wizard.isFirst || isSubmitting}
            className="min-w-[120px] min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>

          {wizard.isLast ? (
            <Button
              size="lg"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="min-w-[180px] min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Gerando roteiro com IA...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Criar meu roteiro
                </>
              )}
            </Button>
          ) : (
            <Button
              size="lg"
              onClick={wizard.next}
              className="min-w-[120px] min-h-[44px]"
            >
              Avançar
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
