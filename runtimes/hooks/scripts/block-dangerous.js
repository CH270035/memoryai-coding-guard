#!/usr/bin/env node
// runtimes/hooks/scripts/block-dangerous.js
// PreToolUse(Bash): regex-block destructive commands.
// Reads tool input from stdin (Claude Code hook protocol).

import { readFileSync } from "node:fs";

const FORBIDDEN = [
  { pattern: /\brm\s+-rf?\s+\//, reason: "rm -rf on /" },
  { pattern: /\brm\s+-[rfRF]+/, reason: "Recursive delete (rm -rf)" },
  { pattern: /\bgit\s+push\s+(-f|--force)/, reason: "git push --force" },
  { pattern: /\bgit\s+reset\s+--hard/, reason: "git reset --hard" },
  { pattern: /\bgit\s+clean\s+-[fdF]+/, reason: "git clean -fd" },
  { pattern: /\bgit\s+commit\b.*\b(--no-verify|-n)\b/, reason: "git commit --no-verify (skip hooks)" },
  { pattern: /\bgit\s+push\b.*\b--no-verify\b/, reason: "git push --no-verify" },
  { pattern: /\bDROP\s+(TABLE|DATABASE|SCHEMA)\b/i, reason: "DROP TABLE/DATABASE/SCHEMA" },
  { pattern: /\bTRUNCATE\s+TABLE\b/i, reason: "TRUNCATE TABLE" },
  { pattern: /\bchmod\s+-R\s+777\b/, reason: "chmod -R 777" },
  { pattern: /\b:\(\)\{.*\|.*&\}\;:/, reason: "fork bomb" },
  { pattern: />\s*\/dev\/sd[a-z]/, reason: "write to raw disk" },
  { pattern: /\bdd\s+if=.*of=\/dev\//, reason: "dd to device" },
];

function read() {
  try {
    return JSON.parse(readFileSync(0, "utf8"));
  } catch {
    return {};
  }
}

const input = read();
const cmd = input?.tool_input?.command || "";

for (const { pattern, reason } of FORBIDDEN) {
  if (pattern.test(cmd)) {
    process.stderr.write(
      `[coding-guard] BLOCKED: ${reason}\n` +
      `Command: ${cmd}\n` +
      `If you genuinely need this, ask the user to confirm explicitly.\n`,
    );
    process.exit(2); // exit 2 = block tool call, send stderr to Claude
  }
}

process.exit(0); // allow
