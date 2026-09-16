import type { Div11StateModel } from './divisibility-by-11Reducer';

export interface CompletionStatus {
  isComplete: boolean;
  missingSteps: string[];
  sortingOk: boolean;
  predictionOk: boolean;
  misconceptionOk: boolean;
}

/**
 * Validates construction state evidence for divisibility by 11.
 */
export function checkCompletion(state: Div11StateModel): CompletionStatus {
  const missingSteps: string[] = [];

  // 1. Check sorting: all counters must be in correct columns
  // Even powers of 10 go to groupA, odd powers go to groupB
  let sortingOk = true;
  for (const c of state.counters) {
    const expected = c.power % 2 === 0 ? 'groupA' : 'groupB';
    if (c.dockState !== expected) {
      sortingOk = false;
      break;
    }
  }

  if (!sortingOk) {
    missingSteps.push('Place alternating digits into positive (+) and negative (-) columns.');
  }

  // 2. Prediction check
  const predictionOk = state.predictionChecked;
  if (!predictionOk) {
    missingSteps.push('State your prediction on whether 5728641 is divisible by 11.');
  }

  // 3. Misconception checkpoint check
  const misconceptionOk = state.misconceptionChecked && state.misconceptionSelected === 'correct';
  if (!misconceptionOk) {
    missingSteps.push('Resolve the Misconception Checkpoint by selecting the correct theorem condition.');
  }

  // Verify state transitions
  const visitedStates = new Set(state.history.map(h => h.proofState));
  const hasVisitedConclude = visitedStates.has('conclude');
  const hasVisitedTransfer = visitedStates.has('transfer');

  if (!hasVisitedConclude) {
    missingSteps.push('Navigate to the Conclude state to confirm the modular proof.');
  }
  if (!hasVisitedTransfer) {
    missingSteps.push('Navigate to the Transfer state to test another configuration.');
  }

  const isComplete = sortingOk && predictionOk && misconceptionOk && hasVisitedConclude && hasVisitedTransfer;

  return {
    isComplete,
    missingSteps,
    sortingOk,
    predictionOk,
    misconceptionOk,
  };
}
