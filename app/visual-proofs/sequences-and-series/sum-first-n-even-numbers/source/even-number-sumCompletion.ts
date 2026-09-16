// ─── Sum of First n Even Numbers — Completion ────────────────────────────────
import type { EnsState } from './even-number-sumReducer';
import { evenSum, rectangleArea } from './even-number-sumMath';

export interface CompletionResult {
  isComplete: boolean;
  allDocked: boolean;
  dockedCount: number;
  countsMatch: boolean;
  generalStep: boolean;
  transferPassed: boolean;
  misconceptionOk: boolean;
}

/**
 * Success is construction + justified general step + a fresh transfer check.
 * Reveal / animation timestamp must not be consulted here.
 */
export function checkCompletion(state: EnsState): CompletionResult {
  const dockedCount = state.rows.filter((r) => r.docked).length;
  const allDocked = dockedCount === state.n && state.n >= 1;
  const countsMatch = evenSum(state.n) === rectangleArea(state.n);
  const misconceptionOk = state.misconceptionChecked && state.misconceptionSelected === 'correct';
  const generalStep = state.generalStepAccepted && misconceptionOk;
  const isComplete = allDocked && countsMatch && generalStep && state.transferPassed;
  return {
    isComplete,
    allDocked,
    dockedCount,
    countsMatch,
    generalStep,
    transferPassed: state.transferPassed,
    misconceptionOk,
  };
}

export function getRejectionMessage(dragRow: number, targetRow: number, n: number): string {
  if (dragRow !== targetRow) {
    return `That move violates matching layers. Row ${dragRow} has ${2 * dragRow} dots; slot ${targetRow} only accepts the ${2 * targetRow}-dot row. Try the dashed target for row ${dragRow}.`;
  }
  return `That slot is already filled. Erase it or dock a still-floating row. n = ${n}.`;
}

export function getOutOfBandMessage(): string {
  return 'That pose is outside the commit band. Move closer to the matching dashed target — we never auto-dock from far away.';
}
