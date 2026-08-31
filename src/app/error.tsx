"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
      <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">Algo deu errado</h2>
      <p className="text-muted-foreground mb-6 text-center max-w-md">
        Ocorreu um erro inesperado. Tente novamente ou volte para a pagina inicial.
      </p>
      <div className="flex gap-3">
        <Button onClick={reset} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
        <Link href="/">
          <Button>
            <Home className="mr-2 h-4 w-4" />
            Pagina inicial
          </Button>
        </Link>
      </div>
    </div>
  );
}
