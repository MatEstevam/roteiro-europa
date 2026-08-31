import type { Metadata } from "next";
import { ViagensContent } from "./viagens-content";

export const metadata: Metadata = {
  title: "Minhas Viagens",
  description:
    "Acesse seus roteiros salvos e continue planejando sua viagem pela Europa.",
};

export default function ViagensPage() {
  return <ViagensContent />;
}
