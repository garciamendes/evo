import type { NextRequest } from "next/server";
import { isValidAnswerId, parseFeedback, type Answer, type AnswerView } from "@/lib/answers";
import { readFile, writeFile } from "@/lib/server/data-store";
import { withStore } from "@/lib/server/guard";

const MAX_ANSWER_LENGTH = 20_000;

export async function GET(request: NextRequest, ctx: RouteContext<"/api/answers/[id]">) {
  const { id } = await ctx.params;
  if (!isValidAnswerId(id)) return Response.json({ error: "Id inválido." }, { status: 400 });

  return withStore(request, async (store) => {
    const [answerFile, feedbackFile] = await Promise.all([
      readFile(store, `respostas/${id}.json`),
      readFile(store, `correcoes/${id}.md`),
    ]);
    const feedback = feedbackFile ? parseFeedback(feedbackFile.content) : null;
    const view: AnswerView = {
      answer: answerFile ? (JSON.parse(answerFile.content) as Answer) : null,
      feedback: feedback?.text ?? null,
      feedbackRevision: feedback?.revision ?? null,
    };
    return Response.json(view);
  });
}

export async function PUT(request: NextRequest, ctx: RouteContext<"/api/answers/[id]">) {
  const { id } = await ctx.params;
  if (!isValidAnswerId(id)) return Response.json({ error: "Id inválido." }, { status: 400 });

  return withStore(request, async (store) => {
    const body = (await request.json().catch(() => null)) as { title?: unknown; answer?: unknown; submit?: unknown } | null;
    if (!body || typeof body.answer !== "string" || typeof body.title !== "string") {
      return Response.json({ error: "Envie title e answer." }, { status: 400 });
    }
    const text = body.answer.trim();
    if (!text) return Response.json({ error: "A resposta está vazia." }, { status: 400 });
    if (text.length > MAX_ANSWER_LENGTH) return Response.json({ error: "Resposta longa demais." }, { status: 413 });

    const path = `respostas/${id}.json`;
    const previousFile = await readFile(store, path);
    const previous = previousFile ? (JSON.parse(previousFile.content) as Answer) : null;
    const now = new Date().toISOString();
    const submit = body.submit === true;
    // Re-sending an unchanged submitted answer is a double click, not a new revision.
    if (submit && previous?.status === "enviado" && previous.answer === text) return Response.json({ answer: previous });

    const answer: Answer = {
      id,
      title: body.title.slice(0, 200),
      answer: text,
      status: submit ? "enviado" : (previous?.status ?? "rascunho"),
      revision: (previous?.revision ?? 0) + (submit ? 1 : 0),
      updatedAt: now,
      submittedAt: submit ? now : previous?.submittedAt,
    };
    const message = submit ? `Resposta ${id} enviada (revisão ${answer.revision})` : `Rascunho ${id}`;
    await writeFile(store, path, `${JSON.stringify(answer, null, 2)}\n`, message);
    return Response.json({ answer });
  });
}
