#!/usr/bin/env node
// runtimes/hooks/scripts/inject-rules.js
// UserPromptSubmit: when user says "done|ship|deploy|merge",
// inject reminder of the 4 core principles + verify gate.

import { readFileSync } from "node:fs";

function read() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

const input = read();
const prompt = (input?.prompt || "").toLowerCase();

const TRIGGER = /\b(done|ship|deploy|merge|finished|complete|ready)\b/;

if (TRIGGER.test(prompt)) {
  // Output is appended as system context for the next response
  process.stdout.write(`
[coding-guard reminder]
Before claiming done:
1. THINK — assumptions stated? edge cases considered?
2. SIMPLE — is the diff minimum? any speculative abstraction?
3. SURGICAL — every changed line traces to the request?
4. VERIFY — paste real exit code from build/test/lint. No "looks good" without evidence.

If any answer is no, do NOT claim done. Loop until verified.
`);
}

process.exit(0);
