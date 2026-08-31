import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { MobileNav } from "./mobile-nav";
import { Providers } from "./providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://roteiro-europa.vercel.app"),
  title: {
    default: "Roteiro Europa - Planejador de Viagens para a Europa",
    template: "%s | Roteiro Europa",
  },
  description:
    "Planeje sua viagem pela Europa com roteiros personalizados, passagens aereas e dicas praticas. Gratuito e pensado para familias brasileiras.",
  keywords: [
    "viagem europa",
    "roteiro europa",
    "passagens aereas europa",
    "planejador viagem",
    "roteiro personalizado",
    "ferias europa",
  ],
  openGraph: {
    locale: "pt_BR",
    type: "website",
    siteName: "Roteiro Europa",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <Providers>
        {/* Header / Navigation */}
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <Link href="/" className="text-lg font-bold text-indigo-600">
              Roteiro Europa
            </Link>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="/planejar" className="text-muted-foreground transition-colors hover:text-foreground">
                Planejar
              </Link>
              <Link href="/#destinos" className="text-muted-foreground transition-colors hover:text-foreground">
                Destinos
              </Link>
              <Link href="/viagens" className="text-muted-foreground transition-colors hover:text-foreground">
                Minhas Viagens
              </Link>
              <Link href="/passagens" className="text-muted-foreground transition-colors hover:text-foreground">
                Passagens
              </Link>
              <Link href="/configuracoes" className="text-muted-foreground transition-colors hover:text-foreground">
                Configurações
              </Link>
            </nav>

            {/* Mobile hamburger */}
            <MobileNav />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 flex flex-col">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
