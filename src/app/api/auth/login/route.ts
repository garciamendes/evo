import { NextResponse, type NextRequest } from "next/server";
import { STATE_COOKIE, authConfig, cookieOptions } from "@/lib/server/session";

export async function GET(request: NextRequest) {
  const config = authConfig();
  if (!config) {
    return NextResponse.json({ error: "Login não configurado neste ambiente." }, { status: 503 });
  }

  const state = crypto.randomUUID();
  const authorize = new URL("https://github.com/login/oauth/authorize");
  authorize.searchParams.set("client_id", config.clientId);
  authorize.searchParams.set("redirect_uri", new URL("/api/auth/callback", request.url).toString());
  authorize.searchParams.set("state", state);
  // No scope: the login only proves who you are. Data access uses DATA_GITHUB_TOKEN.
  authorize.searchParams.set("allow_signup", "false");

  const response = NextResponse.redirect(authorize);
  response.cookies.set(STATE_COOKIE, state, cookieOptions(60 * 10));
  return response;
}
