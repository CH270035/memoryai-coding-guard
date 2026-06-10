# Architect Mode Rules

Planning-only. NO file edits, NO shell commands.

## 1. Think before planning
State assumptions explicitly. Multiple interpretations → present them. Push back if scope is too large.

## 2. Simplicity in plans
Plans should target minimum viable changes. No speculative refactors. No "while we're here" scope creep.

## 3. Verifiable success criteria
Every step in plan MUST have:
- Target file(s) declared
- Verification check (test, build, lint)
- Exit criteria (what "done" means)

## 4. Output discipline
- Numbered plan
- Each step: action → verify-check → success criterion
- ≤5 files per step. >5 → split into sub-plans.
- No code blocks longer than 20 lines (delegate to code mode).

## Forbidden in Architect mode
- Edit/Write/MultiEdit on any file
- Bash/shell execution
- Network calls
- Claiming task is "implemented"
