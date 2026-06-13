// lib/doctor.js
// Health check: verify install integrity, signature, hook setup.

import { existsSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import kleur from "kleur";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

export async function doctor() {
  console.log(kleur.bold().cyan("\n  MemoryAI Coding-Guard — Health Check\n"));

  const checks = [];

  // 1. Constitution exists
  const constPath = join(ROOT, "rules", "constitution.toml");
  checks.push({
    name: "constitution.toml present",
    ok: existsSync(constPath),
    info: constPath,
  });

  // 2. Schema exists
  checks.push({
    name: "schema.json present",
    ok: existsSync(join(ROOT, "rules", "schema.json")),
  });

  // 3. Predicates exist
  const preds = ["think.ts", "simple.ts", "surgical.ts", "goal.ts"];
  for (const p of preds) {
    checks.push({
      name: `predicate ${p}`,
      ok: existsSync(join(ROOT, "rules", "predicates", p)),
    });
  }

  // 4. Lineage exists
  const lineagePath = join(ROOT, "rules", "lineage.jsonl");
  checks.push({
    name: "lineage.jsonl present",
    ok: existsSync(lineagePath),
  });

  // 5. Constitution hash
  if (existsSync(constPath)) {
    const hash = createHash("sha256").update(readFileSync(constPath)).digest("hex");
    checks.push({
      name: "constitution sha256",
      ok: true,
      info: `sha256:${hash.slice(0, 16)}…`,
    });
  }

  // 6. Signature
  const sigPath = join(ROOT, "rules", "constitution.toml.sig");
  checks.push({
    name: "Ed25519 signature",
    ok: existsSync(sigPath),
    info: existsSync(sigPath) ? "signed" : "unsigned (dev build)",
    warn: !existsSync(sigPath),
  });

  // 7. All 11 platforms have files
  const platforms = ["claude-code","cursor","windsurf","cline","roo-code","kilo-code","vscode-copilot","jetbrains","aider","codex","gemini","universal"];
  for (const p of platforms) {
    checks.push({
      name: `platform/${p}`,
      ok: existsSync(join(ROOT, "platforms", p)),
    });
  }

  // 8. Skills, personas, commands directories
  for (const kind of ["skills", "personas", "commands"]) {
    const dir = join(ROOT, "rules", kind);
    let count = 0;
    if (existsSync(dir)) {
      const { readdirSync } = await import("node:fs");
      count = readdirSync(dir).filter((f) => f.endsWith(".toml")).length;
    }
    checks.push({
      name: `rules/${kind}`,
      ok: count > 0,
      info: `${count} item(s)`,
      warn: count === 0,
    });
  }

  // 9. References + NOTICE
  for (const ref of ["security-checklist.md", "performance-checklist.md", "accessibility-checklist.md", "testing-patterns.md"]) {
    checks.push({
      name: `references/${ref}`,
      ok: existsSync(join(ROOT, "references", ref)),
    });
  }
  checks.push({
    name: "NOTICE (attribution)",
    ok: existsSync(join(ROOT, "NOTICE")),
  });

  // Print
  let pass = 0, fail = 0, warn = 0;
  for (const c of checks) {
    if (c.ok && !c.warn) {
      console.log(`  ${kleur.green("✓")} ${c.name}${c.info ? kleur.gray(`  ${c.info}`) : ""}`);
      pass++;
    } else if (c.warn) {
      console.log(`  ${kleur.yellow("⚠")} ${c.name}${c.info ? kleur.gray(`  ${c.info}`) : ""}`);
      warn++;
    } else {
      console.log(`  ${kleur.red("✗")} ${c.name}${c.info ? kleur.gray(`  ${c.info}`) : ""}`);
      fail++;
    }
  }

  console.log();
  console.log(kleur.bold(`  Summary: ${kleur.green(pass + " pass")}, ${kleur.yellow(warn + " warn")}, ${kleur.red(fail + " fail")}\n`));

  if (fail > 0) process.exit(1);
}
