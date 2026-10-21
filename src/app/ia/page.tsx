import type { Metadata } from "next";
import { AnswerBox } from "@/components/answer-box";
import { CompleteButton } from "@/components/interactive";
import { Card, List, PageHeader, SectionTitle } from "@/components/ui";
import { AI_STAGES } from "@/content/ai";

export const metadata: Metadata = { title: "Inteligência Artificial" };

export default function IaPage() {
  return (
    <>
      <PageHeader
        title="Trilha de IA"
        description="Usar a IA como assistente profissional, sem substituir o seu raciocínio."
      />
      <div className="space-y-4">
        {AI_STAGES.map((stage) => (
          <Card key={stage.id} id={stage.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">Etapa {stage.stage}</p>
                <h2 className="text-lg font-semibold">{stage.title}</h2>
              </div>
              <CompleteButton id={stage.id} />
            </div>
            <p className="mt-2 text-sm">{stage.goal}</p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-accent">Abrir as lições</summary>
              {stage.lessons.map((lesson) => (
                <div key={lesson.title}>
                  <SectionTitle>{lesson.title}</SectionTitle>
                  <List items={lesson.points} />
                </div>
              ))}
              <div className="mt-4 rounded-lg bg-surface-muted p-3">
                <p className="text-sm font-semibold">Exercício: {stage.exercise.title}</p>
                <p className="mt-1 text-sm">{stage.exercise.task}</p>
                <p className="mt-2 text-xs font-semibold text-muted">Critérios de conclusão</p>
                <List items={stage.exercise.criteria} />
              </div>
              <AnswerBox id={stage.id} title={`IA etapa ${stage.stage}: ${stage.exercise.title}`} />
            </details>
          </Card>
        ))}
      </div>
    </>
  );
}
