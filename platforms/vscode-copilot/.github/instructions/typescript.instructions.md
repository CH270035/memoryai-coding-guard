---
applyTo: "**/*.ts,**/*.tsx,**/*.js,**/*.jsx"
description: TypeScript/JavaScript-specific guards
---

# TS/JS-specific Coding-Guard

In addition to the project-wide rules in copilot-instructions.md:

- Verify import paths against tsconfig `paths` and the package.json/lockfile.
- Do not introduce `any` to silence type errors. Fix the type.
- Do not add `// @ts-ignore` or `// @ts-nocheck` to bypass errors.
- For new dependencies, prefer existing packages already in the lockfile.
- Match the package manager declared in the lockfile (npm/pnpm/yarn/bun).
- For React components: match existing style (functional vs class, hooks usage).
