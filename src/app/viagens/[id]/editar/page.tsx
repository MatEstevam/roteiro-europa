"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TripWizard } from "@/components/wizard/TripWizard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ErrorState } from "@/components/shared/ErrorState";
import { DEMO_TRIP_PREFERENCES } from "@/lib/demo/trip-data";
import type { TripPreferences } from "@/types";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [preferences, setPreferences] = useState<Partial<TripPreferences> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTrip() {
      try {
        if (id === "demo") {
          setPreferences(DEMO_TRIP_PREFERENCES);
        } else {
          const res = await fetch(`/api/trips/${id}`);
          if (!res.ok) throw new Error("Não foi possível carregar a viagem.");
          const data = await res.json();
          setPreferences(data.preferences);
        }
      } catch (err: any) {
        setError(err.message || "Erro ao carregar viagem.");
      } finally {
        setLoading(false);
      }
    }
    loadTrip();
  }, [id]);

  if (loading) return <LoadingSkeleton variant="page" />;
  if (error || !preferences) return <ErrorState message={error || "Viagem não encontrada."} />;

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-6">
        <h1 className="text-2xl font-bold">Editar Preferências</h1>
        <TripWizard />
      </div>
    </div>
  );
}
