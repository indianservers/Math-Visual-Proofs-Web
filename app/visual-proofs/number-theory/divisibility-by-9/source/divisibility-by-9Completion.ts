// ─── Divisibility by 9 — Completion & Rejection Logic ───────────────────────
import type { Div9State } from './divisibility-by-9Reducer';
import { digitsToNumber, digitSum } from './divisibility-by-9Math';

export interface CompletionResult {
  isComplete: boolean;
  allInTray: boolean;
  nPlaced: boolean;
  sPlaced: boolean;
  nCorrect: boolean;
  sCorrect: boolean;
  nMod: number;
  sMod: number;
  remMatch: boolean;
}

/**
 * Evidence-based completion: the learner must have
 * 1. moved every counter into the tray (all digits represented), AND
 * 2. placed the N token in the correct remainder lane, AND
 * 3. placed the S token in the correct remainder lane.
 */
export function checkCompletion(state: Div9State): CompletionResult {
  const numVal  = digitsToNumber(state.digits);
  const ds      = digitSum(state.digits);
  const nMod    = numVal % 9;
  const sMod    = ds % 9;

  const allInTray = state.trayCounterIds.length === state.digits.length;

  const nPlaced = state.nTokenLane !== null;
  const sPlaced = state.sTokenLane !== null;

  const correctNLane = `rem${nMod}`;
  const correctSLane = `rem${sMod}`;

  const nCorrect = state.nTokenLane === correctNLane;
  const sCorrect = state.sTokenLane === correctSLane;

  const remMatch = nMod === sMod;
  const isComplete = allInTray && nCorrect && sCorrect;

  return { isComplete, allInTray, nPlaced, sPlaced, nCorrect, sCorrect, nMod, sMod, remMatch };
}

/**
 * Returns a learner-facing rejection message when a token is placed in the wrong lane.
 */
export function getNRejectionMessage(attemptedLane: string, correctLane: string, nVal: number): string {
  const attempted = parseInt(attemptedLane.replace('rem', ''), 10);
  const correct = parseInt(correctLane.replace('rem', ''), 10);
  return '\u274c Wrong lane! ' + nVal + ' \u00f7 9 leaves remainder ' + correct + ', not ' + attempted + '. Check: ' + nVal + ' = 9\u00d7' + Math.floor(nVal / 9) + ' + ' + (nVal % 9) + '. Try lane ' + (nVal % 9) + '!';
}

export function getSRejectionMessage(attemptedLane: string, correctLane: string, sVal: number): string {
  const attempted = parseInt(attemptedLane.replace('rem', ''), 10);
  const correct = parseInt(correctLane.replace('rem', ''), 10);
  return '\u274c Wrong lane! Digit sum ' + sVal + ' \u00f7 9 = remainder ' + correct + ', not ' + attempted + '. Try lane ' + (sVal % 9) + '!';
}
