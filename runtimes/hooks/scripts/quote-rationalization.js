#!/usr/bin/env node
// runtimes/hooks/scripts/quote-rationalization.js
// UserPromptSubmit hook: when the user's message matches a known
// "lie" pattern from constitution.toml rationalizations, quote it
// back as system context before the model responds.

import { readFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

function findConstitution() {
  const candidates = [
    process.env.CODING_GUARD_CONSTITUTION,
    join(process.cwd(), "rules", "constitution.toml"),
    join(__dirname, "..", "..", "..", "rules", "constitution.toml"),
  ].filter(Boolean);
  for (const p of candidates) if (existsSync(p)) return p;
  return null;
}

function loadRationalizations(path) {
  if (!path) return [];
  // Lightweight TOML scrape — avoid importing @iarna/toml in hook hot path.
  const text = readFileSync(path, "utf8");
  const out = [];
  const re = /\{\s*lie\s*=\s*"([^"]+)"\s*,\s*truth\s*=\s*"([^"]+)"\s*\}/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    out.push({ lie: m[1], truth: m[2] });
  }
  return out;
}

const KEYWORDS = [
  /\bskip\s+the\s+test/i,
  /\b--no-verify\b/,
  /\blooks?\s+(good|right|fine)\s*[,.]?\s*(commit|ship|done|merge)/i,
  /\bjust\s+(fix|patch|tweak)\b/i,
  /\bI'?ll?\s+add\s+tests?\s+later\b/i,
  /\boverkill\b/i,
  /\bclean\s*up\s+while\s+I'?m\s+here\b/i,
];

const input = read();
const prompt = (input?.prompt || "").toLowerCase();

if (!KEYWORDS.some((re) => re.test(prompt))) {
  process.exit(0);
}

const rats = loadRationalizations(findConstitution());
if (!rats.length) process.exit(0);

const matches = rats.filter((r) => {
  const lieKey = r.lie.toLowerCase().split(/\s+/).slice(0, 3).join(" ");
  return prompt.includes(lieKey) || lieKey.split(" ").some((w) => w.length > 4 && prompt.includes(w));
}).slice(0, 3);

if (!matches.length) process.exit(0);

process.stdout.write(`
[coding-guard] These rationalizations match what you just said:
`);
for (const m of matches) {
  process.stdout.write(`  • Lie:   "${m.lie}"\n`);
  process.stdout.write(`    Truth: "${m.truth}"\n`);
}
process.stdout.write("\nProceed only if the truth doesn't apply here. Otherwise, stop and reconsider.\n");
process.exit(0);
