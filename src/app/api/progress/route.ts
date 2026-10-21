import type { NextRequest } from "next/server";
import { readFile, writeFile } from "@/lib/server/data-store";
import { withStore } from "@/lib/server/guard";

const PATH = "progresso.json";
const MAX_BYTES = 500_000;

export async function GET(request: NextRequest) {
  return withStore(request, async (store) => {
    const file = await readFile(store, PATH);
    return Response.json({ progress: file ? JSON.parse(file.content) : null });
  });
}

export async function PUT(request: NextRequest) {
  return withStore(request, async (store) => {
    const body = await request.text();
    if (body.length > MAX_BYTES) return Response.json({ error: "Progresso grande demais." }, { status: 413 });
    let progress: unknown;
    try {
      progress = JSON.parse(body);
    } catch {
      return Response.json({ error: "JSON inválido." }, { status: 400 });
    }
    if (!progress || typeof progress !== "object" || (progress as { version?: unknown }).version !== 1) {
      return Response.json({ error: "Formato de progresso inválido." }, { status: 400 });
    }
    await writeFile(store, PATH, `${JSON.stringify(progress, null, 2)}\n`, "Atualiza progresso");
    return Response.json({ ok: true });
  });
}
