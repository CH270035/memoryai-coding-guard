# MemoryAI Coding-Guard — Eval Harness

Reproducible measurement of how the rules change AI agent behavior.

## Purpose

Turn the marketing claim "fewer unnecessary changes in diffs" into **data**.

## Methodology

For each task in `tasks/`:

1. Run task with **no rules** → record metrics
2. Run task **with @memoryai.dev/coding-guard installed** → record metrics
3. Compute delta. Aggregate across tasks.

## Metrics tracked (per task run)

| Metric | Definition |
|---|---|
| `loc_added` | Total lines added in diff |
| `files_touched` | Number of files modified |
| `out_of_scope_files` | Files modified outside declared task scope |
| `new_abstractions` | New classes/types/interfaces introduced |
| `tests_written` | New test cases added |
| `tests_passing` | Final test result (boolean) |
| `build_passing` | Final build result (boolean) |
| `tool_calls` | Number of tool invocations |
| `assumption_statements` | Lines stating assumptions in agent output |
| `clarifying_questions` | Questions agent asked before coding |
| `wall_time_seconds` | End-to-end task duration |

## Tasks

10 standardized tasks across difficulty tiers:

- `01-typo-fix.md` — trivial single-line fix
- `02-add-validation.md` — add input validation to one function
- `03-fix-bug-with-test.md` — bug fix requiring failing test reproduction
- `04-rename-function.md` — surgical rename, must update all callsites
- `05-add-cli-flag.md` — small feature addition
- `06-refactor-temptation.md` — bug in module with adjacent dirty code (tests "Surgical Changes")
- `07-overengineer-trap.md` — simple feature that LLMs often over-abstract
- `08-add-pagination.md` — moderate feature, requires plan
- `09-fix-flaky-test.md` — diagnose root cause vs patch symptom
- `10-multi-file-feature.md` — touches 5+ files, tests "post plan first"

## Running the harness

```bash
node eval/runner.js                      # run all 10 tasks both ways
node eval/runner.js --task 06            # single task
node eval/runner.js --report             # generate markdown report
```

## Status

Phase 6 ships the **harness skeleton**. Real LLM-driven runs require API keys and will be wired up in v1.1.

For now, the runner verifies that:
- Each task has a clear scope, expected diff, success criteria.
- Metric-collection code parses git diffs correctly.
- Baseline numbers from manual runs are recorded.
