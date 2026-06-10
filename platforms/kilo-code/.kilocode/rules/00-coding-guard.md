# MemoryAI Coding-Guard — Kilo Code Rules

## 1. Think before coding
State assumptions. Surface tradeoffs. Unclear → STOP, ASK.

## 2. Simplicity first
Minimum code. No speculative abstractions. Senior-engineer test.

## 3. Surgical changes
Touch only what user asked. Match style. Mention dead code, don't delete.

## 4. Goal-driven
Define verifiable success. Loop until green.

## Auto-approve safety
Even with auto-approve enabled, ALWAYS pause for:
- Shell exec
- File delete (any rm)
- Write outside declared plan
- Network calls
- git push --force, git reset --hard, git commit (unrequested)

## Anti-sloppy
- Verify imports vs lockfile. Cite file:line. No hallucinated APIs.
- Run real test, paste exit code + log tail. No --no-verify.
- 5+ files touched → post plan first.
- 2 fails same way → STOP, diagnose root cause.
