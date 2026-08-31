import type { Metadata } from "next";
import { LoginContent } from "./login-content";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Faca login para salvar seus roteiros de viagem.",
};

export default function LoginPage() {
  return <LoginContent />;
}
