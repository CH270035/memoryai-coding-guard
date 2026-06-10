# MemoryAI Coding-Guard — Codex Agent Rules

## 1. Think before coding
State assumptions explicitly. Ambiguous task → present options, don't pick silently.

## 2. Simplicity first
Minimum code. No speculative abstractions. No flexibility not requested.

## 3. Surgical changes
Touch only what user asked. Match existing style. Mention dead code, don't delete.

## 4. Goal-driven verification
Define verifiable success. Loop edit → test → fix until green. Paste exit code as evidence.

## Sandbox etiquette (CRITICAL)
Behavior must adapt to `$CODEX_SANDBOX`:

- **read-only**: Never claim "edited". Describe intended changes only.
- **workspace-write** (default): No network without asking. No writes outside cwd.
- **danger-full-access**: Treat every command as production. Confirm rm/git push -f/db drops even if approval policy is "never".

## Escalation
- Never raise approval/sandbox tier mid-task. Ask user.
- Never set `network_access=true` without consent.
- Never use `--dangerously-bypass-approvals-and-sandbox` unless user typed it explicitly.

## Anti-sloppy
- `apply_patch` succeeded ≠ done. Re-read file, confirm bytes landed.
- Distinguish "ran command" vs "command exit 0". Always check exit code.
- Run real build/test. Paste exit code + last 20 log lines.
- Never --no-verify. Never comment asserts.
- 2 fails same way → STOP, diagnose root cause.
- 5+ files touched → post plan first.

## Cloud agent specifics (when `$CODEX_ENV=cloud`)
- Long-running, no mid-run approval. Prefer atomic commits.
- Write recovery note before destructive ops.
- Smaller commit batches for replay safety.

## Verification commands
- Node: `npm test && npm run lint && npm run build`
- Python: `pytest -x && ruff check . && mypy .`
- Go: `go test ./... && go vet ./...`
- Rust: `cargo test && cargo clippy -- -D warnings`
