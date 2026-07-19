"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Fechar menu" : "Abrir menu"}
      >
        {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {open && (
        <div className="absolute left-0 top-14 w-full border-b bg-white p-4 shadow-lg">
          <nav className="flex flex-col gap-3 text-sm font-medium">
            <Link
              href="/planejar"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Planejar
            </Link>
            <Link
              href="/viagens"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Minhas Viagens
            </Link>
            <Link
              href="/passagens"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Passagens
            </Link>
            <Link
              href="/configuracoes"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              Configurações
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
