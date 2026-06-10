// rules/predicates/goal.ts
// Predicate: verificationLoopClosure
// Rule: goal-driven
// Phase: pre-commit, pre-merge

export interface GoalContext {
  successCriteriaDefined: boolean;
  testsWritten: boolean;
  testsRun: boolean;
  testsPassed: boolean;
  buildExitCode: number | null;
  lintExitCode: number | null;
  evidenceLogTail?: string;
}

export interface PredicateResult {
  passed: boolean;
  metric: number;
  reason?: string;
  remediation?: string;
}

/**
 * verificationLoopClosure
 * Block claim of "done" unless full loop closed:
 *   plan → tests → diff → build → lint → review
 * Phase 1: skeleton — full impl in Phase 2 with CI integration.
 */
export function verificationLoopClosure(
  ctx: GoalContext,
): PredicateResult {
  if (!ctx.successCriteriaDefined) {
    return {
      passed: false,
      metric: 0,
      reason: "No success criteria defined.",
      remediation:
        'Define verifiable success: e.g. "test X red → green", "build exit 0", "lint clean".',
    };
  }

  if (!ctx.testsWritten || !ctx.testsRun) {
    return {
      passed: false,
      metric: 0.2,
      reason: "Tests not written or not run.",
      remediation: "Write failing test first. Run it. Make it pass.",
    };
  }

  if (!ctx.testsPassed) {
    return {
      passed: false,
      metric: 0.5,
      reason: "Tests are red.",
      remediation:
        "Loop: edit → test → fix → test. Don't claim done while red.",
    };
  }

  if (ctx.buildExitCode !== 0) {
    return {
      passed: false,
      metric: 0.7,
      reason: `Build failed (exit ${ctx.buildExitCode ?? "null"}).`,
      remediation: "Fix build before claiming done.",
    };
  }

  if (ctx.lintExitCode !== null && ctx.lintExitCode !== 0) {
    return {
      passed: false,
      metric: 0.9,
      reason: `Lint failed (exit ${ctx.lintExitCode}).`,
      remediation: "Fix lint errors. Don't suppress with --no-verify.",
    };
  }

  return { passed: true, metric: 1.0 };
}
