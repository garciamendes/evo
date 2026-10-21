import type { Metadata } from "next";
import { AnswerBox } from "@/components/answer-box";
import { CompleteButton, ListeningPlayer } from "@/components/interactive";
import { Card, List, PageHeader, SectionTitle } from "@/components/ui";
import { ENGLISH_UNITS, LISTENING_ROUTINE } from "@/content/english";
import type { Phrase } from "@/content/types";

export const metadata: Metadata = { title: "Inglês" };

function PhraseTable({ phrases }: { phrases: Phrase[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="text-xs text-muted">
          <tr>
            <th className="py-1 pr-3 font-medium">Inglês</th>
            <th className="py-1 pr-3 font-medium">Pronúncia</th>
            <th className="py-1 font-medium">Português</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {phrases.map((p) => (
            <tr key={p.en}>
              <td className="py-1.5 pr-3 font-medium" lang="en">
                {p.en}
              </td>
              <td className="py-1.5 pr-3 text-muted">{p.pron}</td>
              <td className="py-1.5">{p.pt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function InglesPage() {
  return (
    <>
      <PageHeader
        title="Inglês"
        description="Do A1 em diante. Explicações em português; o inglês aumenta aos poucos."
      />
      <Card className="mb-4">
        <h2 className="font-semibold">Rotina de escuta</h2>
        <List items={LISTENING_ROUTINE} ordered />
      </Card>
      <div className="space-y-4">
        {ENGLISH_UNITS.map((unit) => (
          <Card key={unit.id} id={unit.id}>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted">
                  {unit.id} · {unit.skill}
                </p>
                <h2 className="text-lg font-semibold">{unit.title}</h2>
              </div>
              <CompleteButton id={unit.id} />
            </div>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-accent">Abrir a unidade</summary>
              <SectionTitle>Explicação</SectionTitle>
              <List items={unit.explanation} />
              <SectionTitle>Exemplos</SectionTitle>
              <PhraseTable phrases={unit.examples} />
              <SectionTitle>Vocabulário</SectionTitle>
              <PhraseTable phrases={unit.vocabulary} />
              {unit.reading && (
                <>
                  <SectionTitle>Leitura: tente entender sem traduzir tudo</SectionTitle>
                  <p className="rounded-lg bg-surface-muted p-3 text-sm" lang="en">
                    {unit.reading.text}
                  </p>
                  <List items={unit.reading.questions} />
                </>
              )}
              <SectionTitle>Escuta</SectionTitle>
              <ListeningPlayer sentences={unit.listening} />
              <SectionTitle>Exercício</SectionTitle>
              <p className="mb-1 text-sm">{unit.exercise.instructions}</p>
              <List items={unit.exercise.items} ordered />
              <AnswerBox
                id={unit.id}
                title={`Inglês ${unit.id}: ${unit.title}`}
                prompt="Uma frase por linha, na ordem dos itens."
              />
            </details>
          </Card>
        ))}
      </div>
    </>
  );
}
