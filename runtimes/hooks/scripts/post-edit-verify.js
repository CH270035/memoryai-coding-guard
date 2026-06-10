#!/usr/bin/env node
// runtimes/hooks/scripts/post-edit-verify.js
// PostToolUse(Edit|Write|MultiEdit): track edit count + auto-detect project type.
// Records to .coding-guard/session-state.json so stop-gate can decide.

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const PROJECT_DIR = process.env.CLAUDE_PROJECT_DIR || ".";
const STATE_FILE = join(PROJECT_DIR, ".coding-guard", "session-state.json");

function read() {
  try { return JSON.parse(readFileSync(0, "utf8")); } catch { return {}; }
}

function loadState() {
  if (!existsSync(STATE_FILE)) return { editsCount: 0, verifiedAt: null, lastEdit: null };
  try { return JSON.parse(readFileSync(STATE_FILE, "utf8")); } catch { return { editsCount: 0, verifiedAt: null, lastEdit: null }; }
}

function saveState(s) {
  if (!existsSync(dirname(STATE_FILE))) mkdirSync(dirname(STATE_FILE), { recursive: true });
  writeFileSync(STATE_FILE, JSON.stringify(s, null, 2));
}

function detectProject() {
  const checks = [
    ["package.json", "node",   "npm test && npm run lint"],
    ["pyproject.toml", "python", "pytest -x && ruff check ."],
    ["Cargo.toml",   "rust",   "cargo test && cargo clippy -- -D warnings"],
    ["go.mod",       "go",     "go test ./... && go vet ./..."],
    ["pom.xml",      "java",   "mvn test verify"],
    ["build.gradle", "gradle", "./gradlew test"],
  ];
  for (const [file, type, cmd] of checks) {
    if (existsSync(join(PROJECT_DIR, file))) return { type, cmd };
  }
  return { type: "unknown", cmd: null };
}

read(); // drain stdin
const state = loadState();
state.editsCount = (state.editsCount || 0) + 1;
state.lastEdit = new Date().toISOString();
state.verifiedAt = null; // any new edit invalidates previous verify
state.project = detectProject();
saveState(state);

// Friendly hint after every 3 edits
if (state.editsCount % 3 === 0 && state.project.cmd) {
  process.stderr.write(
    `[coding-guard hint] ${state.editsCount} edits since last verify. ` +
    `Consider running: ${state.project.cmd}\n`,
  );
}

process.exit(0);
