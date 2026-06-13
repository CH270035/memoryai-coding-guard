---
description: Five-axis code review with severity-tagged findings.
---

Invoke the coding-guard 'code-review-and-quality' skill with the
'code-reviewer' persona.

Review the pending diff (git diff main...HEAD) across five dimensions:
correctness, readability, architecture, security, performance.

For every finding emit: severity (Critical|Important|Nit|FYI),
location (file:line), evidence (one quote), and a concrete fix.

End with: GO / GO-WITH-CHANGES / NO-GO + reason.
