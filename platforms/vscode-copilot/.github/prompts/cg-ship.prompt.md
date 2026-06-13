---
description: Pre-launch checklist — review, test, security, then deploy with rollback plan.
---

Run the pre-ship gate: parallel fan-out to code-reviewer,
security-auditor, and test-engineer personas. Synthesize all three
reports.

Then verify:
- All Critical and Important findings resolved
- Build green, tests green, lint green (paste exit codes)
- Rollback plan recorded (one-line revert command + monitoring window)
- Feature flag default state explicit (off in prod by default)

If any gate fails, stop and report. Do not deploy.
