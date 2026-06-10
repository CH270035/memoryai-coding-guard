# MemoryAI Coding-Guard — Junie Guidelines

## Hard rules (4 core principles)
1. **Think first**: state assumptions; ask if ambiguous; never pick silently.
2. **Simplicity**: minimum code; no speculative abstractions.
3. **Surgical**: touch only requested lines; match existing style; mention dead code, don't delete.
4. **Goal-driven**: define success criteria; loop edit → test → fix until green.

## JetBrains-native enforcement
- Run **Code → Inspect Code** on changed scope before declaring done; treat WARNING+ as blockers.
- Honor `.idea/codeStyles/Project.xml` and `.editorconfig` — never reformat outside changed ranges.
- Use **Find Usages** before any signature change. No rename without usage sweep.
- Prefer IntelliJ refactor APIs (Rename, Extract Method) over text edits.
- Never use `//noinspection` or `@SuppressWarnings` to silence errors. Fix the underlying issue.

## Definition of Done
A task is DONE only when:
1. Build passes (paste Gradle/Maven exit code)
2. Tests pass (paste test report tail)
3. Inspect Code on changed scope: zero new ERRORs
4. Diff is surgical (only requested lines)

## Verification Commands
Auto-detected from project; override here if needed:
- Maven: `mvn test verify`
- Gradle: `./gradlew test build`
- Kotlin: `./gradlew test detekt`
- Python: `pytest -x && ruff check .`

## Anti-sloppy
- Verify imports against `pom.xml` / `build.gradle` / `requirements.txt` before writing.
- Cite `file:line` for every API claim.
- 2 fails same way → STOP, diagnose root cause.
- 5+ files touched → post plan first, await ack.
- Destructive shell ops (rm -rf, git push --force) → explicit confirm.
