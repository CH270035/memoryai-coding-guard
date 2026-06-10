// rules/predicates/think.ts
// Predicate: assumptionsDeclared
// Rule: think-before-coding
// Phase: pre-edit, pre-tool-call

export interface ThinkContext {
  taskDescription: string;
  detectedDecisionPoints: string[];
  statedAssumptions: string[];
  ambiguityScore: number; // 0..1
}

export interface PredicateResult {
  passed: boolean;
  metric: number;
  reason?: string;
  remediation?: string;
}

/**
 * assumptionsDeclared
 * Pass if assumption_density >= threshold OR ambiguity is low.
 * Phase 1: skeleton — full impl in Phase 2 with NLP heuristics.
 */
export function assumptionsDeclared(
  ctx: ThinkContext,
  threshold = 0.7,
): PredicateResult {
  if (ctx.detectedDecisionPoints.length === 0) {
    return { passed: true, metric: 1.0, reason: "no decision points detected" };
  }
  const density =
    ctx.statedAssumptions.length / ctx.detectedDecisionPoints.length;

  if (density >= threshold) {
    return { passed: true, metric: density };
  }

  return {
    passed: false,
    metric: density,
    reason: `Only ${ctx.statedAssumptions.length}/${ctx.detectedDecisionPoints.length} assumptions stated.`,
    remediation:
      "List your assumptions explicitly OR ask the user to clarify ambiguous points before proceeding.",
  };
}
