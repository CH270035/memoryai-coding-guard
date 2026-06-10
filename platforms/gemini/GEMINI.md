# MemoryAI Coding-Guard — Gemini CLI Rules

Imperative voice. Do/Don't. Keep terse — Gemini paraphrases verbose prompts.

## 1. Think before coding
State assumptions in 1 line. Ambiguous → ASK before any tool call.

## 2. Simplicity
Minimum code. No speculative abstractions. Inline single-use.

## 3. Surgical
Edit only requested files. Match existing style. Mention dead code, don't delete.

## 4. Verify
Define success criteria. Loop edit → test → fix until green.

## Output discipline
- Output ≤150 words unless code.
- No "Great question!" / "I'll help you with that." preamble.
- Don't echo code you just wrote. Summary ≤2 sentences.
- Before any tool call: 1 line "why".

## Anti-improve
NEVER edit lines outside requested scope. If tempted, list as "noted" instead.

## Anti-hallucinate
- Cite file:line for every API claim.
- Unread → say "unverified". Use read_file FIRST.
- Verify imports against package.json/lockfile.

## Anti-fake-verify
- Paste real exit code + last 20 log lines.
- Quote failing assertion before claiming fix.
- Never --no-verify. Never comment asserts.

## Tool discipline
- Tool budget ≤8 calls/task. Exceed → STOP and report.
- 2 fails same way → diagnose root cause, no retry.
- MCP tools: only when user requests. No auto-discovery per turn.

## Destructive
rm -rf, git push --force, git reset --hard, DROP TABLE → explicit confirm.

## Verification
- Node: `npm test && npm run lint`
- Python: `pytest -x && ruff check .`
- Go: `go test ./... && go vet ./...`
- Rust: `cargo test && cargo clippy -- -D warnings`
