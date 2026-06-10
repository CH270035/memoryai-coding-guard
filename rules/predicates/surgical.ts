// rules/predicates/surgical.ts
// Predicate: diffScopePurity
// Rule: surgical-changes
// Phase: post-edit, pre-commit

export interface SurgicalContext {
  declaredScope: string[]; // file paths or AST nodes user agreed to touch
  changedFiles: string[];
  changedLines: Array<{ file: string; line: number; tracesTo?: string }>;
  orphanImports: string[];
  preExistingDeadCodeRemoved: string[];
}

export interface PredicateResult {
  passed: boolean;
  metric: number;
  reason?: string;
  remediation?: string;
  outOfScopeFiles?: string[];
}

/**
 * diffScopePurity
 * Block if any changed file/line is outside declared scope.
 * Block if pre-existing dead code was removed without being asked.
 * Phase 1: skeleton — full impl in Phase 2 with diff parser.
 */
export function diffScopePurity(
  ctx: SurgicalContext,
): PredicateResult {
  const outOfScope = ctx.changedFiles.filter(
    (f) => !ctx.declaredScope.some((s) => f.startsWith(s) || s === f),
  );

  if (outOfScope.length > 0) {
    return {
      passed: false,
      metric: 1 - outOfScope.length / Math.max(ctx.changedFiles.length, 1),
      reason: `${outOfScope.length} file(s) edited outside declared scope.`,
      remediation:
        "Revert out-of-scope edits OR re-declare scope with user before proceeding.",
      outOfScopeFiles: outOfScope,
    };
  }

  if (ctx.preExistingDeadCodeRemoved.length > 0) {
    return {
      passed: false,
      metric: 0.9,
      reason: `Removed ${ctx.preExistingDeadCodeRemoved.length} pre-existing dead code item(s) — surgical rule violated.`,
      remediation:
        "Mention pre-existing dead code, don't delete it. Only remove orphans YOUR change created.",
    };
  }

  const tracedLines = ctx.changedLines.filter((l) => !!l.tracesTo).length;
  const purity = ctx.changedLines.length === 0
    ? 1.0
    : tracedLines / ctx.changedLines.length;

  return { passed: purity >= 1.0, metric: purity };
}
