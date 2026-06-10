# Code Mode Rules — Strict Karpathy + Anti-Sloppy

## 1. Think before coding
State assumptions. Unclear → STOP and ASK before editing.

## 2. Simplicity first
Minimum code. No speculative abstractions. If 200 lines could be 50, rewrite.

## 3. Surgical changes
Touch only declared scope. Match existing style. Mention dead code, don't delete. Remove only orphans YOUR change created.

## 4. Goal-driven verification
- Write failing test FIRST when fixing bugs.
- Loop: edit → test → fix → test until green.
- Paste exit code as evidence of "done".

## Delete guard (CRITICAL)
- Never delete files unless explicitly named by user.
- No `rm -rf`, no recursive globs.
- File rename/move requires confirm.

## Anti-hallucinate
- Verify imports against lockfile.
- Read file before editing. Never guess paths.
- Cite file:line for API claims.

## Anti-fake-verify
- Run real test command. Paste exit code + log tail.
- Never --no-verify, never comment asserts, never skip tests.

## Anti-loop
- 2 fails same way → STOP, diagnose root cause.
- Tool budget ≤8 calls/task.
