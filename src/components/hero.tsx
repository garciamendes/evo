"use client";

import { motion, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { TRACK_LABEL, type Track } from "@/content/types";
import { Burst } from "./celebrate";

// three.js is large and needs WebGL, so it loads only in the browser, after the page is interactive.
const Scene3D = dynamic(() => import("./scene-3d"), {
  ssr: false,
  loading: () => <div className="size-full animate-pulse rounded-lg bg-surface-muted/60" />,
});

const TRACKS: Track[] = ["programacao", "ingles", "ia"];
const DOT: Record<Track, string> = { programacao: "bg-programacao", ingles: "bg-ingles", ia: "bg-ia" };

export function Hero({ lit, allDone }: { lit: Record<Track, boolean>; allDone: boolean }) {
  const reduced = useReducedMotion();
  const [burst, setBurst] = useState(0);
  const wasDone = useRef(allDone);

  // Celebrate the moment the day becomes complete, not on every visit after that.
  useEffect(() => {
    if (allDone && !wasDone.current) setBurst((n) => n + 1);
    wasDone.current = allDone;
  }, [allDone]);

  const litCount = TRACKS.filter((t) => lit[t]).length;
  const message = allDone
    ? "Dia completo! Você subiu a escada inteira."
    : litCount === 0
      ? "Cada trilha concluída hoje acende um degrau."
      : `${litCount} de 3 degraus acesos. Continue subindo.`;

  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-accent/10 via-surface to-ia/10">
      <div className="h-52 md:h-60">
        <Scene3D lit={lit} allDone={allDone} still={Boolean(reduced)} />
      </div>
      <div className="relative flex flex-wrap items-center justify-between gap-2 border-t border-border/60 bg-surface/70 px-4 py-2.5 backdrop-blur">
        <motion.p
          key={message}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-sm ${allDone ? "font-semibold text-success" : "text-muted"}`}
          role="status"
        >
          {message}
        </motion.p>
        <ul className="flex gap-3 text-xs">
          {TRACKS.map((t) => (
            <li key={t} className={`flex items-center gap-1.5 ${lit[t] ? "text-foreground" : "text-muted"}`}>
              <motion.span
                className={`size-2.5 rounded-full ${lit[t] ? DOT[t] : "bg-border"}`}
                animate={{ scale: lit[t] ? [1, 1.6, 1] : 1 }}
                transition={{ duration: 0.4 }}
              />
              {TRACK_LABEL[t]}
            </li>
          ))}
        </ul>
        <Burst fireKey={burst} count={28} spread={140} />
      </div>
    </div>
  );
}
