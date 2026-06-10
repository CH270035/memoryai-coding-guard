// lib/detect-ide.js
// Scan current project for IDE/CLI signals.
// Phase 1: detection only. Returns list of platform IDs.

import { existsSync } from "node:fs";
import { join } from "node:path";

const SIGNALS = [
  { id: "cursor",         paths: [".cursor/rules", ".cursor"] },
  { id: "windsurf",       paths: [".windsurfrules", ".codeium"] },
  { id: "cline",          paths: [".clinerules", ".clinerules/"] },
  { id: "roo-code",       paths: [".roo/rules", ".roorules"] },
  { id: "kilo-code",      paths: [".kilocode/rules", ".kilocoderules"] },
  { id: "vscode-copilot", paths: [".github/copilot-instructions.md", ".vscode"] },
  { id: "jetbrains",      paths: [".junie", ".idea"] },
  { id: "aider",          paths: ["CONVENTIONS.md", ".aider.conf.yml"] },
  { id: "codex",          paths: ["AGENTS.md"] }, // shared with universal
  { id: "claude-code",    paths: ["CLAUDE.md", ".claude"] },
  { id: "gemini",         paths: ["GEMINI.md", ".gemini"] },
  { id: "universal",      paths: ["AGENTS.md"] },
];

export async function detectIDE(cwd) {
  const found = new Set();
  for (const sig of SIGNALS) {
    for (const p of sig.paths) {
      if (existsSync(join(cwd, p))) {
        found.add(sig.id);
        break;
      }
    }
  }
  return [...found];
}
