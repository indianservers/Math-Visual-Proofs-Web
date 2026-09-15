export interface GPSumTerm {
  power: number; // 0 to n
  algebraic: string; // e.g. "a", "ar", "ar²", ...
  numericValue: number;
  inS: boolean; // present in original series S
  inRS: boolean; // present in multiplied series r*S
  isCanceled: boolean; // cancels out when subtracting
}

export interface GPSumEvaluation {
  a: number;
  r: number;
  n: number;
  sumSn: number;
  rSumSn: number;
  differenceVal: number; // S - rS = a(1 - r^n)
  headTermVal: number; // a
  tailTermVal: number; // a * r^n
  terms: GPSumTerm[];
}

export function computeGPSum(a: number, r: number, n: number): GPSumEvaluation {
  const clampedN = Math.max(1, Math.min(6, Math.floor(n)));
  
  // Exact sum Sn = a * (1 - r^n) / (1 - r) if r != 1, else n * a
  const sumSn = Math.abs(r - 1) < 1e-6 
    ? clampedN * a 
    : (a * (1 - Math.pow(r, clampedN))) / (1 - r);
  
  const rSumSn = r * sumSn;
  const headTermVal = a;
  const tailTermVal = a * Math.pow(r, clampedN);
  const differenceVal = sumSn - rSumSn;

  const terms: GPSumTerm[] = [];

  // Powers from 0 to n
  for (let p = 0; p <= clampedN; p++) {
    const numericValue = Math.round(a * Math.pow(r, p) * 1000) / 1000;
    let algebraic = 'a';
    if (p === 1) algebraic = 'ar';
    else if (p > 1) algebraic = `ar^{${p}}`;

    const inS = p < clampedN;
    const inRS = p > 0;
    const isCanceled = inS && inRS; // middle terms that cancel!

    terms.push({
      power: p,
      algebraic,
      numericValue,
      inS,
      inRS,
      isCanceled,
    });
  }

  return {
    a,
    r,
    n: clampedN,
    sumSn: Math.round(sumSn * 1000) / 1000,
    rSumSn: Math.round(rSumSn * 1000) / 1000,
    differenceVal: Math.round(differenceVal * 1000) / 1000,
    headTermVal,
    tailTermVal: Math.round(tailTermVal * 1000) / 1000,
    terms,
  };
}
