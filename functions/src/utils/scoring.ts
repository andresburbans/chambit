/**
 * Reputation Scoring Utilities (E04)
 *
 * Hybrid system:
 *   - Bayesian Average: S_bayes = (n*R + m*C_g) / (n + m)
 *   - Wilson Lower Bound: confidence filter (toggleable via config)
 *
 * Implementation pending. See spec: docs/dev-specs/02-engine-backend/E04-bayesian-scoring.md
 */

export const BAYESIAN_M_DEFAULT = 10;
export const GLOBAL_AVG_DEFAULT = 3.5;
export const WILSON_Z_95 = 1.96;
