export interface GPBar {
  index: number; // 1-indexed
  value: number; // a * r^(k - 1)
  algebraicFormula: string; // e.g. "a", "a·r", "a·r²"
  ratioFromPrev: number | null; // r
}

export interface GPScalingEvaluation {
  a: number;
  r: number;
  n: number;
  maxVal: number;
  minVal: number;
  terms: GPBar[];
}

export function computeGPScaling(a: number, r: number, n: number): GPScalingEvaluation {
  const clampedN = Math.max(1, Math.min(6, Math.floor(n)));
  const terms: GPBar[] = [];

  let current = a;
  let maxVal = a;
  let minVal = a;

  for (let k = 1; k <= clampedN; k++) {
    const val = a * Math.pow(r, k - 1);
    if (val > maxVal) maxVal = val;
    if (val < minVal) minVal = val;

    let formula = 'a';
    if (k === 2) formula = 'a · r';
    else if (k > 2) formula = `a · r^{${k - 1}}`;

    terms.push({
      index: k,
      value: Math.round(val * 1000) / 1000,
      algebraicFormula: formula,
      ratioFromPrev: k > 1 ? r : null,
    });
    current *= r;
  }

  return {
    a,
    r,
    n: clampedN,
    maxVal,
    minVal,
    terms,
  };
}
