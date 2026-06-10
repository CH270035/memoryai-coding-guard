// lib/installer.js
// Phase 1 skeleton — full implementation in Phase 4

import kleur from "kleur";
import { detectIDE } from "./detect-ide.js";

export async function run(opts) {
  console.log(kleur.bold().cyan("\n  MemoryAI Coding-Guard installer\n"));

  if (opts.dryRun) {
    console.log(kleur.yellow("  Running in --dry-run mode. No files will be written.\n"));
  }

  const detected = await detectIDE(process.cwd());

  if (detected.length === 0 && !opts.all) {
    console.log(kleur.yellow("  No supported IDE/CLI detected in this folder."));
    console.log(kleur.gray("  Use --all to install for all platforms anyway.\n"));
    return;
  }

  const targets = opts.only
    ? [opts.only]
    : opts.all
      ? null // means: all
      : detected;

  console.log(kleur.bold("  Detected/selected:"));
  for (const t of targets ?? ["all"]) {
    console.log(`    ${kleur.green("✓")} ${t}`);
  }

  console.log(
    kleur.gray("\n  Phase 1 build — installer logic lives in Phase 4."),
  );
  console.log(
    kleur.gray("  Run `coding-guard list` to see supported platforms.\n"),
  );
}
