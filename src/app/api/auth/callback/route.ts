import { NextResponse, type NextRequest } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE,
  STATE_COOKIE,
  authConfig,
  cookieOptions,
  createSessionToken,
} from "@/lib/server/session";

function fail(request: NextRequest, reason: string) {
  const response = NextResponse.redirect(new URL(`/entrar?erro=${reason}`, request.url));
  response.cookies.delete(STATE_COOKIE);
  return response;
}

export async function GET(request: NextRequest) {
  const config = authConfig();
  if (!config) return fail(request, "nao-configurado");

  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get(STATE_COOKIE)?.value;
  if (!code || !state || !expectedState || state !== expectedState) return fail(request, "estado-invalido");

  const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: config.clientId, client_secret: config.clientSecret, code }),
  });
  const token = (await tokenRes.json().catch(() => ({}))) as { access_token?: string };
  if (!token.access_token) return fail(request, "github");

  const userRes = await fetch("https://api.github.com/user", {
    headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}` },
  });
  const user = (await userRes.json().catch(() => ({}))) as { login?: string };
  if (!user.login) return fail(request, "github");
  if (user.login.toLowerCase() !== config.allowedLogin) return fail(request, "nao-autorizado");

  const response = NextResponse.redirect(new URL("/", request.url));
  response.cookies.delete(STATE_COOKIE);
  response.cookies.set(SESSION_COOKIE, await createSessionToken(user.login, config.secret), cookieOptions(SESSION_MAX_AGE));
  return response;
}
