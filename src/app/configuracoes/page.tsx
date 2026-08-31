import type { Metadata } from "next";
import { ConfiguracoesContent } from "./configuracoes-content";

export const metadata: Metadata = {
  title: "Configuracoes",
  description:
    "Configure suas preferencias de viagem, aeroporto padrao e moeda.",
};

export default function ConfiguracoesPage() {
  return <ConfiguracoesContent />;
}
