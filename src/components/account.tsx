"use client";

import Link from "next/link";
import { useSession, useSyncStatus } from "@/lib/session";

const SYNC_LABEL = {
  idle: "",
  saving: "Salvando…",
  saved: "Progresso salvo ✓",
  error: "Erro ao salvar o progresso",
} as const;

export function Account({ onNavigate }: { onNavigate?: () => void }) {
  const session = useSession();
  const sync = useSyncStatus();

  if (session.status === "loading" || !session.configured) return null;

  if (!session.login) {
    return (
      <Link
        href="/entrar"
        onClick={onNavigate}
        className="block rounded-md border border-border px-3 py-2 text-center text-sm font-medium"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="space-y-1 px-1 text-sm">
      <p className="font-medium">@{session.login}</p>
      {SYNC_LABEL[sync] && (
        <p className={`text-xs ${sync === "error" ? "text-red-600 dark:text-red-400" : "text-muted"}`}>{SYNC_LABEL[sync]}</p>
      )}
      <form action="/api/auth/logout" method="post">
        <button type="submit" className="text-xs text-muted underline-offset-2 hover:underline">
          Sair
        </button>
      </form>
    </div>
  );
}
