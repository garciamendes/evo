// Copies the Monaco editor build into public/ so the code editor loads from this site instead of a CDN.
import { cpSync, existsSync, readFileSync, rmSync } from "node:fs";

const { version } = JSON.parse(readFileSync("node_modules/monaco-editor/package.json", "utf8"));
const target = `public/monaco/${version}/vs`;
if (!existsSync(target)) {
  rmSync("public/monaco", { recursive: true, force: true });
  cpSync("node_modules/monaco-editor/min/vs", target, { recursive: true });
}
console.log(`monaco-editor ${version} -> ${target}`);
