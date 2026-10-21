/** Languages the code editor offers; the value is both the Monaco id and the Markdown fence tag. */
export const CODE_LANGUAGES = [
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "sql", label: "SQL" },
] as const;
export type CodeLanguage = (typeof CODE_LANGUAGES)[number]["value"];

// Answers stay a single Markdown string (that is what the correction reads); the code is a marked fenced block at the end.
const MARKER = "<!-- codigo -->";
const BLOCK = new RegExp(`\\n*${MARKER}\\n\`\`\`(\\w+)\\n([\\s\\S]*?)\\n?\`\`\`\\s*$`);

export function splitCodeAnswer(text: string): { explanation: string; code: string; language: CodeLanguage } {
  const match = text.match(BLOCK);
  if (!match) return { explanation: text, code: "", language: "python" };
  const language = CODE_LANGUAGES.some((l) => l.value === match[1]) ? (match[1] as CodeLanguage) : "python";
  return { explanation: text.slice(0, match.index).trimEnd(), code: match[2], language };
}

export function joinCodeAnswer(explanation: string, code: string, language: CodeLanguage): string {
  const body = explanation.trimEnd();
  if (!code.trim()) return body;
  // A ``` line inside the code would close the fence early; four backticks is not needed for the exercises here.
  return `${body}${body ? "\n\n" : ""}${MARKER}\n\`\`\`${language}\n${code.replace(/\s+$/, "")}\n\`\`\``;
}
