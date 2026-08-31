import Link from "next/link";
import { MapPin, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <MapPin className="h-12 w-12 text-indigo-400 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Pagina nao encontrada</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Parece que essa pagina nao existe ou foi movida. Que tal planejar uma viagem?
      </p>
      <Link href="/">
        <Button>
          <Home className="mr-2 h-4 w-4" />
          Voltar ao inicio
        </Button>
      </Link>
    </div>
  );
}
