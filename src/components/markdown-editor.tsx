"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import { commands, type ICommand } from "@uiw/react-md-editor";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { Markdown } from "./markdown";

// The editor touches `window`, so it only renders in the browser.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
  loading: () => <div className="h-64 animate-pulse rounded-lg border border-border bg-surface-muted/60" />,
});

/** Same command, Portuguese tooltip. */
function pt(command: ICommand, title: string): ICommand {
  return { ...command, buttonProps: { ...command.buttonProps, title, "aria-label": title } };
}

const TOOLBAR: ICommand[] = [
  pt(commands.bold, "Negrito (Ctrl+B)"),
  pt(commands.italic, "Itálico (Ctrl+I)"),
  pt(commands.strikethrough, "Riscado"),
  pt(commands.title, "Título"),
  commands.divider,
  pt(commands.link, "Link (Ctrl+L)"),
  pt(commands.quote, "Citação"),
  pt(commands.code, "Código na linha"),
  pt(commands.codeBlock, "Bloco de código (Ctrl+Shift+J)"),
  pt(commands.table, "Tabela"),
  commands.divider,
  pt(commands.unorderedListCommand, "Lista"),
  pt(commands.orderedListCommand, "Lista numerada"),
  pt(commands.checkedListCommand, "Lista de tarefas"),
  pt(commands.hr, "Linha horizontal"),
];

const MODES: ICommand[] = [
  pt(commands.codeEdit, "Só escrever"),
  pt(commands.codeLive, "Escrever e visualizar lado a lado"),
  pt(commands.codePreview, "Só visualizar"),
  commands.divider,
  pt(commands.fullscreen, "Tela cheia"),
];

const darkQuery = "(prefers-color-scheme: dark)";
function subscribeTheme(onChange: () => void) {
  const mq = window.matchMedia(darkQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type Props = { id: string; value: string; onChange: (value: string) => void; placeholder?: string };

/** Markdown editor with a formatting toolbar, Tab indentation, live preview and full screen. */
export function MarkdownEditor({ id, value, onChange, placeholder }: Props) {
  const dark = useSyncExternalStore(subscribeTheme, () => window.matchMedia(darkQuery).matches, () => false);
  return (
    <div data-color-mode={dark ? "dark" : "light"} className="md-editor">
      <MDEditor
        value={value}
        onChange={(v) => onChange(v ?? "")}
        commands={TOOLBAR}
        extraCommands={MODES}
        preview="edit"
        height={280}
        minHeight={160}
        visibleDragbar
        // The library inserts two spaces per tabSize unit, so 2 gives a 4-space indent (Python style).
        tabSize={2}
        textareaProps={{ id, placeholder, spellCheck: false }}
        components={{ preview: (source) => <Markdown>{source}</Markdown> }}
      />
    </div>
  );
}
