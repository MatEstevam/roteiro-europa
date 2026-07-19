import Link from "next/link";
import { MapPin, Plane, ChevronRight, Star, Globe, Calendar } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { HeroCarousel } from "./hero-carousel";

const DESTINATIONS = [
  { name: "Paris", slug: "paris", country: "Franca", description: "A cidade luz espera por voce" },
  { name: "Roma", slug: "roma", country: "Italia", description: "Onde a historia ganha vida" },
  { name: "Lisboa", slug: "lisboa", country: "Portugal", description: "Charme a beira do Atlantico" },
  { name: "Barcelona", slug: "barcelona", country: "Espanha", description: "Arte, praia e cultura vibrante" },
  { name: "Amsterdam", slug: "amsterdam", country: "Holanda", description: "Canais, museus e liberdade" },
  { name: "Praga", slug: "praga", country: "Rep. Tcheca", description: "A cidade dos cem campanarios" },
];

const STATS = [
  { value: "50+", label: "Cidades mapeadas" },
  { value: "500+", label: "Atracoes turisticas" },
  { value: "100%", label: "Gratuito para usar" },
];

export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section with Carousel */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        <HeroCarousel />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent z-10" />

        {/* Content */}
        <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-sm mb-6">
              <Globe className="h-4 w-4" />
              <span>Planejador de viagens para a Europa</span>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Sua proxima
              <span className="block mt-2 bg-gradient-to-r from-blue-300 to-indigo-300 bg-clip-text text-transparent">
                aventura europeia
              </span>
              comeca aqui
            </h1>

            <p className="mt-6 text-lg text-white/80 leading-relaxed max-w-xl">
              Crie roteiros personalizados, descubra atracoes incriveis e encontre as melhores passagens.
              Tudo de forma simples, visual e pensado para familias brasileiras.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href="/planejar"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "text-lg px-8 py-7 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold shadow-xl shadow-indigo-500/25 border-0"
                )}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Planejar minha viagem
              </Link>
              <Link
                href="/passagens"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "text-lg px-8 py-7 border-2 border-white/60 text-white bg-white/10 backdrop-blur-sm hover:bg-white/20"
                )}
              >
                <Plane className="mr-2 h-5 w-5" />
                Buscar passagens
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex gap-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Destinos que fazem seus olhos
              <span className="text-indigo-600"> brilhar</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Das ruas de Paris as praias de Lisboa, criamos roteiros para os destinos mais desejados da Europa
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {DESTINATIONS.map((dest) => (
              <Link key={dest.name} href={`/destinos/${dest.slug}`}>
                <Card
                  className="group relative overflow-hidden border-0 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-blue-600/5 group-hover:from-indigo-600/10 group-hover:to-blue-600/10 transition-all duration-500" />
                  <CardContent className="relative p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-indigo-600 transition-colors">
                          {dest.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">{dest.country}</p>
                        <p className="mt-2 text-sm">{dest.description}</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 py-20 bg-gradient-to-b from-zinc-50 to-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Simples como contar ate 3
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Sem complicacao. Voce responde, a gente monta.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Conte seus planos",
                description: "Datas, destinos, quem vai viajar e o que gostam de fazer. Um assistente simples te guia.",
                icon: "✈️",
              },
              {
                step: "2",
                title: "Receba o roteiro",
                description: "Em segundos, um roteiro completo com atracoes, horarios, custos e dicas praticas.",
                icon: "🗺️",
              },
              {
                step: "3",
                title: "Viaje tranquilo",
                description: "Salve, compartilhe com a familia e adapte conforme quiser. A viagem e sua.",
                icon: "🌟",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center p-8 rounded-2xl bg-white shadow-sm hover:shadow-lg transition-shadow">
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-2">
          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-600 to-blue-700 text-white">
            <CardContent className="p-8 md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-6">
                <MapPin className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Roteiro Inteligente</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                Nosso algoritmo distribui os dias de forma equilibrada, respeita seu ritmo e organiza as atracoes por proximidade. Com horarios, custos e dicas de reserva.
              </p>
              <Link
                href="/planejar"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-indigo-700 hover:bg-blue-50 font-semibold"
                )}
              >
                Criar meu roteiro
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-slate-700 to-slate-900 text-white">
            <CardContent className="p-8 md:p-10">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm mb-6">
                <Plane className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">Passagens Comparadas</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Compare precos entre aeroportos, veja qual tem o melhor custo-beneficio e descubra se vale a pena sair de outra cidade. Tudo transparente.
              </p>
              <Link
                href="/passagens"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-slate-800 hover:bg-slate-100 font-semibold"
                )}
              >
                Pesquisar voos
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Testimonial / Trust */}
      <section className="px-6 py-16 bg-zinc-50">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-5 w-5 fill-indigo-400 text-indigo-400" />
            ))}
          </div>
          <blockquote className="text-xl italic text-zinc-700 leading-relaxed">
            &ldquo;Nunca tinha viajado para a Europa e nao sabia por onde comecar.
            Em 5 minutos ja tinha um roteiro completo com tudo que precisava saber.&rdquo;
          </blockquote>
          <p className="mt-4 text-sm text-muted-foreground">&mdash; Familia planejando a primeira viagem</p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-6 py-20 bg-gradient-to-br from-indigo-900 via-blue-900 to-indigo-800 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Pronto para planejar?
          </h2>
          <p className="mt-4 text-lg text-blue-200">
            E gratis, rapido e nao precisa criar conta para comecar.
          </p>
          <Link
            href="/planejar"
            className={cn(
              buttonVariants({ size: "lg" }),
              "mt-8 text-lg px-10 py-7 bg-gradient-to-r from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 text-white font-semibold shadow-xl shadow-indigo-500/25 border-0"
            )}
          >
            Comecar agora &mdash; e gratis
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-sm text-muted-foreground bg-white">
        <p>
          Roteiro Europa &mdash; Ferramenta de planejamento de viagens.
          Os precos e disponibilidades sao estimativas e podem variar.
        </p>
      </footer>
    </div>
  );
}
