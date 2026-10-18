"use client";

import Link from "next/link";
import { HOMEWORK } from "@/content/homework";
import { ROADMAP, currentDay, dayIsComplete } from "@/content/roadmap";
import { setMode, useProgress, useToday } from "@/lib/progress";
import { ActivityItem } from "./interactive";
import { Card, ProgressBar } from "./ui";

export function Dashboard() {
  const { completed, mode, studyDays } = useProgress();
  const day = currentDay(completed);
  const daysDone = ROADMAP.filter((d) => dayIsComplete(d, completed)).length;
  const openHomework = HOMEWORK.filter((h) => h.status === "aberto");
  const today = useToday();
  const studiedToday = today !== null && studyDays.includes(today);

  if (!day) {
    return (
      <Card>
        <h2 className="text-lg font-semibold">Roteiro de 30 dias concluído 🎉</h2>
        <p className="mt-1 text-sm text-muted">
          Faça a retrospectiva na página de progresso. O próximo roteiro vem na próxima sessão.
        </p>
      </Card>
    );
  }

  const activities = mode === "minimo" ? [day.minimum] : day.activities;
  const doneCount = activities.filter((a) => completed[a.id]).length;
  const minutes = activities.reduce((sum, a) => sum + a.minutes, 0);
  const minimumDone = Boolean(completed[day.minimum.id]);

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm text-muted">
              Dia {day.day} de {ROADMAP.length} · Semana {day.week}
            </p>
            <h2 className="text-xl font-semibold">{day.focus}</h2>
            <p className="mt-1 text-sm text-muted">
              Cerca de {minutes} min · {doneCount} de {activities.length} concluídas
            </p>
          </div>
          <div role="group" aria-label="Modo de estudo" className="flex rounded-lg border border-border p-0.5 text-sm">
            {(["normal", "minimo"] as const).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={mode === m}
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1.5 ${mode === m ? "bg-accent text-accent-foreground" : "text-muted"}`}
              >
                {m === "normal" ? "Normal" : "Mínimo"}
              </button>
            ))}
          </div>
        </div>

        {mode === "minimo" && (
          <p className="mt-3 rounded-lg bg-surface-muted p-3 text-sm">
            Dia cansativo? Uma tarefa pequena já conta. O roteiro espera por você aqui, sem atraso e sem culpa.
          </p>
        )}

        <ul className="mt-2 divide-y divide-border">
          {activities.map((activity) => (
            <ActivityItem key={activity.id} activity={activity} />
          ))}
        </ul>

        {mode === "minimo" && minimumDone && (
          <p className="mt-2 text-sm text-success">Dia mínimo registrado. Amanhã você continua deste ponto.</p>
        )}
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="font-semibold">Progresso do roteiro</h2>
          <div className="mt-3 space-y-3">
            <ProgressBar value={daysDone / ROADMAP.length} label={`${daysDone} de ${ROADMAP.length} dias completos`} />
            <p className="text-sm text-muted">
              {studiedToday ? "Você já estudou hoje. ✓" : "Ainda não estudou hoje. Comece pela primeira tarefa."}
            </p>
          </div>
        </Card>
        <Card>
          <h2 className="font-semibold">Dever de casa</h2>
          {openHomework.length === 0 ? (
            <p className="mt-2 text-sm text-muted">Nenhum dever aberto.</p>
          ) : (
            <ul className="mt-2 space-y-1 text-sm">
              {openHomework.map((h) => (
                <li key={h.id}>
                  <Link href={`/deveres#${h.id}`} className="text-accent underline-offset-2 hover:underline">
                    Dever {String(h.number).padStart(2, "0")}: {h.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <p className="text-xs text-muted">
        Seu progresso fica salvo neste navegador e não sincroniza com outros aparelhos. Para levar para outro aparelho,
        use exportar e importar na página de <Link href="/progresso" className="underline">progresso</Link>.
      </p>
    </div>
  );
}
