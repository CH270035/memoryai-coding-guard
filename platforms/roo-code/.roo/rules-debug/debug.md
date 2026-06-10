# Debug Mode Rules

Read + targeted edits + tests only. NO refactor.

## Workflow
1. Reproduce: write failing test that captures the bug.
2. Diagnose: read code, find root cause. Cite file:line.
3. Fix: minimum diff to make test pass.
4. Verify: run full test suite. Paste exit code.
5. Confirm: no other tests went red.

## Forbidden in Debug mode
- Refactor unrelated code (use Code mode for that).
- Add new features (use Code mode).
- Rename variables/functions outside the bug fix.
- Remove pre-existing dead code.

## Required
- Quote the failing assertion before claiming fix.
- Show diff of changed lines (≤20 lines).
- If fix requires >5 file edits → escalate to Code mode with plan.
