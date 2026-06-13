// eval/builder-snapshot.test.js
// Smoke test: rebuild and assert per-platform file counts match expectation.
// Run with: node --test eval/builder-snapshot.test.js

import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { build } from "../lib/builder.js";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function countFiles(dir) {
  if (!existsSync(dir)) return 0;
  let n = 0;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) n += countFiles(p);
    else n++;
  }
  return n;
}

const EXPECTED = {
  "claude-code":     21,
  "cursor":          13,
  "windsurf":         1,
  "cline":            1,
  "roo-code":        12,
  "kilo-code":        8,
  "vscode-copilot":  23,
  "jetbrains":        1,
  "aider":            2,
  "codex":            3,
  "gemini":          25,
  "universal":        1,
};

test("builder produces expected file counts per platform", async () => {
  await build();
  for (const [pid, expected] of Object.entries(EXPECTED)) {
    const dir = join(ROOT, "platforms", pid);
    const actual = countFiles(dir);
    assert.equal(actual, expected, `${pid}: expected ${expected} files, got ${actual}`);
  }
});
