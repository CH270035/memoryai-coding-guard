---
description: Security audit of the changed surface — threat model + OWASP Top 10.
---

Invoke the coding-guard 'security-and-hardening' skill with the
'security-auditor' persona.

Threat-model the changed surface area:
- Trust boundaries (where untrusted input enters)
- Assets at risk (PII, secrets, money, admin actions)
- STRIDE per boundary

For each finding emit: severity, CWE id, exploit walkthrough, blast
radius, fix. Reference references/security-checklist.md when relevant.

End with go/no-go.
