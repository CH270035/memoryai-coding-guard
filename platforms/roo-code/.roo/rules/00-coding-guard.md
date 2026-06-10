# MemoryAI Coding-Guard — Core Rules

## 1. Think before coding
State assumptions. Surface tradeoffs. Unclear → STOP, ASK.

## 2. Simplicity first
Minimum code. No speculative abstractions. Senior-engineer test.

## 3. Surgical changes
Touch only what user asked. Match style. Every line traces to request.

## 4. Goal-driven
Define verifiable success. Loop edit → test → fix → commit until green.

## Anti-sloppy (universal)
- Verify imports vs lockfile. Cite file:line. No hallucinated APIs.
- Paste real exit code + log tail. No --no-verify, no commented asserts.
- 5+ files touched → plan first. Out-of-scope → re-confirm.
- 2 fails same way → diagnose root cause, no mechanical retry.
- Destructive ops (rm -rf, force push, reset --hard) → explicit confirm.
