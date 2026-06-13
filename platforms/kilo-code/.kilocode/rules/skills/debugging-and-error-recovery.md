---
name: debugging-and-error-recovery
title: Debugging and Error Recovery
phase: verify
source: https://github.com/addyosmani/agent-skills/blob/main/skills/debugging-and-error-recovery/SKILL.md
source-license: MIT
---

# Debugging and Error Recovery

## When to use

- Tests fail, builds break, or behavior is unexpected
- anti-loop has fired (two failures the same way)
- A regression appeared without an obvious cause

## Process

1. REPRODUCE: pin the bug to a reliable failing case
2. LOCALIZE: bisect the change set with `git bisect run`
3. REDUCE: shrink the failing case to the minimum reproduction
4. FIX: change one thing, re-run the reproduction
5. GUARD: convert the reproduction into a regression test

## Rationalizations to ignore

| Lie you tell yourself | Why it's wrong |
|---|---|
| I see the line, I'll just patch it. | 70% of patches without reproduction miss the real cause. |
| Bisect takes too long. | `git bisect run` automates it. Manual debugging takes longer. |
| The test passes locally, push it. | Race conditions and env drift hide here. Reproduce on CI before claiming fix. |

## Red flags

- Multiple unrelated changes in the debugging diff
- Fix without a regression test
- Comment says 'temporary fix' or 'TODO: investigate'
- Fix mutes the symptom (try/catch around the error) without addressing the cause

## Verification

- A failing reproduction was recorded
- The regression test fails on the unfixed branch
- Build is green on a fresh checkout, not just locally
