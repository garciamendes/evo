"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { AI_STAGES } from "@/content/ai";
import { CHALLENGES } from "@/content/challenges";
import { ENGLISH_UNITS } from "@/content/english";
import { HOMEWORK } from "@/content/homework";
import { ROADMAP, dayIsComplete } from "@/content/roadmap";
import { TRACK_LABEL, type Track } from "@/content/types";
import { exportProgress, importProgress, resetProgress, todayKey, useProgress, useToday } from "@/lib/progress";
import { Card, ProgressBar } from "./ui";

/** Monday of the week containing the given YYYY-MM-DD date. */
function startOfWeek(dateKey: string): string {
  const [y, m, d] = dateKey.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return todayKey(date);
}

export function ProgressView() {
  const { completed, studyDays, journal } = useProgress();
  const fileInput = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");

  const daysDone = ROADMAP.filter((d) => dayIsComplete(d, completed)).length;
  const today = useToday();
  const weekStart = today ? startOfWeek(today) : null;
  const studiedThisWeek = weekStart ? studyDays.filter((d) => d >= weekStart).length : 0;

  const activityCount: Record<Track, number> = { programacao: 0, ingles: 0, ia: 0 };
  for (const day of ROADMAP) {
    for (const a of [...day.activities, day.minimum]) {
      if (completed[a.id]) activityCount[a.track] += 1;
    }
  }

  const challengesDone = CHALLENGES.filter((c) => completed[c.id]).length;
  const unitsDone = ENGLISH_UNITS.filter((u) => completed[u.id]).length;
  const stagesDone = AI_STAGES.filter((s) => completed[s.id]).length;
  const homeworkDone = HOMEWORK.filter((h) => h.status === "corrigido").length;

  const milestones = [
    { label: "Primeira semana do roteiro completa", done: ROADMAP.slice(0, 5).every((d) => dayIsComplete(d, completed)) },
    { label: "10 dias de estudo registrados", done: studyDays.length >= 10 },
    { label: "Primeiro desafio de programação concluído", done: challengesDone >= 1 },
    { label: "3 unidades de inglês concluídas", done: unitsDone >= 3 },
    { label: "Etapa 1 de IA concluída", done: Boolean(completed["ai-1"]) },
    { label: "Primeiro dever entregue por Pull Request", done: HOMEWORK.some((h) => h.prUrl) },
    { label: "5 anotações no diário", done: journal.length >= 5 },
    { label: "Roteiro de 30 dias completo", done: daysDone === ROADMAP.length },
  ];

  function download() {
    const blob = new Blob([exportProgress()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `study-hub-progresso-${todayKey()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    if (!window.confirm("Importar substitui todo o progresso deste navegador. Continuar?")) return;
    setMessage(importProgress(await file.text()) ? "Progresso importado." : "Arquivo inválido. Nada foi alterado.");
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-muted">Dias estudados</p>
          <p className="mt-1 text-3xl font-semibold">{studyDays.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Nesta semana</p>
          <p className="mt-1 text-3xl font-semibold">{studiedThisWeek} / 5</p>
        </Card>
        <Card>
          <p className="text-sm text-muted">Deveres corrigidos</p>
          <p className="mt-1 text-3xl font-semibold">{homeworkDone}</p>
        </Card>
      </div>

      <Card>
        <h2 className="font-semibold">Avanço</h2>
        <div className="mt-3 space-y-3">
          <ProgressBar value={daysDone / ROADMAP.length} label={`Roteiro: ${daysDone} de ${ROADMAP.length} dias`} />
          <ProgressBar value={challengesDone / CHALLENGES.length} label={`Desafios: ${challengesDone} de ${CHALLENGES.length}`} />
          <ProgressBar value={unitsDone / ENGLISH_UNITS.length} label={`Inglês: ${unitsDone} de ${ENGLISH_UNITS.length} unidades`} />
          <ProgressBar value={stagesDone / AI_STAGES.length} label={`IA: ${stagesDone} de ${AI_STAGES.length} etapas`} />
        </div>
        <p className="mt-4 text-sm text-muted">
          Atividades do roteiro concluídas:{" "}
          {(Object.keys(activityCount) as Track[]).map((t) => `${TRACK_LABEL[t]} ${activityCount[t]}`).join(" · ")}
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold">Marcos</h2>
        <ul className="mt-2 space-y-1.5 text-sm">
          {milestones.map((m) => (
            <li key={m.label} className={m.done ? "text-success" : "text-muted"}>
              {m.done ? "✓" : "○"} {m.label}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted">
          O progresso de verdade é medido nas correções: o que você implementa sozinho, explica e testa.
        </p>
      </Card>

      <Card>
        <h2 className="font-semibold">Seus dados</h2>
        <p className="mt-1 text-sm text-muted">
          O progresso fica salvo só neste navegador. Exporte um arquivo para guardar uma cópia ou levar para outro aparelho.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={download} className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-foreground">
            Exportar
          </button>
          <button type="button" onClick={() => fileInput.current?.click()} className="rounded-md border border-border px-3 py-1.5 text-sm">
            Importar
          </button>
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Apagar todo o progresso deste navegador?")) {
                resetProgress();
                setMessage("Progresso apagado.");
              }
            }}
            className="rounded-md border border-border px-3 py-1.5 text-sm text-muted"
          >
            Apagar tudo
          </button>
          <input ref={fileInput} type="file" accept="application/json" onChange={upload} className="hidden" />
        </div>
        {message && (
          <p role="status" className="mt-2 text-sm">
            {message}
          </p>
        )}
      </Card>
    </div>
  );
}
