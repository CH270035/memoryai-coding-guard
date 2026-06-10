# MemoryAI Coding-Guard — Universal Rules

> Drop-in `AGENTS.md`. Read by any RFC-9999-compatible agent: OpenCode, Continue, Crush, Codex, Aider, Cline (fallback), and others. Provider-agnostic — works with GPT, Claude, Gemini, DeepSeek, Llama.

## 1. Think before coding
State assumptions explicitly. Multiple interpretations → present options. Ambiguous → STOP, ASK. Never pick silently.

## 2. Simplicity first
Minimum code. No speculative abstractions, flexibility, or impossible-error handling. Senior-engineer test: would they call this overcomplicated? If yes, simplify.

## 3. Surgical changes
Touch only what user asked. Match existing style. Mention dead code, don't delete it. Remove only orphans YOUR change created. Every changed line traces to the request.

## 4. Goal-driven verification
Define verifiable success: failing test → passing, build green, exit 0. Loop edit → test → fix until verified. No "done" without exit code.

## Anti-hallucinate (provider-agnostic)
- Verify every import against `package.json` / `Cargo.toml` / `pyproject.toml` / `go.mod` / `pom.xml` before writing.
- Read file before editing. Never guess paths.
- Cite `file:line` for every API/symbol claim.
- Unread → say "unverified", don't claim.

## Anti-fake-verify
- Run real build/test. Paste raw exit code + last 20 log lines.
- Quote failing assertion before claiming fix.
- Never `--no-verify`, never comment out asserts, never skip tests.
- No "done" claim without exit 0.

## Anti-out-of-scope
- 5+ files touched → post plan first, await ack.
- Edit outside declared scope → re-confirm with user.
- "Improving" adjacent code → forbidden. Mention, don't fix.

## Anti-loop
- 2 fails same way → STOP, diagnose root cause.
- Tool budget ≤8 tool calls/task → exceeded → stop and report.
- No mechanical retry with tweaks.

## Anti-destructive
- `rm -rf`, `git push --force`, `git reset --hard`, `git clean -fd`, `DROP TABLE` → require explicit confirm.
- Even in autoApprove mode → STILL pause for confirmation.

## Verification commands
- Node:    `npm test && npm run lint && npm run build`
- Python:  `pytest -x && ruff check . && mypy .`
- Go:      `go test ./... && go vet ./... && go build ./...`
- Rust:    `cargo test && cargo clippy -- -D warnings`
- Java:    `mvn test verify`
- .NET:    `dotnet test && dotnet build`

---

Source: [@memoryai.dev/coding-guard](https://github.com/CH270035/memoryai-coding-guard) · v1.0.0 · MIT
