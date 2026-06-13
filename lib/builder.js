// lib/builder.js
// Compose rules/constitution.toml + rules/skills/*.toml + rules/personas/*.toml
// + rules/commands/*.toml → platforms/<id>/* outputs.
//
// Per-platform delivery matrix (see docs/INTEGRATION.md):
//   native    — file-per-skill in a folder the platform reads directly
//   file-per  — file-per-skill in a folder the platform inlines via rules
//   inline    — flatten top-N skills into the main rules file
//   drop      — feature unavailable on the platform

import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath } from "node:url";
import toml from "@iarna/toml";
import kleur from "kleur";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

// ──────────────────────────────────────────────────────────────────
// Load source artifacts
// ──────────────────────────────────────────────────────────────────

function loadConstitution() {
  return toml.parse(readFileSync(join(ROOT, "rules", "constitution.toml"), "utf8"));
}

function loadDir(rel) {
  const dir = join(ROOT, rel);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".toml"))
    .map((f) => toml.parse(readFileSync(join(dir, f), "utf8")));
}

// Top-N skills selected when a platform can only inline (Aider, Junie, Codex).
const INLINE_TOP_N = 3;
const INLINE_PRIORITY = [
  "spec-driven-development",
  "test-driven-development",
  "code-review-and-quality",
];

// ──────────────────────────────────────────────────────────────────
// Markdown rendering — shared helpers
// ──────────────────────────────────────────────────────────────────

function renderConstitutionHeader(c) {
  return `# Coding-Guard — Behavioral Guidelines for AI Coding Agents

> Source: \`@memoryai.dev/coding-guard\` constitution v${c.meta.version}
> Generated: do not edit by hand. Edit \`rules/constitution.toml\` then run \`coding-guard sync\`.
> Trade-off: caution > speed. For trivial tasks, use judgment.
`;
}

function renderRule(r, idx) {
  const title = `## ${idx}. ${r.title}`;
  const short = r.short ? `\n**${r.short.trim()}**\n` : "";
  const long = r.long ? `\n${r.long.trim()}\n` : "";
  let rationalizations = "";
  if (Array.isArray(r.rationalizations) && r.rationalizations.length) {
    rationalizations = "\n### Rationalizations to ignore\n\n";
    rationalizations += "| Lie you tell yourself | Why it's wrong |\n|---|---|\n";
    for (const x of r.rationalizations) rationalizations += `| ${x.lie} | ${x.truth} |\n`;
  }
  let redFlags = "";
  if (Array.isArray(r.red_flags) && r.red_flags.length) {
    redFlags = "\n### Red flags\n\n";
    for (const f of r.red_flags) redFlags += `- ${f}\n`;
  }
  return `${title}${short}${long}${rationalizations}${redFlags}`;
}

function renderConstitutionBody(c) {
  let out = "";
  c.rules.forEach((r, i) => { out += "\n" + renderRule(r, i + 1); });
  out += "\n## Verification graph\n\n";
  out += "Pre-commit and pre-merge gates require evidence at each node:\n\n";
  for (const n of c.verification_graph.nodes) {
    if (typeof n === "string") out += `- **${n}**\n`;
    else out += `- **${n.id}** — evidence: ${(n.evidence || []).join(", ") || "(none)"}\n`;
  }
  out += "\n## Verification commands (auto-detected)\n\n";
  for (const [k, v] of Object.entries(c.verification_commands || {})) {
    out += `- **${k}**: \`${v}\`\n`;
  }
  return out;
}

function renderSkillMarkdown(s) {
  let md = `---
name: ${s.id}
title: ${s.title}
phase: ${s.phase}
${s.source ? `source: ${s.source}\nsource-license: ${s.source_license || "MIT"}\n` : ""}---

# ${s.title}
`;
  if (s.when?.length) {
    md += "\n## When to use\n\n";
    for (const w of s.when) md += `- ${w}\n`;
  }
  if (s.process?.length) {
    md += "\n## Process\n\n";
    s.process.forEach((p, i) => { md += `${i + 1}. ${p}\n`; });
  }
  if (s.rationalizations?.length) {
    md += "\n## Rationalizations to ignore\n\n";
    md += "| Lie you tell yourself | Why it's wrong |\n|---|---|\n";
    for (const x of s.rationalizations) md += `| ${x.lie} | ${x.truth} |\n`;
  }
  if (s.red_flags?.length) {
    md += "\n## Red flags\n\n";
    for (const f of s.red_flags) md += `- ${f}\n`;
  }
  if (s.verification?.length) {
    md += "\n## Verification\n\n";
    for (const v of s.verification) md += `- ${v}\n`;
  }
  return md;
}

function renderPersonaMarkdown(p) {
  let md = `---
name: ${p.id}
role: ${p.role}
${p.source ? `source: ${p.source}\nsource-license: ${p.source_license || "MIT"}\n` : ""}---

# ${p.role}: ${p.id}

${p.summary?.trim() || ""}
`;
  if (p.axes?.length) {
    md += "\n## Review axes\n\n";
    for (const a of p.axes) md += `- ${a}\n`;
  }
  if (p.output_format) {
    md += `\n## Output format\n\n${p.output_format.trim()}\n`;
  }
  return md;
}

function renderCommandMarkdown(cmd) {
  return `---
description: ${cmd.summary}
---

${cmd.prompt?.trim() || ""}
`;
}

function renderInlineSkill(s) {
  let md = `\n### Skill: ${s.title} (\`${s.id}\`)\n\n*Phase: ${s.phase}.*\n`;
  if (s.when?.length) {
    md += "\nUse when:\n";
    for (const w of s.when.slice(0, 4)) md += `- ${w}\n`;
  }
  if (s.process?.length) {
    md += "\nProcess:\n";
    s.process.forEach((p, i) => { md += `${i + 1}. ${p}\n`; });
  }
  return md;
}

function renderInlinePersona(p) {
  return `\n### Persona: ${p.role} (\`${p.id}\`)\n\n${p.summary?.trim() || ""}\n`;
}

function renderURLRefs(skills) {
  let md = "\n## More skills (reference only)\n\n";
  for (const s of skills) {
    md += `- [${s.title}](${s.source || "#"}) — ${s.phase}\n`;
  }
  return md;
}

// ──────────────────────────────────────────────────────────────────
// Platform configuration
// ──────────────────────────────────────────────────────────────────

const PLATFORMS = {
  "claude-code": {
    mainFile: "CLAUDE.md",
    skills:    { mode: "native",   dir: ".claude/skills",   ext: ".md", structure: "folder-per-skill" },
    personas:  { mode: "native",   dir: ".claude/agents",   ext: ".md" },
    commands:  { mode: "native",   dir: ".claude/commands", ext: ".md" },
  },
  "cursor": {
    mainFile: ".cursor/rules/coding-guard.mdc",
    mainFrontmatter: (v) => `---\ndescription: MemoryAI Coding-Guard v${v} — 4 principles + anti-sloppy.\nalwaysApply: true\n---\n\n`,
    skills:    { mode: "file-per", dir: ".cursor/rules/skills",   ext: ".mdc", frontmatter: (s) => `---\ndescription: ${s.title}\nalwaysApply: false\n---\n` },
    personas:  { mode: "file-per", dir: ".cursor/rules/personas", ext: ".mdc", frontmatter: (p) => `---\ndescription: ${p.role}\nalwaysApply: false\n---\n` },
    commands:  { mode: "drop" },
  },
  "windsurf": {
    mainFile: ".windsurfrules",
    skills:    { mode: "inline",  topN: INLINE_TOP_N, urlRefs: true },
    personas:  { mode: "inline" },
    commands:  { mode: "drop" },
  },
  "cline": {
    mainFile: ".clinerules",
    skills:    { mode: "inline",  topN: INLINE_TOP_N, urlRefs: true },
    personas:  { mode: "inline" },
    commands:  { mode: "drop" },
  },
  "roo-code": {
    mainFile: ".roo/rules/00-coding-guard.md",
    skills:    { mode: "file-per", dir: ".roo/rules/skills",   ext: ".md" },
    personas:  { mode: "mode-map", dir: ".roo" }, // Roo modes already exist; we ship them separately
    commands:  { mode: "drop" }, // mode switch IS the command
  },
  "kilo-code": {
    mainFile: ".kilocode/rules/00-coding-guard.md",
    skills:    { mode: "file-per", dir: ".kilocode/rules/skills", ext: ".md" },
    personas:  { mode: "inline" },
    commands:  { mode: "drop" },
  },
  "vscode-copilot": {
    mainFile: ".github/copilot-instructions.md",
    skills:    { mode: "file-per", dir: ".github/instructions", ext: ".instructions.md" },
    personas:  { mode: "file-per", dir: ".github/agents",       ext: ".agent.md" },
    commands:  { mode: "file-per", dir: ".github/prompts",      ext: ".prompt.md" },
  },
  "jetbrains": {
    mainFile: ".junie/guidelines.md",
    skills:    { mode: "inline", topN: INLINE_TOP_N, urlRefs: true },
    personas:  { mode: "drop" },
    commands:  { mode: "drop" },
  },
  "aider": {
    mainFile: "CONVENTIONS.md",
    skills:    { mode: "inline", topN: INLINE_TOP_N, urlRefs: true },
    personas:  { mode: "drop" },
    commands:  { mode: "drop" },
  },
  "codex": {
    mainFile: "AGENTS.md",
    skills:    { mode: "inline", topN: INLINE_TOP_N, urlRefs: true },
    personas:  { mode: "drop" },
    commands:  { mode: "drop" },
  },
  "gemini": {
    mainFile: "GEMINI.md",
    skills:    { mode: "file-per", dir: ".gemini/skills",   ext: ".md", structure: "folder-per-skill" },
    personas:  { mode: "as-skill", dir: ".gemini/skills",   ext: ".md", structure: "folder-per-skill" },
    commands:  { mode: "file-per", dir: ".gemini/commands", ext: ".toml", renderer: "toml" },
  },
  "universal": {
    mainFile: "AGENTS.md",
    skills:    { mode: "inline", topN: INLINE_TOP_N, urlRefs: true },
    personas:  { mode: "drop" },
    commands:  { mode: "drop" },
  },
};

// ──────────────────────────────────────────────────────────────────
// Build pipeline
// ──────────────────────────────────────────────────────────────────

function writeFile(absPath, content) {
  if (!existsSync(dirname(absPath))) mkdirSync(dirname(absPath), { recursive: true });
  writeFileSync(absPath, content);
}

function pickInlineSkills(allSkills) {
  const byId = new Map(allSkills.map((s) => [s.id, s]));
  const top = INLINE_PRIORITY.map((id) => byId.get(id)).filter(Boolean);
  const rest = allSkills.filter((s) => !INLINE_PRIORITY.includes(s.id));
  return { top, rest };
}

function buildPlatform(pid, cfg, c, skills, personas, commands) {
  const outRoot = join(ROOT, "platforms", pid);
  // Don't rm — preserve any hand-curated files (chatmodes, codex configs,
  // mode rules, etc.). Builder overwrites generated files only.
  if (!existsSync(outRoot)) mkdirSync(outRoot, { recursive: true });

  // 1. Main rules file (constitution always).
  let main = renderConstitutionHeader(c) + renderConstitutionBody(c);
  if (cfg.mainFrontmatter) main = cfg.mainFrontmatter(c.meta.version) + main;

  // 2. Skills.
  if (cfg.skills.mode === "native" || cfg.skills.mode === "file-per" || cfg.skills.mode === "as-skill") {
    for (const s of skills) writeSkillFile(outRoot, cfg.skills, s);
  } else if (cfg.skills.mode === "inline") {
    const { top, rest } = pickInlineSkills(skills);
    main += "\n## Skills (top " + top.length + ")\n";
    for (const s of top) main += renderInlineSkill(s);
    if (cfg.skills.urlRefs && rest.length) main += renderURLRefs(rest);
  }

  // 3. Personas.
  if (cfg.personas.mode === "native" || cfg.personas.mode === "file-per") {
    for (const p of personas) writePersonaFile(outRoot, cfg.personas, p);
  } else if (cfg.personas.mode === "as-skill") {
    for (const p of personas) writePersonaAsSkillFile(outRoot, cfg.personas, p);
  } else if (cfg.personas.mode === "inline") {
    main += "\n## Personas\n";
    for (const p of personas) main += renderInlinePersona(p);
  }
  // mode "drop" / "mode-map": no-op for the per-persona file write here.

  // 4. Commands.
  if (cfg.commands.mode === "native" || cfg.commands.mode === "file-per") {
    for (const cmd of commands) writeCommandFile(outRoot, cfg.commands, cmd);
  }
  // mode "drop": no-op.

  // 5. Per-platform extras.
  if (pid === "claude-code") writeClaudePlugin(outRoot, c);
  if (pid === "vscode-copilot") writeCopilotChatmodes(outRoot);
  if (pid === "gemini") writeGeminiSettings(outRoot);
  if (pid === "codex") writeCodexConfig(outRoot, c);

  // 6. Main file last (after any inline content was appended).
  writeFile(join(outRoot, cfg.mainFile), main);

  return countFiles(outRoot);
}

function writeSkillFile(outRoot, cfg, s) {
  let body = renderSkillMarkdown(s);
  if (cfg.frontmatter) body = cfg.frontmatter(s) + body;
  let target;
  if (cfg.structure === "folder-per-skill") {
    target = join(outRoot, cfg.dir, s.id, "SKILL.md");
  } else {
    target = join(outRoot, cfg.dir, s.id + cfg.ext);
  }
  writeFile(target, body);
}

function writePersonaFile(outRoot, cfg, p) {
  let body = renderPersonaMarkdown(p);
  if (cfg.frontmatter) body = cfg.frontmatter(p) + body;
  const target = join(outRoot, cfg.dir, p.id + cfg.ext);
  writeFile(target, body);
}

function writePersonaAsSkillFile(outRoot, cfg, p) {
  // Gemini has no persona primitive — wrap as a skill.
  const wrapped = {
    id: p.id,
    title: p.role,
    phase: "review",
    when: ["The user explicitly invokes this persona."],
    process: [p.summary?.trim() || ""],
    red_flags: [],
    rationalizations: [],
    verification: [],
  };
  const body = renderSkillMarkdown(wrapped);
  const target = cfg.structure === "folder-per-skill"
    ? join(outRoot, cfg.dir, p.id, "SKILL.md")
    : join(outRoot, cfg.dir, p.id + cfg.ext);
  writeFile(target, body);
}

function writeCommandFile(outRoot, cfg, cmd) {
  let body;
  if (cfg.renderer === "toml") {
    // Gemini commands are TOML.
    body = `description = "${cmd.summary.replace(/"/g, '\\"')}"\nprompt = """\n${cmd.prompt?.trim() || ""}\n"""\n`;
  } else {
    body = renderCommandMarkdown(cmd);
  }
  const fname = cmd.id.replace(/^cg:/, "cg-") + cfg.ext;
  writeFile(join(outRoot, cfg.dir, fname), body);
}

function writeClaudePlugin(outRoot, c) {
  const manifest = {
    name: "memoryai-coding-guard",
    description: `Coding-Guard v${c.meta.version} — 4 principles + anti-sloppy + 7 skills + 4 personas.`,
    commands: "./.claude/commands",
    skills: "./.claude/skills",
    agents: "./.claude/agents",
  };
  writeFile(join(outRoot, ".claude-plugin", "plugin.json"), JSON.stringify(manifest, null, 2) + "\n");
}

function writeCopilotChatmodes(outRoot) {
  // Keep the existing surgical-fix chatmode if it ships in source platforms/; the builder simply
  // ensures the directory exists. (Hand-curated chatmodes are not auto-generated.)
  mkdirSync(join(outRoot, ".github", "chatmodes"), { recursive: true });
}

function writeGeminiSettings(outRoot) {
  const settings = {
    "coding-guard": {
      version: 2,
      enforcement: "advisory",
    },
  };
  writeFile(join(outRoot, ".gemini", "settings.json"), JSON.stringify(settings, null, 2) + "\n");
}

function writeCodexConfig(outRoot, c) {
  const lines = [
    "# coding-guard preset for OpenAI Codex CLI",
    "# Apply via: codex --config ~/.codex/config.toml",
    "",
    "[approval]",
    "destructive_ops = \"require-confirm\"",
    "",
    "[rules]",
    `version = \"${c.meta.version}\"`,
    "",
  ].join("\n");
  writeFile(join(outRoot, ".codex", "config.toml"), lines);
}

function countFiles(dir) {
  let n = 0;
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) n += countFiles(p);
    else n++;
  }
  return n;
}

// ──────────────────────────────────────────────────────────────────
// Entrypoint
// ──────────────────────────────────────────────────────────────────

export async function build() {
  console.log(kleur.bold().cyan("\n  Building platform files from constitution.toml + skills/personas/commands\n"));
  const c = loadConstitution();
  const skills = loadDir("rules/skills");
  const personas = loadDir("rules/personas");
  const commands = loadDir("rules/commands");
  console.log(kleur.gray(`  Loaded ${skills.length} skill(s), ${personas.length} persona(s), ${commands.length} command(s).`));
  let total = 0;
  for (const [pid, cfg] of Object.entries(PLATFORMS)) {
    const n = buildPlatform(pid, cfg, c, skills, personas, commands);
    total += n;
    console.log(`  ${kleur.green("✓")} ${pid.padEnd(18)} ${kleur.gray(`(${n} file${n === 1 ? "" : "s"})`)}`);
  }
  console.log();
  console.log(kleur.green(`  Built ${total} file(s) across ${Object.keys(PLATFORMS).length} platforms.\n`));
}

if (process.argv[1]) {
  const here = fileURLToPath(import.meta.url);
  if (here === process.argv[1]) await build();
}
