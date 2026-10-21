"use client";

import type { Monaco } from "@monaco-editor/react";
import type { Position, editor } from "monaco-editor";
import dynamic from "next/dynamic";
import { useSyncExternalStore } from "react";
import { CODE_LANGUAGES, type CodeLanguage } from "@/lib/code-answer";

// Monaco (the VS Code editor) is large and browser-only; it loads on demand from /public/monaco
// (copied there by scripts/copy-monaco.mjs) instead of the default CDN.
const Editor = dynamic(
  () =>
    import("@monaco-editor/react").then((m) => {
      m.loader.config({ paths: { vs: `/monaco/${process.env.NEXT_PUBLIC_MONACO_VERSION}/vs` } });
      return m.Editor;
    }),
  {
    ssr: false,
    loading: () => <div className="h-72 animate-pulse rounded-lg bg-surface-muted/60" />,
  },
);

// Monaco ships full IntelliSense for TypeScript/JavaScript. Python only gets syntax colors, so these
// completions cover the keywords, built-ins and Django pieces used in the exercises.
const PY_KEYWORDS =
  "False None True and as assert async await break class continue def del elif else except finally for from global if import in is lambda nonlocal not or pass raise return try while with yield".split(" ");
const PY_BUILTINS =
  "abs all any bool dict enumerate filter float format getattr hasattr int isinstance len list map max min open print range repr reversed round set sorted str sum super tuple type zip".split(" ");
const PY_SNIPPETS: { label: string; insert: string; doc: string }[] = [
  { label: "def", insert: "def ${1:nome}(${2:args}):\n    ${0:pass}", doc: "Função" },
  { label: "class", insert: "class ${1:Nome}:\n    def __init__(self${2:, args}):\n        ${0:pass}", doc: "Classe" },
  { label: "for", insert: "for ${1:item} in ${2:itens}:\n    ${0:pass}", doc: "Laço for" },
  { label: "if", insert: "if ${1:condicao}:\n    ${0:pass}", doc: "Condição" },
  { label: "try", insert: "try:\n    ${1:pass}\nexcept ${2:Exception} as ${3:erro}:\n    ${0:raise}", doc: "try / except" },
  { label: "model", insert: "class ${1:Nome}(models.Model):\n    ${2:campo} = models.${3:CharField}(${4:max_length=100})\n\n    def __str__(self):\n        return self.${2:campo}", doc: "Model do Django" },
  { label: "models.CharField", insert: "models.CharField(max_length=${1:100})", doc: "Texto curto" },
  { label: "models.TextField", insert: "models.TextField(${1:blank=True})", doc: "Texto longo" },
  { label: "models.DecimalField", insert: "models.DecimalField(max_digits=${1:12}, decimal_places=${2:2})", doc: "Dinheiro: use Decimal, nunca float" },
  { label: "models.DateField", insert: "models.DateField(${1})", doc: "Data" },
  { label: "models.DateTimeField", insert: "models.DateTimeField(auto_now_add=${1:True})", doc: "Data e hora" },
  { label: "models.BooleanField", insert: "models.BooleanField(default=${1:False})", doc: "Verdadeiro/falso" },
  { label: "models.ForeignKey", insert: "models.ForeignKey(${1:Modelo}, on_delete=models.${2:PROTECT}, related_name=\"${3:itens}\")", doc: "Relação muitos-para-um" },
  { label: "models.TextChoices", insert: "class ${1:Tipo}(models.TextChoices):\n    ${2:RECEITA} = \"${3:receita}\", \"${4:Receita}\"", doc: "Opções fixas" },
  { label: "objects.filter", insert: "objects.filter(${1:campo}=${2:valor})", doc: "Consulta com filtro" },
  { label: "aggregate(Sum)", insert: "aggregate(total=Sum(\"${1:valor}\"))", doc: "Soma no banco (from django.db.models import Sum)" },
  { label: "annotate", insert: "values(\"${1:categoria__nome}\").annotate(total=Sum(\"${2:valor}\"))", doc: "Soma agrupada" },
  { label: "TestCase", insert: "class ${1:Nome}Test(TestCase):\n    def test_${2:caso}(self):\n        ${0:self.assertEqual(1, 1)}", doc: "Teste do Django" },
];

let pythonReady = false;
function registerPython(monaco: Monaco) {
  if (pythonReady) return;
  pythonReady = true;
  const { CompletionItemKind, CompletionItemInsertTextRule } = monaco.languages;
  monaco.languages.registerCompletionItemProvider("python", {
    provideCompletionItems(model: editor.ITextModel, position: Position) {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };
      return {
        suggestions: [
          ...PY_KEYWORDS.map((k) => ({ label: k, kind: CompletionItemKind.Keyword, insertText: k, range })),
          ...PY_BUILTINS.map((b) => ({ label: b, kind: CompletionItemKind.Function, insertText: b, range })),
          ...PY_SNIPPETS.map((s) => ({
            label: s.label,
            kind: CompletionItemKind.Snippet,
            insertText: s.insert,
            insertTextRules: CompletionItemInsertTextRule.InsertAsSnippet,
            documentation: s.doc,
            detail: s.doc,
            range,
          })),
        ],
      };
    },
  });
}

const darkQuery = "(prefers-color-scheme: dark)";
function subscribeTheme(onChange: () => void) {
  const mq = window.matchMedia(darkQuery);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

type Props = {
  value: string;
  onChange: (value: string) => void;
  language: CodeLanguage;
  onLanguageChange: (language: CodeLanguage) => void;
};

/** VS Code's editor: autocomplete (Ctrl+Space), Tab indentation, multi-cursor, Ctrl+F, and type checking for TS/JS. */
export function CodeEditor({ value, onChange, language, onLanguageChange }: Props) {
  const dark = useSyncExternalStore(subscribeTheme, () => window.matchMedia(darkQuery).matches, () => false);
  return (
    <div className="overflow-hidden rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2 border-b border-border bg-surface-muted px-2 py-1.5 text-xs">
        <label className="flex items-center gap-1.5">
          <span className="text-muted">Linguagem</span>
          <select
            value={language}
            onChange={(e) => onLanguageChange(e.target.value as CodeLanguage)}
            className="rounded border border-border bg-surface px-1.5 py-0.5"
          >
            {CODE_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </label>
        <span className="hidden text-muted sm:inline">Ctrl+Espaço sugere · Tab indenta</span>
      </div>
      <Editor
        height="320px"
        language={language}
        // Uncontrolled: feeding every keystroke back as `value` makes Monaco drop characters while typing fast.
        defaultValue={value}
        onChange={(v) => onChange(v ?? "")}
        theme={dark ? "vs-dark" : "light"}
        beforeMount={registerPython}
        options={{
          fontSize: 14,
          tabSize: 4,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          wordWrap: "on",
          automaticLayout: true,
          fixedOverflowWidgets: true,
          padding: { top: 10 },
          quickSuggestions: { other: true, comments: false, strings: false },
          suggestOnTriggerCharacters: true,
          tabCompletion: "on",
          renderLineHighlight: "line",
          scrollbar: { alwaysConsumeMouseWheel: false },
        }}
      />
    </div>
  );
}
