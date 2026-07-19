"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Algo deu errado",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-4">
        <AlertTriangle className="h-8 w-8 text-orange-500" />
      </div>
      <h3 className="text-lg font-semibold text-orange-700 mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm mb-4">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          Tentar novamente
        </Button>
      )}
    </div>
  );
}
