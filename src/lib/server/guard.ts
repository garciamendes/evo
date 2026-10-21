import type { NextRequest } from "next/server";
import { StoreError, storeConfig } from "./data-store";
import { getSession } from "./session";

type Store = NonNullable<ReturnType<typeof storeConfig>>;

/** Runs a data handler only for the signed-in user, mapping failures to JSON errors. */
export async function withStore(request: NextRequest, handler: (store: Store) => Promise<Response>): Promise<Response> {
  if (!(await getSession(request))) {
    return Response.json({ error: "Faça login para continuar." }, { status: 401 });
  }
  const store = storeConfig();
  if (!store) {
    return Response.json({ error: "Armazenamento não configurado neste ambiente." }, { status: 503 });
  }
  try {
    return await handler(store);
  } catch (error) {
    if (error instanceof StoreError) {
      console.error(error.message);
      return Response.json({ error: "Não foi possível acessar seus dados no GitHub." }, { status: 502 });
    }
    throw error;
  }
}
