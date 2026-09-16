export interface APTerm {
  index: number; // 1-indexed (n = 1, 2, 3...)
  value: number;
  jumpFromPrev: number;
  cumulativeJumps: number;
  algebraicFormula: string;
}

export interface APEvaluation {
  a: number;
  d: number;
  n: number;
  terms: APTerm[];
  targetTermValue: number;
  sumSn: number;
  minVal: number;
  maxVal: number;
}

export function computeAP(
  a: number,
  d: number,
  n: number
): APEvaluation {
  const safeN = Math.max(1, Math.min(10, Math.round(n)));
  const terms: APTerm[] = [];

  let sum = 0;
  for (let i = 1; i <= safeN; i++) {
    const val = a + (i - 1) * d;
    sum += val;
    terms.push({
      index: i,
      value: val,
      jumpFromPrev: i === 1 ? 0 : d,
      cumulativeJumps: i - 1,
      algebraicFormula: i === 1 ? `${a}` : `${a} + (${i - 1})(${d})`,
    });
  }

  const allVals = terms.map(t => t.value);
  const minVal = Math.min(a, ...allVals);
  const maxVal = Math.max(a, ...allVals);

  return {
    a,
    d,
    n: safeN,
    terms,
    targetTermValue: terms[terms.length - 1].value,
    sumSn: sum,
    minVal,
    maxVal,
  };
}
