import type { Metadata } from "next";
import Link from "next/link";
import { Card, List, PageHeader, SectionTitle, TrackBadge } from "@/components/ui";
import { HOMEWORK } from "@/content/homework";
import type { HomeworkStatus } from "@/content/types";

export const metadata: Metadata = { title: "Deveres de casa" };

const STATUS: Record<HomeworkStatus, { label: string; className: string }> = {
  aberto: { label: "Aberto", className: "bg-accent/15 text-accent" },
  entregue: { label: "Entregue, aguardando correção", className: "bg-ia/15 text-ia" },
  corrigido: { label: "Corrigido", className: "bg-success/15 text-success" },
};

const DELIVERY_STEPS = [
  "git checkout main && git pull",
  "git checkout -b <branch do dever>",
  "Faça o dever dentro da pasta indicada.",
  "git add . && git commit -m \"dever NN: descrição\"",
  "git push -u origin <branch do dever>",
  "Abra um Pull Request no GitHub com o título \"Dever NN: título\" e me avise no chat.",
];

export default function DeveresPage() {
  return (
    <>
      <PageHeader
        title="Deveres de casa"
        description="Você entrega por Pull Request no repositório evo; eu corrijo com comentários no PR."
      />
      <Card className="mb-4">
        <h2 className="font-semibold">Como entregar</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm">
          {DELIVERY_STEPS.map((step) => (
            <li key={step}>
              <code className="font-mono text-[0.85em]">{step}</code>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-sm text-muted">
          Depois da correção, você ajusta no mesmo PR até ficar aprovado. O merge marca o dever como concluído.
        </p>
      </Card>
      <div className="space-y-4">
        {HOMEWORK.map((h) => (
          <Card key={h.id} id={h.id}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS[h.status].className}`}>
                {STATUS[h.status].label}
              </span>
              <TrackBadge track={h.track} />
            </div>
            <h2 className="mt-2 text-lg font-semibold">
              Dever {String(h.number).padStart(2, "0")}: {h.title}
            </h2>
            <p className="mt-1 text-sm">{h.summary}</p>
            <dl className="mt-3 grid gap-1 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs text-muted">Pasta</dt>
                <dd className="font-mono text-[0.85em]">{h.folder}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted">Branch</dt>
                <dd className="font-mono text-[0.85em]">{h.branch}</dd>
              </div>
            </dl>
            <SectionTitle>Requisitos</SectionTitle>
            <List items={h.requirements} />
            <SectionTitle>Critérios de aceite</SectionTitle>
            <List items={h.acceptance} />
            {h.challengeId && (
              <p className="mt-3 text-sm">
                <Link href={`/programacao#${h.challengeId}`} className="text-accent underline-offset-2 hover:underline">
                  Ver o desafio {h.challengeId} com as dicas
                </Link>
              </p>
            )}
            {h.prUrl && (
              <p className="mt-1 text-sm">
                <a href={h.prUrl} className="text-accent underline-offset-2 hover:underline">
                  Abrir o Pull Request
                </a>
              </p>
            )}
            {h.feedback && (
              <div className="mt-3 rounded-lg bg-surface-muted p-3 text-sm">
                <p className="text-xs font-semibold text-muted">Correção</p>
                <p className="mt-1">{h.feedback}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </>
  );
}
