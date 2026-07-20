"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Calendar, Globe, LogIn, MapPin, Plane, Plus, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: {
    label: "Concluida",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
  },
  draft: {
    label: "Rascunho",
    className: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700",
  },
  planned: {
    label: "Planejada",
    className: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
  },
};

const cardAccents = [
  "from-indigo-400 to-blue-500",
  "from-rose-400 to-pink-500",
  "from-violet-400 to-purple-500",
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-fuchsia-400 to-rose-500",
];

export default function ViagensPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const authenticated = status === "authenticated";

  useEffect(() => {
    if (status === "loading") return;
    if (!authenticated) {
      setLoading(false);
      return;
    }

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
  }, [status, authenticated]);

  if (loading) return <LoadingSkeleton variant="page" />;

  if (!authenticated) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
        <div className="relative mb-8">
          <div className="absolute inset-0 blur-3xl opacity-20 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full" />
          <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 dark:from-indigo-900/30 dark:to-blue-900/30 border border-indigo-200 dark:border-indigo-800">
            <Plane className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3 bg-gradient-to-r from-indigo-600 to-blue-600 dark:from-indigo-400 dark:to-blue-400 bg-clip-text text-transparent">
          Minhas Viagens
        </h1>
        <p className="text-muted-foreground mb-8 max-w-sm text-lg">
          Faca login para ver suas viagens salvas e continuar planejando suas aventuras
        </p>
        <Link
          href="/login"
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 border-0"
          )}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-slate-50 dark:from-indigo-950/40 dark:via-blue-950/30 dark:to-slate-950/20 border-b border-indigo-100 dark:border-indigo-900/50">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PHBhdGggZD0iTTAgMGg2MHY2MEgweiIgZmlsbD0ibm9uZSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9InJnYmEoMjQ1LDE1OCwxMSwwLjEpIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI2EpIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIi8+PC9zdmc+')] opacity-60" />
        <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-medium text-indigo-700 dark:text-indigo-400 uppercase tracking-wider">
                  Suas aventuras
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Minhas Viagens
              </h1>
              <p className="mt-2 text-muted-foreground">
                {trips.length > 0
                  ? `${trips.length} ${trips.length === 1 ? "viagem" : "viagens"} planejadas`
                  : "Comece a explorar o mundo"}
              </p>
            </div>
            <Link
              href="/planejar"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 border-0"
              )}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Nova viagem
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {trips.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="relative mb-8">
              <div className="absolute inset-0 blur-3xl opacity-15 bg-gradient-to-r from-indigo-400 to-blue-500 rounded-full scale-150" />
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-2 border-dashed border-indigo-300 dark:border-indigo-700">
                <Sparkles className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
              </div>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">
              Nenhuma viagem salva
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md text-base">
              Comece planejando sua primeira viagem pela Europa. Vamos criar um roteiro incrivel para voce!
            </p>
            <button
              onClick={() => router.push("/planejar")}
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/25 border-0"
              )}
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Criar primeira viagem
            </button>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip, index) => {
              const accent = cardAccents[index % cardAccents.length];
              const status = statusConfig[trip.status] || statusConfig.planned;

              return (
                <Link key={trip.id} href={`/viagens/${trip.id}`}>
                  <Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer h-full border-0 shadow-md">
                    {/* Top gradient accent bar */}
                    <div className={cn("absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r", accent)} />

                    <CardHeader className="pt-6 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-lg font-semibold group-hover:text-indigo-700 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                          {trip.title}
                        </CardTitle>
                        {trip.status && (
                          <Badge
                            variant="outline"
                            className={cn("shrink-0 text-[11px] font-medium", status.className)}
                          >
                            {status.label}
                          </Badge>
                        )}
                      </div>
                      <CardDescription className="flex items-center gap-1.5 mt-2">
                        <Calendar className="h-3.5 w-3.5 text-indigo-600/70 dark:text-indigo-400/70" />
                        <span>
                          {new Date(trip.startDate).toLocaleDateString("pt-BR")} -{" "}
                          {new Date(trip.endDate).toLocaleDateString("pt-BR")}
                        </span>
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="pb-5">
                      <div className="flex flex-wrap gap-1.5">
                        {(trip.cities || []).slice(0, 4).map((city: any) => {
                          const cityName = typeof city === "string" ? city : city.city;
                          return (
                          <Badge
                            key={cityName}
                            variant="outline"
                            className="text-xs bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                          >
                            <MapPin className="mr-0.5 h-3 w-3 text-indigo-500" />
                            {cityName}
                          </Badge>
                          );
                        })}
                        {(trip.cities || []).length > 4 && (
                          <Badge
                            variant="outline"
                            className="text-xs bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700"
                          >
                            +{(trip.cities || []).length - 4}
                          </Badge>
                        )}
                      </div>
                    </CardContent>

                    {/* Subtle hover overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
