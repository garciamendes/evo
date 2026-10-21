"use client";

import Link from "next/link";
import { useState } from "react";
import type { Activity } from "@/content/types";
import { toggleCompleted, useProgress } from "@/lib/progress";
import { saveVoiceName, savedVoiceName, speakEnglish, useEnglishVoices, useSpeechSupported } from "@/lib/speech";
import { TrackBadge } from "./ui";

export function CompleteButton({ id }: { id: string }) {
  const { completed } = useProgress();
  const done = Boolean(completed[id]);
  return (
    <button
      type="button"
      onClick={() => toggleCompleted(id)}
      aria-pressed={done}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        done ? "bg-success/15 text-success" : "bg-accent text-accent-foreground"
      }`}
    >
      {done ? "Concluído ✓" : "Marcar como concluído"}
    </button>
  );
}

export function ActivityItem({ activity }: { activity: Activity }) {
  const { completed } = useProgress();
  const done = Boolean(completed[activity.id]);
  return (
    <li className="flex gap-3 py-3">
      <input
        type="checkbox"
        id={activity.id}
        checked={done}
        onChange={() => toggleCompleted(activity.id)}
        className="mt-1 size-5 shrink-0 accent-[var(--accent)]"
      />
      <div className="min-w-0 flex-1">
        <label htmlFor={activity.id} className={`font-medium ${done ? "text-muted line-through" : ""}`}>
          {activity.title}
        </label>
        <p className="text-sm text-muted">{activity.description}</p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted">
          <TrackBadge track={activity.track} />
          <span>{activity.minutes} min</span>
          {activity.href && (
            <Link href={activity.href} className="text-accent underline-offset-2 hover:underline">
              Abrir
            </Link>
          )}
        </div>
      </div>
    </li>
  );
}

export function Hints({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0);
  return (
    <div>
      {shown > 0 && (
        <ol className="mb-2 list-decimal space-y-1 pl-5 text-sm">
          {hints.slice(0, shown).map((hint) => (
            <li key={hint}>{hint}</li>
          ))}
        </ol>
      )}
      {shown < hints.length ? (
        <button
          type="button"
          onClick={() => setShown((n) => n + 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm"
        >
          {shown === 0 ? "Mostrar a primeira dica" : `Mostrar a dica ${shown + 1} de ${hints.length}`}
        </button>
      ) : (
        <p className="text-xs text-muted">Todas as dicas reveladas. Ainda travado? Peça ajuda na próxima sessão.</p>
      )}
    </div>
  );
}

export function ListeningPlayer({ sentences }: { sentences: string[] }) {
  const supported = useSpeechSupported();
  const voices = useEnglishVoices(supported);
  const [showTranscript, setShowTranscript] = useState(false);
  const [voiceName, setVoiceName] = useState<string | null>(null);
  const [slow, setSlow] = useState(false);

  const chosenName = voiceName ?? (supported ? savedVoiceName() : null);
  const voice = voices.find((v) => v.name === chosenName) ?? voices[0];

  function speak(text: string) {
    speakEnglish(text, voice, slow ? 0.7 : 0.95);
  }

  return (
    <div>
      {supported === false && (
        <p className="mb-2 text-sm text-muted">
          Este navegador não tem áudio de voz. Leia a transcrição em voz alta e use a pronúncia dos exemplos.
        </p>
      )}
      {supported && voices.length > 0 && (
        <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
          <label className="flex min-w-0 items-center gap-2">
            <span className="text-muted">Voz</span>
            <select
              value={voice?.name}
              onChange={(e) => {
                setVoiceName(e.target.value);
                saveVoiceName(e.target.value);
              }}
              className="min-w-0 max-w-56 rounded-md border border-border bg-surface px-2 py-1"
            >
              {voices.map((v) => (
                <option key={v.name} value={v.name}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            aria-pressed={slow}
            onClick={() => setSlow((v) => !v)}
            className={`rounded-md border border-border px-3 py-1 ${slow ? "bg-accent text-accent-foreground" : ""}`}
          >
            Devagar
          </button>
        </div>
      )}
      {supported && voices.length === 0 && (
        <p className="mb-2 text-sm text-muted">
          Este aparelho não tem voz em inglês instalada. Instale uma nas configurações de voz do sistema ou use o Chrome.
        </p>
      )}
      <ol className="space-y-2">
        {sentences.map((sentence, i) => (
          <li key={sentence} className="flex items-center gap-3">
            <button
              type="button"
              disabled={!supported}
              onClick={() => speak(sentence)}
              className="shrink-0 rounded-md border border-border px-3 py-1.5 text-sm disabled:opacity-50"
              aria-label={`Ouvir a frase ${i + 1}`}
            >
              ▶ {i + 1}
            </button>
            <span className={`text-sm ${showTranscript || supported === false ? "" : "blur-sm select-none"}`}>
              {sentence}
            </span>
          </li>
        ))}
      </ol>
      {supported && (
        <button
          type="button"
          onClick={() => setShowTranscript((v) => !v)}
          className="mt-3 text-sm text-accent underline-offset-2 hover:underline"
        >
          {showTranscript ? "Esconder a transcrição" : "Mostrar a transcrição"}
        </button>
      )}
    </div>
  );
}
