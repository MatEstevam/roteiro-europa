import type { Metadata } from "next";
import { TripViewContent } from "./trip-view-content";

export const metadata: Metadata = {
  title: "Meu Roteiro",
};

export default function TripViewPage() {
  return <TripViewContent />;
}
