import type { Metadata } from "next";
import { PassagensContent } from "./passagens-content";

export const metadata: Metadata = {
  title: "Passagens Aereas",
  description:
    "Compare passagens aereas para a Europa saindo do Brasil. Veja precos, duracoes e conexoes.",
};

export default function PassagensPage() {
  return <PassagensContent />;
}
