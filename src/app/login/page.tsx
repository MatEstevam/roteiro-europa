"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plane } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;

    if (isRegister && password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      name: isRegister ? name : undefined,
      isRegister: isRegister ? "true" : "false",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        isRegister
          ? "Erro ao criar conta. O email pode ja estar em uso."
          : "Email ou senha incorretos."
      );
    } else {
      router.push("/viagens");
      router.refresh();
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-blue-100 mb-4">
            <Plane className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isRegister ? "Criar conta" : "Entrar"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isRegister
              ? "Crie sua conta para salvar viagens"
              : "Acesse suas viagens salvas"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Nome
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required={isRegister}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Seu nome"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              minLength={6}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Minimo 6 caracteres"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-gradient-to-r from-indigo-500 to-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:from-indigo-600 hover:to-blue-700 disabled:opacity-50 transition-all"
          >
            {loading
              ? "Aguarde..."
              : isRegister
                ? "Criar conta"
                : "Entrar"}
          </button>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setError("");
            }}
            className="text-indigo-600 hover:text-indigo-800 font-medium"
          >
            {isRegister
              ? "Ja tem conta? Entrar"
              : "Nao tem conta? Criar uma"}
          </button>
        </div>
      </div>
    </div>
  );
}
