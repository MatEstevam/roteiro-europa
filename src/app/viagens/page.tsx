"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Plus } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { EmptyState } from "@/components/shared/EmptyState";
import { cn } from "@/lib/utils";

export default function ViagensPage() {
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check basic auth status (simplified - in production use a proper auth check)
    const token = typeof window !== "undefined" ? localStorage.getItem("auth_token") : null;
    if (!token) {
      setAuthenticated(false);
      setLoading(false);
      return;
    }
    setAuthenticated(true);

    async function fetchTrips() {
      try {
        const res = await fetch("/api/trips");
        if (res.ok) {
          const data = await res.json();
          setTrips(data.trips || []);
        }
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, []);

  if (loading) return <LoadingSkeleton variant="page" />;

  if (!authenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight mb-4">Minhas Viagens</h1>
        <p className="text-muted-foreground mb-6">
          Faça login para ver suas viagens salvas
        </p>
        <Link href="/api/auth/signin" className={cn(buttonVariants())}>
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Minhas Viagens</h1>
          <Link href="/planejar" className={cn(buttonVariants())}>
            <Plus className="mr-1 h-4 w-4" />
            Criar nova viagem
          </Link>
        </div>

        {trips.length === 0 ? (
          <EmptyState
            title="Nenhuma viagem salva"
            description="Comece planejando sua primeira viagem pela Europa."
            action={{ label: "Criar nova viagem", onClick: () => router.push("/planejar") }}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <Link key={trip.id} href={`/viagens/${trip.id}`}>
                <Card className="transition-shadow hover:shadow-lg cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="text-lg">{trip.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {new Date(trip.startDate).toLocaleDateString("pt-BR")} -{" "}
                      {new Date(trip.endDate).toLocaleDateString("pt-BR")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {(trip.cities || []).slice(0, 4).map((city: string) => (
                        <Badge key={city} variant="outline" className="text-xs">
                          <MapPin className="mr-0.5 h-3 w-3" />
                          {city}
                        </Badge>
                      ))}
                    </div>
                    {trip.status && (
                      <Badge variant={trip.status === "completed" ? "default" : "secondary"}>
                        {trip.status === "completed" ? "Concluída" : trip.status === "draft" ? "Rascunho" : "Planejada"}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
