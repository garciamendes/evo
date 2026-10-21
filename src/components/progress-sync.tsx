"use client";

import { useEffect } from "react";
import { applyRemoteProgress, getProgress, onLocalWrite, type ProgressState } from "@/lib/progress";
import { setSyncStatus, useSession } from "@/lib/session";

const DEBOUNCE_MS = 1500;

async function push(state: ProgressState, keepalive = false) {
  setSyncStatus("saving");
  try {
    const res = await fetch("/api/progress", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(state),
      keepalive,
    });
    setSyncStatus(res.ok ? "saved" : "error");
  } catch {
    setSyncStatus("error");
  }
}

/** Mirrors local progress to the data repository while signed in. Renders nothing. */
export function ProgressSync() {
  const session = useSession();
  const login = session.status === "ready" ? session.login : null;

  useEffect(() => {
    if (!login) return;
    let cancelled = false;
    let ready = false;
    let pending: ProgressState | null = null;
    let timer: ReturnType<typeof setTimeout> | undefined;

    // Pull once: the saved copy wins; if there is none yet, upload this browser's progress.
    (async () => {
      setSyncStatus("saving");
      try {
        const res = await fetch("/api/progress", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const { progress } = (await res.json()) as { progress: unknown };
        if (cancelled) return;
        if (progress) {
          applyRemoteProgress(progress);
          setSyncStatus("saved");
        } else {
          await push(getProgress());
        }
      } catch {
        if (!cancelled) setSyncStatus("error");
      }
      ready = true;
      if (pending && !cancelled) void push(pending);
      pending = null;
    })();

    const unsubscribe = onLocalWrite((state) => {
      if (!ready) {
        pending = state;
        return;
      }
      pending = state;
      clearTimeout(timer);
      timer = setTimeout(() => {
        pending = null;
        void push(state);
      }, DEBOUNCE_MS);
    });

    // Flush a debounced save when the tab is hidden or closed.
    const onHide = () => {
      if (document.visibilityState === "hidden" && ready && pending) {
        clearTimeout(timer);
        void push(pending, true);
        pending = null;
      }
    };
    document.addEventListener("visibilitychange", onHide);

    return () => {
      cancelled = true;
      unsubscribe();
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [login]);

  return null;
}
