// lib/validator.js
// Validate rules/skills/*.toml + rules/personas/*.toml + rules/commands/*.toml
// against the schema fields declared in rules/schema.json. Cheaper than wiring
// ajv; checks the high-leverage fields directly.

import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import toml from "@iarna/toml";
import kleur from "kleur";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const REQUIRED = {
  skills:   ["id", "title", "phase", "when", "process"],
  personas: ["id", "role", "summary"],
  commands: ["id", "trigger", "summary"],
};

const ID_PATTERN = {
  skills:   /^[a-z0-9-]+$/,
  personas: /^[a-z0-9-]+$/,
  commands: /^[a-z0-9:-]+$/,
};

const PHASE_VALUES = ["define", "plan", "build", "verify", "review", "ship", "meta"];

function loadDir(rel) {
  const dir = join(ROOT, rel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".toml"))
    .map((f) => ({ file: join(dir, f), data: toml.parse(readFileSync(join(dir, f), "utf8")) }));
}

function validate(kind, items) {
  const errors = [];
  for (const { file, data } of items) {
    for (const field of REQUIRED[kind]) {
      if (data[field] === undefined || data[field] === null || data[field] === "") {
        errors.push({ file, msg: `missing required field: ${field}` });
      }
    }
    if (data.id && !ID_PATTERN[kind].test(data.id)) {
      errors.push({ file, msg: `id "${data.id}" does not match ${ID_PATTERN[kind]}` });
    }
    if (kind === "skills" && data.phase && !PHASE_VALUES.includes(data.phase)) {
      errors.push({ file, msg: `phase "${data.phase}" not in ${PHASE_VALUES.join("|")}` });
    }
    if (kind === "skills" && Array.isArray(data.rationalizations)) {
      for (const r of data.rationalizations) {
        if (!r.lie || !r.truth) errors.push({ file, msg: `rationalization missing lie/truth pair` });
      }
    }
  }
  return errors;
}

export async function validateAll() {
  console.log(kleur.bold().cyan("\n  Validating rule artifacts\n"));
  let totalErrors = 0;
  for (const kind of ["skills", "personas", "commands"]) {
    const items = loadDir(`rules/${kind}`);
    const errors = validate(kind, items);
    if (errors.length === 0) {
      console.log(`  ${kleur.green("✓")} ${kind.padEnd(10)} ${kleur.gray(`${items.length} item(s)`)}`);
    } else {
      console.log(`  ${kleur.red("✗")} ${kind}`);
      for (const e of errors) {
        console.log(`      ${kleur.red("ERROR")} ${e.file}: ${e.msg}`);
      }
      totalErrors += errors.length;
    }
  }
  console.log();
  if (totalErrors > 0) {
    console.log(kleur.red(`  ${totalErrors} validation error(s).\n`));
    process.exit(1);
  }
  console.log(kleur.green("  All artifacts valid.\n"));
}

if (process.argv[1]) {
  const here = fileURLToPath(import.meta.url);
  if (here === process.argv[1]) await validateAll();
}
