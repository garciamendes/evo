"use client";

import { useState, type FormEvent } from "react";
import { addJournalEntry, removeJournalEntry, useProgress, type JournalKind } from "@/lib/progress";
import { Card } from "./ui";

const KINDS: { value: JournalKind; label: string }[] = [
  { value: "aprendizado", label: "Aprendizado" },
  { value: "dificuldade", label: "Dificuldade" },
  { value: "pergunta", label: "Pergunta" },
  { value: "nota", label: "Nota" },
];

const KIND_LABEL = Object.fromEntries(KINDS.map((k) => [k.value, k.label])) as Record<JournalKind, string>;

export function Journal() {
  const { journal } = useProgress();
  const [kind, setKind] = useState<JournalKind>("aprendizado");
  const [text, setText] = useState("");
  const [filter, setFilter] = useState<JournalKind | "todas">("todas");

  function submit(event: FormEvent) {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    addJournalEntry(kind, trimmed);
    setText("");
  }

  const entries = filter === "todas" ? journal : journal.filter((e) => e.kind === filter);

  return (
    <div className="space-y-4">
      <Card>
        <form onSubmit={submit} className="space-y-3">
          <fieldset>
            <legend className="mb-1.5 text-sm font-medium">Tipo</legend>
            <div className="flex flex-wrap gap-2">
              {KINDS.map((k) => (
                <label
                  key={k.value}
                  className={`cursor-pointer rounded-md border px-3 py-1.5 text-sm ${
                    kind === k.value ? "border-accent bg-accent/10 text-accent" : "border-border text-muted"
                  }`}
                >
                  <input
                    type="radio"
                    name="kind"
                    value={k.value}
                    checked={kind === k.value}
                    onChange={() => setKind(k.value)}
                    className="sr-only"
                  />
                  {k.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div>
            <label htmlFor="journal-text" className="mb-1.5 block text-sm font-medium">
              O que você quer registrar?
            </label>
            <textarea
              id="journal-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              className="w-full rounded-lg border border-border bg-background p-3 text-sm"
              placeholder="Ex.: hoje entendi por que DecimalField é melhor que FloatField para dinheiro."
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-foreground disabled:opacity-50"
          >
            Salvar
          </button>
        </form>
      </Card>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <span className="text-muted">Mostrar:</span>
        {(["todas", ...KINDS.map((k) => k.value)] as const).map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`rounded-md px-2.5 py-1 ${filter === value ? "bg-surface-muted font-medium" : "text-muted"}`}
          >
            {value === "todas" ? "Todas" : KIND_LABEL[value]}
          </button>
        ))}
      </div>

      {entries.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma anotação ainda.</p>
      ) : (
        <ul className="space-y-3">
          {entries.map((entry) => (
            <li key={entry.id}>
              <Card>
                <div className="flex items-center justify-between gap-2 text-xs text-muted">
                  <span>
                    {entry.date.split("-").reverse().join("/")} · {KIND_LABEL[entry.kind]}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm("Apagar esta anotação?")) removeJournalEntry(entry.id);
                    }}
                    className="hover:text-foreground"
                  >
                    Apagar
                  </button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">{entry.text}</p>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
