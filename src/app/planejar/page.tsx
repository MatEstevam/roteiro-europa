"use client";

import { TripWizard } from "@/components/wizard/TripWizard";

export default function PlanejarPage() {
  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">
          Planejar minha viagem
        </h1>
        <TripWizard />
      </div>
    </div>
  );
}
