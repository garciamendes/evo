"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { TRACK_LABEL, type Track } from "@/content/types";

const TRACK_CLASS: Record<Track, string> = {
  programacao: "text-programacao border-programacao/40",
  ingles: "text-ingles border-ingles/40",
  ia: "text-ia border-ia/40",
};

export function PageHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h1>
      {description && <p className="mt-2 text-muted">{description}</p>}
    </div>
  );
}

export function Card({ children, className = "", id }: { children: ReactNode; className?: string; id?: string }) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className={`scroll-mt-20 rounded-xl border border-border bg-surface p-4 md:p-5 ${className}`}
    >
      {children}
    </motion.section>
  );
}

export function TrackBadge({ track }: { track: Track }) {
  return (
    <span className={`inline-block rounded-full border px-2 py-0.5 text-xs font-medium ${TRACK_CLASS[track]}`}>
      {TRACK_LABEL[track]}
    </span>
  );
}

export function List({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={`${ordered ? "list-decimal" : "list-disc"} space-y-1 pl-5 text-sm`}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </Tag>
  );
}

export function SectionTitle({ children }: { children: ReactNode }) {
  return <h3 className="mt-4 mb-1.5 text-sm font-semibold text-muted">{children}</h3>;
}

export function ProgressBar({ value, label }: { value: number; label: string }) {
  const pct = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div>
      <div className="mb-1 flex justify-between text-xs text-muted">
        <span>{label}</span>
        <span>{pct}%</span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-surface-muted"
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-accent to-ia"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 60, damping: 18 }}
        />
      </div>
    </div>
  );
}
