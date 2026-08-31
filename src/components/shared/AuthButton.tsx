"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, LogOut, User } from "lucide-react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-8 w-16 animate-pulse rounded bg-gray-200" />;
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="hidden text-sm text-muted-foreground sm:inline-flex items-center gap-1">
          <User className="h-3.5 w-3.5" />
          {session.user.name || session.user.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut()}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-1 h-4 w-4" />
          Sair
        </Button>
      </div>
    );
  }

  return (
    <Link href="/login">
      <Button variant="default" size="sm" className="bg-indigo-600 hover:bg-indigo-700">
        <LogIn className="mr-1 h-4 w-4" />
        Entrar
      </Button>
    </Link>
  );
}
