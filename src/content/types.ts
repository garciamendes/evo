export type Track = "programacao" | "ingles" | "ia";

export const TRACK_LABEL: Record<Track, string> = {
  programacao: "Programação",
  ingles: "Inglês",
  ia: "IA",
};

export type Activity = {
  id: string;
  track: Track;
  title: string;
  description: string;
  minutes: number;
  /** Optional link to the lesson or challenge inside the site. */
  href?: string;
};

export type RoadmapDay = {
  day: number;
  week: number;
  focus: string;
  activities: Activity[];
  /** One small task for low-energy days (10–20 min). */
  minimum: Activity;
};

export type RoadmapWeek = {
  week: number;
  title: string;
  goals: Record<Track, string>;
};

export type Challenge = {
  id: string;
  title: string;
  level: "iniciante" | "intermediário" | "entrevista";
  objective: string;
  concepts: string[];
  requirements: string[];
  files: string[];
  steps: string[];
  acceptance: string[];
  tests: string[];
  reflection: string[];
  /** Ordered from vague to specific; revealed one at a time. */
  hints: string[];
};

export type Phrase = { en: string; pt: string; pron?: string };

export type EnglishUnit = {
  id: string;
  title: string;
  skill: string;
  explanation: string[];
  examples: Phrase[];
  vocabulary: Phrase[];
  reading?: { text: string; questions: string[] };
  listening: string[];
  exercise: { instructions: string; items: string[] };
};

export type AiStage = {
  id: string;
  stage: number;
  title: string;
  goal: string;
  lessons: { title: string; points: string[] }[];
  exercise: { title: string; task: string; criteria: string[] };
};

export type HomeworkStatus = "aberto" | "entregue" | "corrigido";

export type Homework = {
  id: string;
  number: number;
  title: string;
  status: HomeworkStatus;
  track: Track;
  folder: string;
  branch: string;
  summary: string;
  requirements: string[];
  acceptance: string[];
  challengeId?: string;
  /** Link to the PR once delivered. */
  prUrl?: string;
  feedback?: string;
};
