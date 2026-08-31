import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-1 items-center justify-center py-20">
      <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      <span className="ml-3 text-muted-foreground">Carregando roteiro...</span>
    </div>
  );
}
