// ─── Divisibility by 3 — Completion Predicates ───────────────────────────────
import type { Div3State } from './divisibility-by-3Reducer';
import { PROOF_STATES } from './divisibility-by-3Config';

export interface CompletionStatus {
  isComplete: boolean;
  missingSteps: string[];
  /** True when every counter has been moved into a remainder lane */
  allCountersCollapsed: boolean;
  /** True when prediction has been checked */
  predictionOk: boolean;
  /** True when misconception checkpoint resolved correctly */
  misconceptionOk: boolean;
  /** True when all 6 named proof states have been visited */
  allStatesVisited: boolean;
}

/**
 * Evidence-based completion — clicking Reveal or reaching a timestamp
 * must NOT set isComplete = true.
 *
 * Required evidence:
 * 1. Every counter is in a remainder lane (rem0 | rem1 | rem2)
 * 2. All counters are in the CORRECT remainder lane (rem1 — the invariant)
 * 3. The prediction has been checked
 * 4. The misconception checkpoint was resolved with the correct answer
 * 5. All six named proof states have been visited
 */
export function checkCompletion(state: Div3State): CompletionStatus {
  const missing: string[] = [];

  // 1 + 2. All counters collapsed into correct remainder lane
  const allCollapsed = state.counters.every(c => c.lane.startsWith('rem'));
  const allCorrect = state.counters.every(c => c.lane === 'rem1');

  if (!allCollapsed) {
    missing.push('Move all counters into a remainder lane (Remainder 0 / 1 / 2).');
  } else if (!allCorrect) {
    missing.push(
      'Some counters are in the wrong lane. Every power of 10 ≡ 1 (mod 3), ' +
      'so all place-value blocks must land in Remainder 1.',
    );
  }

  // 3. Prediction checked
  const predictionOk = state.predictionChecked;
  if (!predictionOk) {
    missing.push('Make a prediction and reveal the result.');
  }

  // 4. Misconception resolved correctly
  const misconceptionOk =
    state.misconceptionChecked && state.misconceptionSelected === 'correct';
  if (!misconceptionOk) {
    missing.push('Complete the Misconception Checkpoint with the correct answer.');
  }

  // 5. All 6 proof states visited
  const allStatesVisited = PROOF_STATES.every(s => state.visitedStates.has(s));
  if (!allStatesVisited) {
    const unvisited = PROOF_STATES.filter(s => !state.visitedStates.has(s));
    missing.push(`Visit proof step(s): ${unvisited.join(', ')}.`);
  }

  return {
    isComplete: missing.length === 0,
    missingSteps: missing,
    allCountersCollapsed: allCollapsed,
    predictionOk,
    misconceptionOk,
    allStatesVisited,
  };
}

/**
 * Return a single concise rejection message when a counter is dropped
 * into an incompatible remainder lane.
 */
export function getRejectionMessage(
  counterPower: number,
  attemptedLane: 'rem0' | 'rem1' | 'rem2',
): string {
  const placeVal = [1, 10, 100, 1000][counterPower] ?? `10^${counterPower}`;
  if (attemptedLane === 'rem0') {
    return `❌ Wrong lane! ${placeVal} ÷ 3 leaves remainder 1, not 0. (${placeVal} = 3×${Math.floor(Number(placeVal)/3)} + 1). Remainder 0 would mean ${placeVal} is divisible by 3, but it's not — try Remainder 1!`;
  }
  if (attemptedLane === 'rem2') {
    return `❌ Wrong lane! ${placeVal} ÷ 3 leaves remainder 1, not 2. (${placeVal} = 3×${Math.floor(Number(placeVal)/3)} + 1). Every power of 10 leaves remainder 1 because 10 = 9+1 = 3×3+1 — try Remainder 1!`;
  }
  return ''; // rem1 is always correct
}
