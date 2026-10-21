import type { Metadata } from "next";
import { ActivityItem } from "@/components/interactive";
import { Card, PageHeader } from "@/components/ui";
import { ROADMAP, WEEKS } from "@/content/roadmap";
import { TRACK_LABEL, type Track } from "@/content/types";

export const metadata: Metadata = { title: "Roteiro de 30 dias" };

const TRACKS: Track[] = ["programacao", "ingles", "ia"];

export default function RoadmapPage() {
  return (
    <>
      <PageHeader
        title="Roteiro de 30 dias"
        description="6 semanas de 5 dias. Se pular um dia, continue do ponto onde parou."
      />
      <div className="space-y-6">
        {WEEKS.map((week) => (
          <Card key={week.week}>
            <h2 className="text-lg font-semibold">
              Semana {week.week}: {week.title}
            </h2>
            <dl className="mt-2 grid gap-1 text-sm sm:grid-cols-3">
              {TRACKS.map((track) => (
                <div key={track}>
                  <dt className="font-medium">{TRACK_LABEL[track]}</dt>
                  <dd className="text-muted">{week.goals[track]}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-4 space-y-2">
              {ROADMAP.filter((d) => d.week === week.week).map((day) => (
                <details key={day.day} className="rounded-lg border border-border px-3 py-2">
                  <summary className="cursor-pointer text-sm font-medium">
                    Dia {day.day}: {day.focus}
                  </summary>
                  <ul className="divide-y divide-border">
                    {day.activities.map((activity) => (
                      <ActivityItem key={activity.id} activity={activity} />
                    ))}
                  </ul>
                  <p className="mt-2 text-xs font-semibold text-muted">Modo mínimo</p>
                  <ul>
                    <ActivityItem activity={day.minimum} />
                  </ul>
                </details>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
}
