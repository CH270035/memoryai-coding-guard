// lib/installer.js
// Installer: detects IDE/CLI in current project + copies the right
// files from platforms/ → user's project.

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import kleur from "kleur";
import { detectIDE } from "./detect-ide.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const PLATFORMS_DIR = join(ROOT, "platforms");

// Map platform-id → list of source files (relative to platforms/<id>/)
// to copy to user's cwd.
const PLATFORM_MAP = {
  "claude-code":    { dir: "claude-code" },
  "cursor":         { dir: "cursor" },
  "windsurf":       { dir: "windsurf" },
  "cline":          { dir: "cline" },
  "roo-code":       { dir: "roo-code" },
  "kilo-code":      { dir: "kilo-code" },
  "vscode-copilot": { dir: "vscode-copilot" },
  "jetbrains":      { dir: "jetbrains" },
  "aider":          { dir: "aider" },
  "codex":          { dir: "codex" },
  "gemini":         { dir: "gemini" },
  "universal":      { dir: "universal" },
};

function copyTree(src, dst, dryRun) {
  if (!existsSync(src)) return [];
  const written = [];
  for (const entry of readdirSync(src)) {
    const s = join(src, entry);
    const d = join(dst, entry);
    if (statSync(s).isDirectory()) {
      if (!dryRun && !existsSync(d)) mkdirSync(d, { recursive: true });
      written.push(...copyTree(s, d, dryRun));
    } else {
      if (!dryRun) {
        if (!existsSync(dirname(d))) mkdirSync(dirname(d), { recursive: true });
        cpSync(s, d);
      }
      written.push(d);
    }
  }
  return written;
}

export async function run(opts) {
  const cwd = process.cwd();
  console.log(kleur.bold().cyan("\n  MemoryAI Coding-Guard installer\n"));

  if (opts.dryRun) {
    console.log(kleur.yellow("  --dry-run mode: no files will be written.\n"));
  }

  let targets;
  if (opts.only) {
    targets = [opts.only];
  } else if (opts.all) {
    targets = Object.keys(PLATFORM_MAP);
  } else {
    targets = await detectIDE(cwd);
  }

  // Avoid AGENTS.md conflict: codex + universal both write AGENTS.md.
  // If both selected, drop "universal" (codex AGENTS.md is more specific).
  if (targets.includes("codex") && targets.includes("universal")) {
    targets = targets.filter((t) => t !== "universal");
    console.log(kleur.gray("  Note: skipping 'universal' AGENTS.md — codex already provides one.\n"));
  }

  if (targets.length === 0) {
    console.log(kleur.yellow("  No supported IDE/CLI detected in this folder."));
    console.log(kleur.gray("  Use --all to install for all platforms anyway.\n"));
    return;
  }

  console.log(kleur.bold("  Installing for:"));
  let totalWritten = 0;
  for (const id of targets) {
    if (!PLATFORM_MAP[id]) {
      console.log(`    ${kleur.red("✗")} ${id} (unknown platform)`);
      continue;
    }
    const src = join(PLATFORMS_DIR, PLATFORM_MAP[id].dir);
    const written = copyTree(src, cwd, opts.dryRun);
    totalWritten += written.length;
    console.log(`    ${kleur.green("✓")} ${id.padEnd(18)} ${kleur.gray(`(${written.length} file${written.length === 1 ? "" : "s"})`)}`);
    for (const f of written) {
      console.log(kleur.gray(`        ${relative(cwd, f)}`));
    }
  }

  console.log();
  if (opts.dryRun) {
    console.log(kleur.yellow(`  Would write ${totalWritten} file(s). Run without --dry-run to apply.\n`));
  } else {
    console.log(kleur.green(`  Installed ${totalWritten} file(s).\n`));
    console.log(kleur.gray("  Commit them to your repo so the rules apply consistently for your team.\n"));
  }
}
