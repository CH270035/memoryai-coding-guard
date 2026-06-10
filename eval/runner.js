// eval/runner.js
// Skeleton: validate task definitions parse correctly.
// Real LLM-driven runs ship in v1.1 with API key wiring.

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import kleur from "kleur";

const __dirname = dirname(fileURLToPath(import.meta.url));
const TASKS_DIR = join(__dirname, "tasks");

function parseTask(content) {
  const sections = {};
  let current = null;
  for (const line of content.split("\n")) {
    const m = line.match(/^##\s+(.+)$/);
    if (m) {
      current = m[1].trim();
      sections[current] = [];
    } else if (current) {
      sections[current].push(line);
    }
  }
  return sections;
}

function validateTask(file, content) {
  const required = ["Setup", "User request (verbatim)", "Expected scope", "Success criteria", "Metrics targeted"];
  const sections = parseTask(content);
  const missing = required.filter((r) => !sections[r]);
  return { ok: missing.length === 0, missing };
}

const taskFiles = existsSync(TASKS_DIR) ? readdirSync(TASKS_DIR).filter((f) => f.endsWith(".md")) : [];

console.log(kleur.bold().cyan("\n  Eval harness — validating task definitions\n"));

let pass = 0, fail = 0;
for (const f of taskFiles) {
  const content = readFileSync(join(TASKS_DIR, f), "utf8");
  const r = validateTask(f, content);
  if (r.ok) {
    console.log(`  ${kleur.green("✓")} ${f}`);
    pass++;
  } else {
    console.log(`  ${kleur.red("✗")} ${f}  missing: ${r.missing.join(", ")}`);
    fail++;
  }
}

console.log();
console.log(kleur.bold(`  ${pass} valid, ${fail} invalid\n`));

if (taskFiles.length === 0) {
  console.log(kleur.yellow("  No task files found. See eval/README.md to add tasks.\n"));
}

process.exit(fail > 0 ? 1 : 0);
