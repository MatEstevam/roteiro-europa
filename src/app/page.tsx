import Link from "next/link";
import { MapPin, Plane } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 py-24 text-center bg-gradient-to-br from-blue-600 to-indigo-700 text-white md:py-32">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Roteiro Europa
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-blue-100 sm:text-xl">
          Planeje sua viagem dos sonhos para a Europa, de forma simples e visual
        </p>
        <Link href="/planejar" className={cn(buttonVariants({ size: "lg" }), "mt-8 text-lg px-8 py-6 bg-white text-indigo-700 hover:bg-blue-50")}>
          Planejar minha viagem
        </Link>
      </section>

      {/* Feature Cards */}
      <section className="flex-1 px-6 py-16 bg-zinc-50">
        <div className="mx-auto grid max-w-4xl gap-6 sm:grid-cols-2">
          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <MapPin className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4">Criar Roteiro</CardTitle>
              <CardDescription>
                Monte um roteiro personalizado com cidades, atividades e estimativas de custo para sua viagem pela Europa.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/planejar" className={cn(buttonVariants({ variant: "outline" }))}>
                Começar agora
              </Link>
            </CardContent>
          </Card>

          <Card className="transition-shadow hover:shadow-lg">
            <CardHeader>
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <Plane className="h-6 w-6" />
              </div>
              <CardTitle className="mt-4">Encontrar Passagens</CardTitle>
              <CardDescription>
                Pesquise e compare passagens aéreas para os principais destinos europeus com os melhores preços.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/passagens" className={cn(buttonVariants({ variant: "outline" }))}>
                Pesquisar voos
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground">
        <p>
          Roteiro Europa &mdash; Ferramenta de planejamento de viagens. Os preços e disponibilidades são estimativas e podem variar.
        </p>
      </footer>
    </div>
  );
}
