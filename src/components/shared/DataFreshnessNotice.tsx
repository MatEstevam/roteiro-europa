import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AlertTriangle, Info } from "lucide-react";

type DataFreshnessNoticeProps = {
  lastUpdated?: string;
  isDemo?: boolean;
  showDisclaimer?: boolean;
};

export function DataFreshnessNotice({
  lastUpdated,
  isDemo,
  showDisclaimer = true,
}: DataFreshnessNoticeProps) {
  return (
    <div className="space-y-2 text-xs text-muted-foreground">
      {/* Freshness info */}
      <div className="flex items-center gap-1.5">
        <Info className="h-3 w-3 shrink-0" />
        {isDemo ? (
          <span>Dados de demonstração</span>
        ) : lastUpdated ? (
          <span>
            Atualizado em{" "}
            {format(new Date(lastUpdated), "dd/MM/yyyy 'às' HH:mm", {
              locale: ptBR,
            })}
          </span>
        ) : (
          <span>Data de atualização indisponível</span>
        )}
      </div>

      {/* Disclaimer */}
      {showDisclaimer && (
        <div className="flex items-start gap-1.5 p-2 rounded bg-muted/50">
          <AlertTriangle className="h-3 w-3 shrink-0 mt-0.5 text-yellow-600" />
          <span>
            Valores, horários e disponibilidade podem mudar. Confirme as
            informações nos sites oficiais antes da viagem.
          </span>
        </div>
      )}
    </div>
  );
}
