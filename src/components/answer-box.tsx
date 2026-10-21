"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { isCorrected, type Answer, type AnswerView } from "@/lib/answers";
import { useSession } from "@/lib/session";
import { Markdown } from "./markdown";
import { MarkdownEditor } from "./markdown-editor";

type Props = { id: string; title: string; prompt?: string };

export function AnswerBox({ id, title, prompt }: Props) {
  const session = useSession();
  const login = session.status === "ready" ? session.login : null;

  if (session.status === "loading") return null;
  if (!session.configured) return null;
  if (!login) {
    return (
      <p className="mt-4 rounded-lg border border-dashed border-border p-3 text-sm text-muted">
        <Link href="/entrar" className="text-accent underline-offset-2 hover:underline">
          Entre
        </Link>{" "}
        para responder aqui e receber a correção no site.
      </p>
    );
  }
  return <AnswerEditor key={id} id={id} title={title} prompt={prompt} />;
}

function AnswerEditor({ id, title, prompt }: Props) {
  const [view, setView] = useState<AnswerView | null>(null);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/answers/${id}`, { cache: "no-store" })
      .then(async (res) => {
        if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error ?? "Erro ao carregar.");
        return res.json() as Promise<AnswerView>;
      })
      .then((data) => {
        if (cancelled) return;
        setView(data);
        setText(data.answer?.answer ?? "");
      })
      .catch((e: Error) => !cancelled && setError(e.message));
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function save(submit: boolean) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch(`/api/answers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, answer: text, submit }),
      });
      const data = (await res.json()) as { answer?: Answer; error?: string };
      if (!res.ok || !data.answer) throw new Error(data.error ?? "Erro ao salvar.");
      setView((v) => ({ feedback: v?.feedback ?? null, feedbackRevision: v?.feedbackRevision ?? null, answer: data.answer! }));
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const answer = view?.answer ?? null;
  const dirty = text.trim() !== (answer?.answer ?? "");
  const corrected = isCorrected(answer, view?.feedback ?? null, view?.feedbackRevision ?? null);
  // A submitted answer can only be sent again after it changes; otherwise it would just queue the same text twice.
  const alreadySent = answer?.status === "enviado" && !dirty;

  let status = "Ainda não respondido.";
  if (answer?.status === "rascunho") status = "Rascunho salvo. Envie quando quiser a correção.";
  if (answer?.status === "enviado") {
    status = corrected
      ? `Corrigido (revisão ${answer.revision}).`
      : `Enviado (revisão ${answer.revision}), aguardando correção.`;
  }

  return (
    <div className="mt-4 rounded-lg border border-border p-3">
      <label htmlFor={`answer-${id}`} className="text-sm font-semibold">
        Sua resposta
      </label>
      {prompt && <p className="mt-0.5 text-xs text-muted">{prompt}</p>}
      {view === null && !error ? (
        <p className="mt-2 text-sm text-muted">Carregando…</p>
      ) : (
        <>
          <div className="mt-2">
            <MarkdownEditor
              id={`answer-${id}`}
              value={text}
              onChange={setText}
              placeholder="Escreva com as suas palavras, sem pedir para uma IA."
            />
          </div>
          <p className="mt-1 text-xs text-muted">
            Use a barra para formatar. Tab indenta o código; Esc e depois Tab sai do editor.
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              disabled={busy || !text.trim() || !dirty}
              onClick={() => save(false)}
              className="rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Salvar rascunho
            </button>
            <button
              type="button"
              disabled={busy || !text.trim() || alreadySent}
              onClick={() => save(true)}
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground disabled:opacity-50"
            >
              {busy ? "Salvando…" : answer?.status === "enviado" ? "Reenviar para correção" : "Enviar para correção"}
            </button>
            <span className="text-xs text-muted" role="status">
              {dirty && answer ? "Alterações não salvas. " : ""}
              {status}
            </span>
          </div>
        </>
      )}
      {error && <p className="mt-2 text-sm text-red-600 dark:text-red-400">{error}</p>}
      {view?.feedback && (
        <div className="mt-3 rounded-lg bg-surface-muted p-3">
          <p className="text-xs font-semibold text-muted">
            Correção{view.feedbackRevision ? ` da revisão ${view.feedbackRevision}` : ""}
          </p>
          <Markdown className="mt-1">{view.feedback}</Markdown>
        </div>
      )}
    </div>
  );
}
