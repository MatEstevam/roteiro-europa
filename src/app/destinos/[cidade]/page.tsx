import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin, Clock, Globe, Coins, Calendar, Star, ChevronRight, ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { DESTINATIONS_DATA } from "@/lib/demo/destination-data";

type Props = {
  params: Promise<{ cidade: string }>;
};

export function generateStaticParams() {
  return Object.keys(DESTINATIONS_DATA).map((cidade) => ({ cidade }));
}

export async function generateMetadata({ params }: Props) {
  const { cidade } = await params;
  const dest = DESTINATIONS_DATA[cidade];
  if (!dest) return { title: "Destino nao encontrado" };
  return {
    title: `${dest.name}, ${dest.country} - O que conhecer | Roteiro Europa`,
    description: dest.description,
  };
}

const PRICE_LABELS = ["Gratuito", "Barato", "Moderado", "Caro"];
const CATEGORY_COLORS: Record<string, string> = {
  Monumento: "bg-blue-100 text-blue-700",
  Museu: "bg-purple-100 text-purple-700",
  Igreja: "bg-slate-100 text-slate-700",
  Palacio: "bg-amber-100 text-amber-800",
  Parque: "bg-emerald-100 text-emerald-700",
  Bairro: "bg-rose-100 text-rose-700",
  Gastronomia: "bg-orange-100 text-orange-700",
  Praia: "bg-cyan-100 text-cyan-700",
  Castelo: "bg-indigo-100 text-indigo-700",
  Praca: "bg-teal-100 text-teal-700",
  Passeio: "bg-sky-100 text-sky-700",
  Arte: "bg-fuchsia-100 text-fuchsia-700",
  Esporte: "bg-green-100 text-green-700",
};

export default async function DestinoPage({ params }: Props) {
  const { cidade } = await params;
  const dest = DESTINATIONS_DATA[cidade];

  if (!dest) notFound();

  return (
    <div className="flex-1">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-700 via-blue-700 to-indigo-800">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)" }} />

        <div className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-blue-200 hover:text-white transition-colors mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar para destinos
          </Link>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-blue-200 text-sm font-medium uppercase tracking-wider mb-2">{dest.country}</p>
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                {dest.name}
              </h1>
            </div>

            <p className="text-lg text-blue-100/90 max-w-3xl leading-relaxed">
              {dest.description}
            </p>

            <div className="flex flex-wrap gap-2 mt-2">
              {dest.highlights.map((h) => (
                <Badge key={h} className="border-0 bg-white/15 text-white backdrop-blur-sm">
                  {h}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Melhor epoca</p>
                <p className="text-sm font-medium">{dest.bestTimeToVisit}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100">
                <Clock className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tempo sugerido</p>
                <p className="text-sm font-medium">{dest.averageDays}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100">
                <Globe className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Idioma</p>
                <p className="text-sm font-medium">{dest.language}</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-100">
                <Coins className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Moeda</p>
                <p className="text-sm font-medium">{dest.currency}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Attractions */}
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            O que conhecer em {dest.name}
          </h2>
          <p className="mt-2 text-muted-foreground">
            As principais atracoes para incluir no seu roteiro
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {dest.attractions.map((attraction) => (
            <Card
              key={attraction.id}
              className="group overflow-hidden border-0 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              {/* Image placeholder */}
              <div className="relative h-40 bg-gradient-to-br from-slate-200 to-slate-300 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                  <MapPin className="h-8 w-8" />
                </div>
                {/* Category badge */}
                <div className="absolute top-2 left-2">
                  <Badge className={cn("text-xs font-medium border-0", CATEGORY_COLORS[attraction.category] || "bg-gray-100 text-gray-700")}>
                    {attraction.category}
                  </Badge>
                </div>
                {/* Rating */}
                <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium">{attraction.rating}</span>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-sm group-hover:text-indigo-600 transition-colors line-clamp-1">
                  {attraction.name}
                </h3>
                <p className="mt-1.5 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {attraction.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    {PRICE_LABELS[attraction.priceLevel]}
                  </span>
                  <div className="flex gap-1">
                    {attraction.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="border-t bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
            Quer incluir {dest.name} no seu roteiro?
          </h2>
          <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
            Crie um roteiro personalizado e veja como encaixar {dest.name} na sua viagem pela Europa.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/planejar"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white shadow-lg shadow-indigo-500/20 border-0"
              )}
            >
              Planejar viagem com {dest.name}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/passagens"
              className={cn(
                buttonVariants({ size: "lg", variant: "outline" }),
              )}
            >
              Buscar passagens
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
