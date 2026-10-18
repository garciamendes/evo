"use client";

import { useSyncExternalStore } from "react";

// Progress lives in this browser's localStorage only. It does not sync across
// devices; export/import on the Progress page is the manual way to move it.

export type StudyMode = "normal" | "minimo";
export type JournalKind = "nota" | "dificuldade" | "pergunta" | "aprendizado";

export type JournalEntry = {
  id: string;
  date: string;
  kind: JournalKind;
  text: string;
};

export type ProgressState = {
  version: 1;
  /** Completed item id -> local date (YYYY-MM-DD) it was completed. */
  completed: Record<string, string>;
  /** Local dates (YYYY-MM-DD) with at least one completed item. */
  studyDays: string[];
  mode: StudyMode;
  journal: JournalEntry[];
};

const STORAGE_KEY = "studyhub:v1";

const EMPTY: ProgressState = {
  version: 1,
  completed: {},
  studyDays: [],
  mode: "normal",
  journal: [],
};

let cache: ProgressState | null = null;
const listeners = new Set<() => void>();

export function todayKey(date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parse(raw: string | null): ProgressState {
  if (!raw) return EMPTY;
  try {
    const data = JSON.parse(raw) as Partial<ProgressState>;
    if (data.version !== 1) return EMPTY;
    return {
      version: 1,
      completed: data.completed && typeof data.completed === "object" ? data.completed : {},
      studyDays: Array.isArray(data.studyDays) ? data.studyDays : [],
      mode: data.mode === "minimo" ? "minimo" : "normal",
      journal: Array.isArray(data.journal) ? data.journal : [],
    };
  } catch {
    return EMPTY;
  }
}

function read(): ProgressState {
  if (cache) return cache;
  try {
    cache = parse(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    cache = EMPTY;
  }
  return cache;
}

function write(next: ProgressState) {
  cache = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Storage can be unavailable (private mode, quota). Keep the in-memory copy.
  }
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function useProgress(): ProgressState {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

const noopSubscribe = () => () => {};

/** Today's local date, or null during prerender (the date belongs to the visitor). */
export function useToday(): string | null {
  return useSyncExternalStore(noopSubscribe, () => todayKey(), () => null);
}

export function toggleCompleted(id: string) {
  const state = read();
  const completed = { ...state.completed };
  let studyDays = state.studyDays;
  if (completed[id]) {
    delete completed[id];
  } else {
    const today = todayKey();
    completed[id] = today;
    if (!studyDays.includes(today)) studyDays = [...studyDays, today];
  }
  write({ ...state, completed, studyDays });
}

export function setMode(mode: StudyMode) {
  write({ ...read(), mode });
}

export function addJournalEntry(kind: JournalKind, text: string) {
  const state = read();
  const entry: JournalEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    date: todayKey(),
    kind,
    text,
  };
  write({ ...state, journal: [entry, ...state.journal] });
}

export function removeJournalEntry(id: string) {
  const state = read();
  write({ ...state, journal: state.journal.filter((entry) => entry.id !== id) });
}

export function exportProgress(): string {
  return JSON.stringify(read(), null, 2);
}

/** Replaces all local progress with an exported file. Returns false if invalid. */
export function importProgress(raw: string): boolean {
  const parsed = parse(raw);
  if (parsed === EMPTY) return false;
  write(parsed);
  return true;
}

export function resetProgress() {
  write(EMPTY);
}
