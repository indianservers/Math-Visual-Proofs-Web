export interface RemovedHole {
  x: number;
  y: number;
  size: number;
  level: number;
  isNew: boolean;
}

export interface StepSummary {
  step: number;
  newHolesCount: number; // 8^(step-1)
  cumulativeHoles: number; // (8^step - 1) / 7
  fractionalFormula: string;
}

export interface SierpinskiRemovedEvaluation {
  n: number;
  newHolesAtStepN: number;
  cumulativeHoles: number;
  theoreticalFormulaValue: number;
  steps: StepSummary[];
  holes: RemovedHole[];
}

export function computeSierpinskiRemoved(
  level: number,
  baseSize: number = 380,
  originX: number = 20,
  originY: number = 20
): SierpinskiRemovedEvaluation {
  const clampedN = Math.max(1, Math.min(4, Math.floor(level)));
  const newHolesAtStepN = Math.pow(8, clampedN - 1);
  const cumulativeHoles = Math.round((Math.pow(8, clampedN) - 1) / 7);

  const steps: StepSummary[] = [];
  let runningSum = 0;
  for (let k = 1; k <= clampedN; k++) {
    const newCount = Math.pow(8, k - 1);
    runningSum += newCount;
    steps.push({
      step: k,
      newHolesCount: newCount,
      cumulativeHoles: runningSum,
      fractionalFormula: `(8^{${k}} - 1) / 7`,
    });
  }

  const holes: RemovedHole[] = [];

  function generate(x: number, y: number, size: number, currentLvl: number) {
    if (currentLvl > clampedN || currentLvl <= 0) return;

    const subSize = size / 3;
    holes.push({
      x: x + subSize,
      y: y + subSize,
      size: subSize,
      level: currentLvl,
      isNew: currentLvl === clampedN,
    });

    if (currentLvl < clampedN) {
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (row === 1 && col === 1) continue;
          generate(x + col * subSize, y + row * subSize, subSize, currentLvl + 1);
        }
      }
    }
  }

  generate(originX, originY, baseSize, 1);

  return {
    n: clampedN,
    newHolesAtStepN,
    cumulativeHoles,
    theoreticalFormulaValue: cumulativeHoles,
    steps,
    holes,
  };
}