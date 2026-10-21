import type { NextRequest } from "next/server";
import { authConfig, getSession } from "@/lib/server/session";
import { storeConfig } from "@/lib/server/data-store";

export async function GET(request: NextRequest) {
  const session = await getSession(request);
  return Response.json({
    login: session?.login ?? null,
    configured: Boolean(authConfig() && storeConfig()),
  });
}
