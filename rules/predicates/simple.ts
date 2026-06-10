// rules/predicates/simple.ts
// Predicate: complexityBudget
// Rule: simplicity-first
// Phase: post-edit

export interface SimpleContext {
  locAdded: number;
  locRemoved: number;
  repoMedianLocPerTask: number;
  newAbstractions: number;
  singleUseAbstractions: number;
}

export interface PredicateResult {
  passed: boolean;
  metric: number;
  reason?: string;
  remediation?: string;
}

/**
 * complexityBudget
 * Warn if loc_delta_percentile > threshold (default 1.5x median)
 * OR if any single-use abstraction was introduced.
 * Phase 1: skeleton — full impl in Phase 2 with AST analysis.
 */
export function complexityBudget(
  ctx: SimpleContext,
  threshold = 1.5,
): PredicateResult {
  const baseline = Math.max(ctx.repoMedianLocPerTask, 10);
  const ratio = ctx.locAdded / baseline;

  if (ctx.singleUseAbstractions > 0) {
    return {
      passed: false,
      metric: ratio,
      reason: `${ctx.singleUseAbstractions} single-use abstraction(s) introduced.`,
      remediation:
        "Inline single-use code. Add abstraction only when ≥2 callsites exist.",
    };
  }

  if (ratio > threshold) {
    return {
      passed: false,
      metric: ratio,
      reason: `${ctx.locAdded} lines added vs ${baseline} median (${ratio.toFixed(2)}x).`,
      remediation:
        "Senior-engineer test: would they call this overcomplicated? Simplify.",
    };
  }

  return { passed: true, metric: ratio };
}
