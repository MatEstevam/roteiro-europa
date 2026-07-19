"use client";

import { TripWizard } from "@/components/wizard/TripWizard";
import { Globe, Sparkles, MapPin } from "lucide-react";

export default function PlanejarPage() {
  return (
    <div className="flex-1">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-700">
        {/* Decorative background pattern */}
        <div className="absolute inset-0">
          <div className="absolute -left-4 top-8 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-10 -top-10 h-96 w-96 rounded-full bg-yellow-300/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-rose-300/20 blur-2xl" />
        </div>

        {/* Floating decorative icons */}
        <div className="absolute left-[10%] top-6 text-white/20">
          <Globe className="h-16 w-16 animate-pulse" />
        </div>
        <div className="absolute right-[15%] bottom-8 text-white/20">
          <MapPin className="h-12 w-12" />
        </div>

        <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex items-center gap-2 text-blue-200">
            <Sparkles className="h-5 w-5" />
            <span className="text-sm font-medium uppercase tracking-wide">
              Assistente de viagem inteligente
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Planejar minha viagem
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/80">
            Responda algumas perguntas e criaremos um roteiro personalizado para
            a sua viagem pela Europa, com dicas de transporte, hospedagem e
            pontos turísticos.
          </p>
        </div>
      </div>

      {/* Wizard Section */}
      <div className="relative bg-gray-50/50">
        {/* Top curve overlay */}
        <div className="absolute -top-6 left-0 right-0 h-6 rounded-t-3xl bg-gray-50/50" />

        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
          <TripWizard />
        </div>
      </div>
    </div>
  );
}
