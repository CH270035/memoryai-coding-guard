#!/usr/bin/env node
// runtimes/hooks/scripts/detect-red-flags.js
// PostToolUse(Edit|Write|MultiEdit): scan the changed file content for
// observable anti-patterns from constitution red_flags arrays. Warn,
// don't block.

import { readFileSync, existsSync } from "node:fs";

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

const PATTERNS = [
  { rule: "anti-fake-verify",  re: /\b(it\.|x|f)?(skip|xit)\(/,             msg: "Test skipped (it.skip / xit)" },
  { rule: "anti-fake-verify",  re: /\/\/\s*(expect|assert|should)\s*\(/,    msg: "Assertion commented out" },
  { rule: "anti-fake-verify",  re: /--no-verify\b/,                          msg: "--no-verify reference in code" },
  { rule: "simplicity-first",  re: /\binterface\s+\w+\s*\{[^}]{1,40}\}\s*$/m, msg: "Tiny interface (likely single-use abstraction)" },
  { rule: "surgical-changes",  re: /^\s*\/\/\s*TODO:\s*(remove|clean|refactor)/im, msg: "Leftover TODO from drive-by edit" },
  { rule: "anti-hallucinate",  re: /\b(should|typically|probably)\s+(work|exist|return)\b/i, msg: "Hedge-word claim about API behavior" },
];

const input = read();
const tool = input?.tool_name || input?.tool || "";
const content = input?.tool_input?.new_string || input?.tool_input?.content || "";
if (!content) process.exit(0);

const hits = [];
for (const p of PATTERNS) {
  if (p.re.test(content)) hits.push(p);
}
if (!hits.length) process.exit(0);

process.stderr.write(`[coding-guard] red flags detected after ${tool}:\n`);
for (const h of hits) process.stderr.write(`  • [${h.rule}] ${h.msg}\n`);
process.stderr.write("Address before claiming done.\n");
process.exit(0); // warn-only, don't block
