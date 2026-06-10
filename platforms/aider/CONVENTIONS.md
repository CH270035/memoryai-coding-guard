# MemoryAI Coding-Guard — Aider Conventions

## 1. Think before coding
State assumptions + plan before edit. Ambiguous → ASK before /add.

## 2. Simplicity
Minimum code. No speculative abstractions. Inline single-use code.

## 3. Surgical
Edit only files /add'd to the chat by the user. Don't touch adjacent code.

## 4. Verify loop
Workflow: write/update test → /add affected files → edit → /lint → /test → /commit. Never commit on red.

## RepoMap first
Use /map before claiming structure. Don't invent file paths.

## Add-before-edit
Never edit a file not in the chat. If needed, request /add explicitly.

## Architect/Editor mode
- Architect emits plan with verification step per change.
- Editor applies ONLY plan diffs. No scope creep, no extra refactors, no comments not in plan.

## Anti-sloppy
- Verify imports vs lockfile/pyproject.toml/Cargo.toml.
- Cite file:line for API claims.
- Run real /test command. Paste exit code + log tail.
- Never --no-verify. Never comment-out asserts.
- 2 fails same way → STOP, diagnose root cause.
- 5+ files → post plan first.
- Destructive ops (rm -rf, git push --force) → explicit confirm.

## Verification commands (override per repo)
- Node: `npm test && npm run lint`
- Python: `pytest -x && ruff check .`
- Go: `go test ./... && go vet ./...`
- Rust: `cargo test && cargo clippy -- -D warnings`
