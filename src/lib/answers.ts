// Shared shapes for answers saved in the data repository:
//   respostas/<id>.json  written by the site when you answer
//   correcoes/<id>.md    written by the reviewer; its first line is
//                        <!-- revisao: N --> naming the answer revision it corrects

export type AnswerStatus = "rascunho" | "enviado";

export type Answer = {
  id: string;
  title: string;
  answer: string;
  status: AnswerStatus;
  /** Increments on every submission for correction. */
  revision: number;
  updatedAt: string;
  submittedAt?: string;
};

export type AnswerView = {
  answer: Answer | null;
  feedback: string | null;
  feedbackRevision: number | null;
};

export type AnswerSummary = {
  id: string;
  title: string;
  status: AnswerStatus;
  revision: number;
  updatedAt: string;
  corrected: boolean;
};

const ID_PATTERN = /^[a-z0-9-]{1,40}$/;

export function isValidAnswerId(id: string): boolean {
  return ID_PATTERN.test(id);
}

export function parseFeedback(markdown: string): { text: string; revision: number | null } {
  const match = markdown.match(/^<!--\s*revisao:\s*(\d+)\s*-->\s*\n?/);
  if (!match) return { text: markdown.trim(), revision: null };
  return { text: markdown.slice(match[0].length).trim(), revision: Number(match[1]) };
}

/** True when the latest submitted revision already has a correction. */
export function isCorrected(answer: Answer | null, feedback: string | null, feedbackRevision: number | null): boolean {
  if (!answer || answer.revision === 0 || feedback === null) return false;
  // A correction without a revision marker counts for whatever was submitted.
  return feedbackRevision === null ? true : feedbackRevision >= answer.revision;
}
