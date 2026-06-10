---
mode: agent
description: Self-audit current diff against the 4 core principles + anti-sloppy rules
tools: [editFiles, search, runTests]
---

# /coding-guard-review

Audit the current uncommitted diff (or specified scope) against MemoryAI Coding-Guard rules.

For each violation found, report:
- **Rule violated** (think/simple/surgical/goal-driven or anti-* rule)
- **File:line** of violation
- **Quoted offending code**
- **Severity**: block / warn / advisory
- **Remediation**: specific fix

Format the report as a markdown table. Conclude with PASS or FAIL.

Do NOT auto-fix unless explicitly asked. This command is read-only review.
