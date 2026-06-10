# MemoryAI Coding-Guard

> Universal coding-agent guardrails. **Install once → 11 IDE/CLI follow the rules.**

[![npm](https://img.shields.io/npm/v/@memoryai-dev/coding-guard.svg)](https://www.npmjs.com/package/@memoryai-dev/coding-guard)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

Stop AI agents from being sloppy. **4 Karpathy principles + anti-sloppy enforcement** — packaged as drop-in rule files for every major coding agent in 2026.

## What it does

AI coding agents share the same bad habits: they refactor code you didn't ask them to, over-engineer simple tasks, fake "done" without running tests, and hallucinate APIs that don't exist. **Coding-Guard** installs typed behavioral rules into your project, plus enforcement hooks that *block* sloppy actions instead of just suggesting they're bad.

```
npx @memoryai-dev/coding-guard install
```

That single command:
- Detects which agent(s) your project uses (Cursor, Claude Code, Aider, Copilot, ...)
- Drops the right rule file into the right path with the right format
- Optionally wires up enforcement hooks (block `--no-verify`, force test before commit, etc.)

## The 4 principles

Derived from [Andrej Karpathy's observations](https://x.com/karpathy/status/2015883857489522876) on LLM coding pitfalls.

| Principle | What it stops |
|---|---|
| **Think Before Coding** | Silent assumptions, missing tradeoffs |
| **Simplicity First** | Over-engineering, speculative abstractions |
| **Surgical Changes** | Drive-by refactors, scope creep |
| **Goal-Driven Execution** | "Done" without verification |

Plus 5 anti-sloppy mechanisms: anti-hallucinate, anti-fake-verify, anti-out-of-scope, anti-loop, anti-destructive.

## Supported platforms (11)

| Platform | File installed |
|---|---|
| Claude Code | `CLAUDE.md` + plugin/hooks |
| Cursor | `.cursor/rules/*.mdc` |
| Windsurf | `.windsurfrules` |
| Cline | `.clinerules/` |
| Roo Code | `.roo/rules/` (per-mode) |
| Kilo Code | `.kilocode/rules/` |
| GitHub Copilot | `.github/copilot-instructions.md` + chatmodes |
| JetBrains Junie | `.junie/guidelines.md` |
| Aider | `CONVENTIONS.md` + `.aider.conf.yml` |
| OpenAI Codex | `AGENTS.md` + `~/.codex/config.toml` |
| Gemini CLI | `GEMINI.md` + `~/.gemini/settings.json` |

`AGENTS.md` is shared across OpenCode, Continue, Crush, and any RFC-9999-compatible agent.

## Install

### npm (recommended)

```bash
npm i -g @memoryai-dev/coding-guard
coding-guard install
```

Or run directly without installing:

```bash
npx @memoryai-dev/coding-guard install
```

### curl (Linux / macOS)

```bash
curl -fsSL https://coding-guard.memoryai.dev/install.sh | bash
```

### PowerShell (Windows)

```powershell
iwr https://coding-guard.memoryai.dev/install.ps1 | iex
```

## Commands

```bash
coding-guard install            # detect IDE + install
coding-guard install --all      # install for every platform
coding-guard install --only cursor
coding-guard install --dry-run  # preview without writing

coding-guard list               # list supported platforms
coding-guard update             # update to latest rule version
coding-guard doctor             # check installation health
coding-guard verify             # verify Ed25519 signature of rules
```

## Architecture

```
rules/
  constitution.toml        ← source-of-truth (typed, signed)
  schema.json              ← JSON Schema for validation
  predicates/*.ts          ← executable assertion functions
  metrics.json             ← per-rule measurable metrics
  lineage.jsonl            ← append-only history (audit chain)

platforms/                 ← built outputs per platform
runtimes/                  ← enforcement hooks + MCP servers
telemetry/                 ← optional opt-in violation logging
```

The constitution is signed Ed25519 from day one. Future-proof for cross-vendor rule registries (RFC-9999 AGENTS.md, Sigstore Rekor).

## Family

`@memoryai-dev/coding-guard` is part of the **MemoryAI Guards** family:

- [`@memoryai-dev/context-guard`](https://github.com/CH270035/memoryai-context-guard) — protect AI context from overflow
- `@memoryai-dev/coding-guard` — this package
- More guards coming.

## License

MIT

---

Built by [MemoryAI](https://memoryai.dev). Inspired by [@karpathy](https://x.com/karpathy)'s post on LLM coding pitfalls.
