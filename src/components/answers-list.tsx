"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { AnswerSummary } from "@/lib/answers";
import { useSession } from "@/lib/session";
import { Card } from "./ui";

function hrefFor(id: string): string {
  if (id.startsWith("c")) return `/programacao#${id}`;
  if (id.startsWith("e")) return `/ingles#${id}`;
  if (id.startsWith("ai-")) return `/ia#${id}`;
  return "/";
}

export function AnswersList() {
  const session = useSession();
  const login = session.status === "ready" ? session.login : null;
  const [answers, setAnswers] = useState<AnswerSummary[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!login) return;
    let cancelled = false;
    fetch("/api/answers", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<{ answers: AnswerSummary[] }>) : Promise.reject()))
      .then((data) => !cancelled && setAnswers(data.answers))
      .catch(() => !cancelled && setError(true));
    return () => {
      cancelled = true;
    };
  }, [login]);

  if (!login) return null;

  return (
    <Card>
      <h2 className="font-semibold">Suas respostas</h2>
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">Não foi possível carregar as respostas.</p>}
      {!error && answers === null && <p className="mt-2 text-sm text-muted">Carregando…</p>}
      {answers?.length === 0 && <p className="mt-2 text-sm text-muted">Nenhuma resposta ainda.</p>}
      {answers && answers.length > 0 && (
        <ul className="mt-2 divide-y divide-border text-sm">
          {answers.map((a) => (
            <li key={a.id} className="flex flex-wrap items-center justify-between gap-2 py-2">
              <Link href={hrefFor(a.id)} className="text-accent underline-offset-2 hover:underline">
                {a.title}
              </Link>
              <span className="text-xs text-muted">
                {a.status === "rascunho" ? "Rascunho" : a.corrected ? "Corrigido ✓" : "Aguardando correção"}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
