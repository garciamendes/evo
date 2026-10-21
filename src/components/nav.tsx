"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Account } from "./account";
import { LogoMark } from "./logo";

const LINKS = [
  { href: "/", label: "Hoje" },
  { href: "/roadmap", label: "Roteiro de 30 dias" },
  { href: "/programacao", label: "Programação" },
  { href: "/ingles", label: "Inglês" },
  { href: "/ia", label: "Inteligência Artificial" },
  { href: "/deveres", label: "Deveres de casa" },
  { href: "/diario", label: "Diário" },
  { href: "/progresso", label: "Progresso" },
] as const;

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-surface md:h-screen md:w-60 md:shrink-0 md:border-r md:border-b-0">
      <div className="flex items-center justify-between px-4 py-3 md:py-6">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold" onClick={() => setOpen(false)}>
          <motion.span whileHover={{ rotate: -8, scale: 1.08 }} whileTap={{ scale: 0.92 }} className="inline-flex">
            <LogoMark />
          </motion.span>
          Study Hub
        </Link>
        <button
          type="button"
          className="rounded-md border border-border px-3 py-1.5 text-sm md:hidden"
          aria-expanded={open}
          aria-controls="main-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
        </button>
      </div>
      <nav
        id="main-nav"
        aria-label="Principal"
        className={`${open ? "block" : "hidden"} border-t border-border pb-3 md:block md:border-t-0`}
      >
        <ul className="flex flex-col gap-0.5 px-2">
          {LINKS.map((link) => {
            const active = link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`relative block rounded-md px-3 py-2 text-sm transition-colors ${
                    active ? "font-medium text-foreground" : "text-muted hover:text-foreground"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-md bg-surface-muted"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-4 border-t border-border px-3 pt-4">
          <Account onNavigate={() => setOpen(false)} />
        </div>
      </nav>
    </header>
  );
}
