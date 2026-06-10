#!/usr/bin/env node
// runtimes/hooks/scripts/stop-gate.js
// Stop hook: if code was edited this session AND build/test never ran,
// block "task complete" and prompt to verify.

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const STATE_FILE = join(process.env.CLAUDE_PROJECT_DIR || ".", ".coding-guard", "session-state.json");

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return { editsCount: 0, verifiedAt: null };
  try { return JSON.parse(readFileSync(STATE_FILE, "utf8")); } catch { return { editsCount: 0, verifiedAt: null }; }
}

const state = loadState();

// If code touched but no verify ran since last edit → block stop
if (state.editsCount > 0 && !state.verifiedAt) {
  process.stderr.write(
    `[coding-guard] BLOCKED: ${state.editsCount} edit(s) made but no build/test ran.\n` +
    `Run the project's verification command and paste the exit code.\n` +
    `Suggested: npm test / pytest / cargo test / go test ./...\n` +
    `If verification truly does not apply, explicitly say "skip-verify" with reason.\n`,
  );
  process.exit(2);
}

process.exit(0);
