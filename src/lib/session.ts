"use client";

import { useSyncExternalStore } from "react";

export type SessionInfo =
  | { status: "loading" }
  | { status: "ready"; login: string | null; configured: boolean };

export type SyncStatus = "idle" | "saving" | "saved" | "error";

const LOADING: SessionInfo = { status: "loading" };

let session: SessionInfo = LOADING;
let sync: SyncStatus = "idle";
let started = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function loadSession() {
  if (started) return;
  started = true;
  fetch("/api/session", { cache: "no-store" })
    .then((res) => res.json() as Promise<{ login: string | null; configured: boolean }>)
    .then((data) => {
      session = { status: "ready", login: data.login, configured: data.configured };
    })
    .catch(() => {
      session = { status: "ready", login: null, configured: false };
    })
    .finally(emit);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  loadSession();
  return () => {
    listeners.delete(listener);
  };
}

export function useSession(): SessionInfo {
  return useSyncExternalStore(subscribe, () => session, () => LOADING);
}

export function useSyncStatus(): SyncStatus {
  return useSyncExternalStore(subscribe, () => sync, () => "idle");
}

export function setSyncStatus(next: SyncStatus) {
  sync = next;
  emit();
}
