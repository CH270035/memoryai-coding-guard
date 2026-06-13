#!/usr/bin/env node
// runtimes/hooks/scripts/stop-gate.js
// Stop hook: if code was edited this session AND build/test never ran,
// block "task complete" and prompt to verify.
//
// v2: also requires evidence — exit code paste + tail:20 from build log —
// recorded in session-state.json by the user (or a future verify-runner).

import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const STATE_FILE = join(process.env.CLAUDE_PROJECT_DIR || ".", ".coding-guard", "session-state.json");

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return { editsCount: 0, verifiedAt: null, evidence: null };
  try { return JSON.parse(readFileSync(STATE_FILE, "utf8")); } catch { return { editsCount: 0, verifiedAt: null, evidence: null }; }
}

const state = loadState();

// 1. Code touched but no verify ran since last edit → block.
if (state.editsCount > 0 && !state.verifiedAt) {
  process.stderr.write(
    `[coding-guard] BLOCKED: ${state.editsCount} edit(s) made but no build/test ran.\n` +
    `Run the project's verification command and paste the exit code.\n` +
    `Suggested: npm test / pytest / cargo test / go test ./...\n` +
    `If verification truly does not apply, explicitly say "skip-verify" with reason.\n`,
  );
  process.exit(2);
}

// 2. Verify ran but evidence missing → block (anti-fake-verify gate).
if (state.verifiedAt && (!state.evidence || typeof state.evidence.exitCode !== "number")) {
  process.stderr.write(
    `[coding-guard] BLOCKED: verify ran but no evidence recorded.\n` +
    `Required evidence per verification_graph node:\n` +
    `  - exit_code (number)\n` +
    `  - tail:20 (last 20 lines of build/test output)\n` +
    `Update .coding-guard/session-state.json or rerun and paste both.\n`,
  );
  process.exit(2);
}

// 3. Evidence present but exit non-zero → block.
if (state.evidence && state.evidence.exitCode !== 0) {
  process.stderr.write(
    `[coding-guard] BLOCKED: last verify exited ${state.evidence.exitCode}.\n` +
    `Don't claim done while red. Fix the failure first.\n`,
  );
  process.exit(2);
}

process.exit(0);
