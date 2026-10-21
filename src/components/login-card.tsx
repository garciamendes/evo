"use client";

import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/session";
import { Card } from "./ui";

const ERRORS: Record<string, string> = {
  "nao-autorizado": "Esta conta do GitHub não tem acesso a este Study Hub.",
  "estado-invalido": "O login expirou ou foi interrompido. Tente de novo.",
  github: "O GitHub não confirmou o login. Tente de novo.",
  "nao-configurado": "O login ainda não foi configurado neste ambiente.",
};

export function LoginCard() {
  const error = useSearchParams().get("erro");
  const session = useSession();

  return (
    <Card className="max-w-md">
      {error && (
        <p role="alert" className="mb-3 text-sm text-red-600 dark:text-red-400">
          {ERRORS[error] ?? "Não foi possível entrar."}
        </p>
      )}
      {session.status === "ready" && session.login ? (
        <p className="text-sm">Você já está conectado como @{session.login}.</p>
      ) : session.status === "ready" && !session.configured ? (
        <p className="text-sm text-muted">O login ainda não foi configurado. Veja o README do projeto.</p>
      ) : (
        <>
          <a
            href="/api/auth/login"
            className="block rounded-md bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground"
          >
            Entrar com GitHub
          </a>
          <p className="mt-3 text-xs text-muted">
            O login só confirma quem você é. Ele não dá ao site acesso aos seus repositórios.
          </p>
        </>
      )}
    </Card>
  );
}
