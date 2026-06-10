# Project Instructions — MemoryAI Coding-Guard

## Hard rules (4 core principles)
1. **THINK**: state assumptions explicitly; ask if ambiguous; never pick silently.
2. **SIMPLE**: minimum code; no speculative abstractions; senior-eng test.
3. **SURGICAL**: touch only requested lines; match existing style; mention dead code, don't delete.
4. **VERIFY**: define success criteria; in Agent mode loop edit → test → fix until green.

## Anti-hallucination
- Verify every import against `package.json` / lockfile before writing.
- Reference files via `#file:` — never guess paths.
- If an API/symbol cannot be confirmed in repo or pinned deps, ASK.
- Cite `file:line` for any API claim.

## Workflow
- **Edit/Agent mode**: run project test + lint script after changes; report failures verbatim.
- Never run destructive shell commands without confirmation (`rm -rf`, `git push --force`, etc.).
- Match the package manager declared in the lockfile (npm/pnpm/yarn/bun).
- 5+ files touched → post plan first, await ack.

## Anti-fake-verify
- Run real build/test command. Paste exit code + last 20 log lines as evidence.
- Quote failing assertion before claiming fix.
- Never `--no-verify`, never comment out asserts, never skip tests.
- No "done" claim without exit 0.

## Anti-loop
- 2 fails same way → STOP, diagnose root cause.
- Tool budget ≤8 tool calls per task.

## Verification commands (auto-detect, override per repo)
- Node: `npm test && npm run lint && npm run build`
- Python: `pytest -x && ruff check . && mypy .`
- Go: `go test ./... && go vet ./... && go build ./...`
- Rust: `cargo test && cargo clippy -- -D warnings`
