import type { NextRequest } from "next/server";
import { isCorrected, parseFeedback, type Answer, type AnswerSummary } from "@/lib/answers";
import { listDir, readFile } from "@/lib/server/data-store";
import { withStore } from "@/lib/server/guard";

export async function GET(request: NextRequest) {
  return withStore(request, async (store) => {
    const [answerFiles, feedbackFiles] = await Promise.all([listDir(store, "respostas"), listDir(store, "correcoes")]);
    const withFeedback = new Set(feedbackFiles.filter((f) => f.endsWith(".md")).map((f) => f.slice(0, -3)));

    const summaries = await Promise.all(
      answerFiles
        .filter((f) => f.endsWith(".json"))
        .map(async (file): Promise<AnswerSummary | null> => {
          const id = file.slice(0, -5);
          const stored = await readFile(store, `respostas/${file}`);
          if (!stored) return null;
          const answer = JSON.parse(stored.content) as Answer;
          let corrected = false;
          if (withFeedback.has(id)) {
            const feedback = await readFile(store, `correcoes/${id}.md`);
            const parsed = feedback ? parseFeedback(feedback.content) : null;
            corrected = isCorrected(answer, parsed?.text ?? null, parsed?.revision ?? null);
          }
          return { id, title: answer.title, status: answer.status, revision: answer.revision, updatedAt: answer.updatedAt, corrected };
        }),
    );

    const answers = summaries
      .filter((s): s is AnswerSummary => s !== null)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    return Response.json({ answers });
  });
}
