import type { Metadata } from "next";
import { AnswerBox } from "@/components/answer-box";
import { CompleteButton, Hints } from "@/components/interactive";
import { Card, List, PageHeader, SectionTitle } from "@/components/ui";
import { CHALLENGES } from "@/content/challenges";

export const metadata: Metadata = { title: "Programação" };

export default function ProgramacaoPage() {
  return (
    <>
      <PageHeader
        title="Desafios de programação"
        description="Leia, proponha uma solução, tente sozinho e só então abra as dicas, uma de cada vez."
      />
      <div className="space-y-4">
        {CHALLENGES.map((c) => (
          <Card key={c.id} id={c.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {c.id} · {c.level}
                </p>
                <h2 className="text-lg font-semibold">{c.title}</h2>
              </div>
              <CompleteButton id={c.id} />
            </div>
            <p className="mt-2 text-sm">{c.objective}</p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-accent">Ver o desafio completo</summary>
              <SectionTitle>Conceitos</SectionTitle>
              <List items={c.concepts} />
              <SectionTitle>Requisitos</SectionTitle>
              <List items={c.requirements} />
              <SectionTitle>Arquivos</SectionTitle>
              <List items={c.files} />
              <SectionTitle>Passos</SectionTitle>
              <List items={c.steps} ordered />
              <SectionTitle>Critérios de aceite</SectionTitle>
              <List items={c.acceptance} />
              <SectionTitle>Testes</SectionTitle>
              <List items={c.tests} />
              <SectionTitle>Reflexão</SectionTitle>
              <List items={c.reflection} />
              <SectionTitle>Dicas</SectionTitle>
              <Hints hints={c.hints} />
            </details>
            <AnswerBox
              id={c.id}
              title={`Desafio ${c.id}: ${c.title}`}
              prompt="Explique seu raciocínio e escreva o código no editor."
              code
            />
          </Card>
        ))}
      </div>
    </>
  );
}
