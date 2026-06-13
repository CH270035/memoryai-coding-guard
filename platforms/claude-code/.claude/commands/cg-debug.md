---
description: Reproduce, localize, reduce, fix, guard — the debugging loop.
---

Invoke the coding-guard 'debugging-and-error-recovery' skill.

Run the loop:
1. REPRODUCE — pin the bug to a reliable failing case
2. LOCALIZE — git bisect run or binary search the change set
3. REDUCE — shrink to minimum reproduction
4. FIX — change one thing, re-run reproduction
5. GUARD — convert reproduction into a regression test

Do not patch the symptom. If a fix is unclear after two attempts, stop
and ask the user.
