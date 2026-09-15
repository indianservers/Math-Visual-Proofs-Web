export interface SierpinskiHole {
  x: number;
  y: number;
  size: number;
  level: number;
}

export interface SierpinskiEvaluation {
  level: number;
  retainedSquareCount: number; // 8^n
  singleSquareAreaFraction: string; // (1/9)^n
  retainedAreaFraction: number; // (8/9)^n
  retainedAreaPercent: string;
  removedAreaPercent: string;
  holes: SierpinskiHole[];
}

export function computeSierpinski(
  level: number,
  baseSize: number = 270,
  originX: number = 0,
  originY: number = 0
): SierpinskiEvaluation {
  const clampedLevel = Math.max(0, Math.min(4, Math.floor(level)));
  const retainedSquareCount = Math.pow(8, clampedLevel);
  const retainedAreaFraction = Math.pow(8 / 9, clampedLevel);
  const retainedAreaPercent = (retainedAreaFraction * 100).toFixed(1) + '%';
  const removedAreaPercent = ((1 - retainedAreaFraction) * 100).toFixed(1) + '%';
  const singleSquareAreaFraction = `1 / ${Math.pow(9, clampedLevel)}`;

  const holes: SierpinskiHole[] = [];

  // Recursively collect center cutout holes for iterations 1 to clampedLevel
  function generateHoles(x: number, y: number, size: number, currentLevel: number) {
    if (currentLevel > clampedLevel || currentLevel <= 0) return;

    const subSize = size / 3;

    // Center hole for this square
    holes.push({
      x: x + subSize,
      y: y + subSize,
      size: subSize,
      level: currentLevel,
    });

    if (currentLevel < clampedLevel) {
      // Recurse into the 8 surrounding sub-squares
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (row === 1 && col === 1) continue; // skip the center hole
          generateHoles(
            x + col * subSize,
            y + row * subSize,
            subSize,
            currentLevel + 1
          );
        }
      }
    }
  }

  if (clampedLevel >= 1) {
    generateHoles(originX, originY, baseSize, 1);
  }

  return {
    level: clampedLevel,
    retainedSquareCount,
    singleSquareAreaFraction,
    retainedAreaFraction,
    retainedAreaPercent,
    removedAreaPercent,
    holes,
  };
}
