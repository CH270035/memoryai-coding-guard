#!/usr/bin/env node
// bin/cli.js
// @memoryai.dev/coding-guard CLI entry
// Commands: install, update, doctor, list, sync, verify, sign

import { Command } from "commander";
import kleur from "kleur";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { readFileSync } from "node:fs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(__dirname, "..", "package.json"), "utf8"),
);

const program = new Command();

program
  .name("coding-guard")
  .description(
    "Universal coding-agent guardrails. 4 core principles + anti-sloppy enforcement, installs into 11 IDE/CLI in one command.",
  )
  .version(pkg.version);

program
  .command("install")
  .description("Detect IDE/CLI in current project and install rule files")
  .option("--only <platform>", "Install only for specified platform")
  .option("--all", "Install for all platforms regardless of detection")
  .option("--dry-run", "Show what would be installed without writing")
  .action(async (opts) => {
    const { run } = await import("../lib/installer.js");
    await run(opts);
  });

program
  .command("update")
  .description("Update installed rules to latest version")
  .action(async () => {
    const { spawnSync } = await import("node:child_process");
    console.log(kleur.cyan("Reinstalling latest from npm…"));
    const r = spawnSync("npm", ["install", "-g", "@memoryai.dev/coding-guard@latest"], { stdio: "inherit", shell: true });
    process.exit(r.status ?? 0);
  });

program
  .command("doctor")
  .description("Check installation health and signature integrity")
  .action(async () => {
    const { doctor } = await import("../lib/doctor.js");
    await doctor();
  });

program
  .command("list")
  .description("List supported platforms")
  .action(() => {
    const platforms = [
      ["claude-code",       "Claude Code CLI",          "CLAUDE.md + plugin/hooks"],
      ["cursor",            "Cursor IDE",               ".cursor/rules/*.mdc"],
      ["windsurf",          "Windsurf (Codeium)",       ".windsurfrules"],
      ["cline",             "Cline (VS Code ext)",      ".clinerules"],
      ["roo-code",          "Roo Code",                 ".roo/rules/"],
      ["kilo-code",         "Kilo Code",                ".kilocode/rules/"],
      ["vscode-copilot",    "GitHub Copilot",           ".github/copilot-instructions.md"],
      ["jetbrains",         "JetBrains Junie",          ".junie/guidelines.md"],
      ["aider",             "Aider CLI",                "CONVENTIONS.md + .aider.conf.yml"],
      ["codex",             "OpenAI Codex CLI",         "AGENTS.md + ~/.codex/config.toml"],
      ["gemini",            "Gemini CLI",               "GEMINI.md + ~/.gemini/settings.json"],
      ["universal",         "OpenCode/Continue/Crush",  "AGENTS.md (de-facto standard)"],
    ];
    console.log(kleur.bold("\nSupported platforms:\n"));
    for (const [id, name, file] of platforms) {
      console.log(`  ${kleur.green(id.padEnd(18))} ${kleur.white(name.padEnd(30))} ${kleur.gray(file)}`);
    }
    console.log();
  });

program
  .command("sync")
  .description("Rebuild platform files from rules/constitution.toml")
  .action(async () => {
    const { build } = await import("../lib/builder.js");
    await build();
  });

program
  .command("verify")
  .description("Verify Ed25519 signature of constitution.toml")
  .action(async () => {
    const { verify } = await import("../lib/signer.js");
    await verify();
  });

program
  .command("sign")
  .description("Sign constitution.toml (maintainers only)")
  .action(async () => {
    const { sign } = await import("../lib/signer.js");
    await sign();
  });

program.parseAsync(process.argv);
