"use client";

import { AnimatePresence, motion } from "motion/react";

const COLORS = ["var(--programacao)", "var(--ingles)", "var(--ia)", "var(--accent)", "#f472b6"];

/** A small burst of confetti around its parent (which must be `relative`). Re-fires whenever `fireKey` changes. */
export function Burst({ fireKey, count = 14, spread = 60 }: { fireKey: number; count?: number; spread?: number }) {
  return (
    <AnimatePresence>
      {fireKey > 0 && (
        <span key={fireKey} aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {Array.from({ length: count }, (_, i) => {
            const angle = (i / count) * Math.PI * 2 + (fireKey % 7) * 0.3;
            const distance = spread * (0.6 + ((i * 37) % 10) / 25);
            return (
              <motion.span
                key={i}
                className="absolute size-1.5 rounded-full"
                style={{ background: COLORS[i % COLORS.length] }}
                initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                animate={{ x: Math.cos(angle) * distance, y: Math.sin(angle) * distance, scale: 0, opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
              />
            );
          })}
        </span>
      )}
    </AnimatePresence>
  );
}

/** Animated check mark that draws itself. */
export function CheckMark({ checked, className = "size-3.5" }: { checked: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
      <motion.path
        d="M3.5 8.5l3 3 6-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={false}
        animate={{ pathLength: checked ? 1 : 0, opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />
    </svg>
  );
}
