import type { NextRequest } from "next/server";

// Minimal signed-cookie session. The cookie holds `login.expiry.signature`,
// signed with HMAC-SHA256 using AUTH_SECRET. It carries no GitHub token.

export const SESSION_COOKIE = "studyhub_session";
export const STATE_COOKIE = "studyhub_oauth_state";
export const SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export type Session = { login: string };

export type AuthConfig = {
  clientId: string;
  clientSecret: string;
  secret: string;
  allowedLogin: string;
};

export function authConfig(): AuthConfig | null {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  const secret = process.env.AUTH_SECRET;
  const allowedLogin = process.env.ALLOWED_GITHUB_LOGIN;
  if (!clientId || !clientSecret || !secret || !allowedLogin) return null;
  return { clientId, clientSecret, secret, allowedLogin: allowedLogin.toLowerCase() };
}

async function hmac(secret: string, data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Buffer.from(signature).toString("base64url");
}

function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function createSessionToken(login: string, secret: string, now = Date.now()): Promise<string> {
  const expiry = Math.floor(now / 1000) + SESSION_MAX_AGE;
  const payload = `${login}.${expiry}`;
  return `${payload}.${await hmac(secret, payload)}`;
}

export async function verifySessionToken(token: string, secret: string, now = Date.now()): Promise<Session | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [login, expiry, signature] = parts;
  if (!safeEqual(signature, await hmac(secret, `${login}.${expiry}`))) return null;
  if (Number(expiry) * 1000 < now) return null;
  return { login };
}

/** The signed-in user, only if they are the allowed GitHub login. */
export async function getSession(request: NextRequest): Promise<Session | null> {
  const config = authConfig();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!config || !token) return null;
  const session = await verifySessionToken(token, config.secret);
  return session && session.login.toLowerCase() === config.allowedLogin ? session : null;
}

export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}
