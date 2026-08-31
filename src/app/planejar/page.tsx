import type { Metadata } from "next";
import { PlanejarContent } from "./planejar-content";

export const metadata: Metadata = {
  title: "Planejar Viagem",
  description:
    "Crie seu roteiro personalizado para a Europa em poucos minutos. Escolha datas, destinos e preferencias.",
};

export default function PlanejarPage() {
  return <PlanejarContent />;
}
