"use client";

import { useSyncExternalStore } from "react";

const VOICE_KEY = "studyhub:voice";

// Joke/legacy voices that ship with macOS/iOS and the eSpeak voices on Linux sound robotic.
const BAD_VOICE = /espeak|albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy/i;
const GOOD_VOICE = /natural|neural|online|enhanced|premium|google|samantha|ava|allison|aria|jenny|guy/i;

function score(voice: SpeechSynthesisVoice): number {
  const lang = voice.lang.replace("_", "-").toLowerCase();
  if (!lang.startsWith("en")) return -1;
  let s = 0;
  if (lang === "en-us") s += 4;
  else if (lang === "en-gb") s += 2;
  if (GOOD_VOICE.test(voice.name)) s += 5;
  if (BAD_VOICE.test(voice.name)) s -= 10;
  if (!voice.localService) s += 1; // cloud voices are usually the higher-quality ones
  return s;
}

let cached: SpeechSynthesisVoice[] = [];

/** English voices, best first. getVoices() returns a new array each call, so cache it for useSyncExternalStore. */
function englishVoices(): SpeechSynthesisVoice[] {
  const all = window.speechSynthesis.getVoices();
  const english = all.filter((v) => score(v) >= 0).sort((a, b) => score(b) - score(a));
  if (english.length !== cached.length || english.some((v, i) => v !== cached[i])) cached = english;
  return cached;
}

function subscribeVoices(onChange: () => void) {
  window.speechSynthesis.addEventListener("voiceschanged", onChange);
  return () => window.speechSynthesis.removeEventListener("voiceschanged", onChange);
}

const noopSubscribe = () => () => {};
const emptyVoices: SpeechSynthesisVoice[] = [];

/** null on the server; speechSynthesis only exists in the browser. */
export function useSpeechSupported(): boolean | null {
  return useSyncExternalStore(noopSubscribe, () => "speechSynthesis" in window, () => null);
}

/** English voices available in this browser, best first. They load asynchronously in Chrome. */
export function useEnglishVoices(supported: boolean | null): SpeechSynthesisVoice[] {
  return useSyncExternalStore(
    supported ? subscribeVoices : noopSubscribe,
    () => (supported ? englishVoices() : emptyVoices),
    () => emptyVoices,
  );
}

export function savedVoiceName(): string | null {
  try {
    return window.localStorage.getItem(VOICE_KEY);
  } catch {
    return null;
  }
}

export function saveVoiceName(name: string) {
  try {
    window.localStorage.setItem(VOICE_KEY, name);
  } catch {
    // Private mode: the choice just isn't remembered.
  }
}

export function speakEnglish(text: string, voice: SpeechSynthesisVoice | undefined, rate: number) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? "en-US";
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  window.speechSynthesis.speak(utterance);
}
