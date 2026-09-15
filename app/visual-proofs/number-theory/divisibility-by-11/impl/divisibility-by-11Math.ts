export interface DigitSlot {
  id: number;
  digit: number;
  power: number; // 0-indexed power of 10 from right
  color: string;
}

export interface DragTarget {
  type: 'slot' | 'groupA' | 'groupB';
  slotIdx?: number;
  x: number;
  y: number;
}

/**
 * Convert digit array (from left to right) to a single integer
 */
export function digitsToNumber(digits: number[]): number {
  return digits.reduce((acc, d) => acc * 10 + d, 0);
}

/**
 * Calculates sums of alternating groups from the right
 */
export function calculateAlternatingSums(digits: number[]) {
  let sumA = 0; // + signs: 1st, 3rd, 5th, 7th... from right (index: len-1, len-3...)
  let sumB = 0; // - signs: 2nd, 4th, 6th... from right (index: len-2, len-4...)
  
  const len = digits.length;
  for (let i = 0; i < len; i++) {
    const power = len - 1 - i;
    const val = digits[i];
    if (power % 2 === 0) {
      sumA += val;
    } else {
      sumB += val;
    }
  }

  const diff = sumA - sumB;
  const numValue = digitsToNumber(digits);
  
  return {
    sumA,
    sumB,
    diff,
    remainderNum: numValue % 11,
    remainderDiff: ((diff % 11) + 11) % 11,
    isDivisible: numValue % 11 === 0,
  };
}

/**
 * Get distinct colors matching the page195-final-verified.png
 */
export function getDigitColor(power: number): string {
  const colors = [
    '#5b2cff', // 10^0 - blue-violet
    '#f25a68', // 10^1 - red
    '#ef9d22', // 10^2 - orange
    '#38c36f', // 10^3 - green
    '#7b50ff', // 10^4 - purple
    '#ff8490', // 10^5 - pink-red
    '#3282f6', // 10^6 - blue
    '#8b66ff', // 10^7 - light purple
  ];
  return colors[power % colors.length];
}

/**
 * Dynamic coordinates mapping for SVG viewBox: 760 x 300
 */
export function generateDragTargets(digits: number[]): DragTarget[] {
  const targets: DragTarget[] = [];
  const len = digits.length;

  // 1. Initial Digit Slot Positions (Top) - Dynamically centered in Build a number card (center = 125)
  const centerCard = 125;
  const stepSpacing = 28;
  const totalWidth = (len - 1) * stepSpacing;
  const startX = centerCard - totalWidth / 2;
  const slotY = 90;

  for (let i = 0; i < len; i++) {
    targets.push({
      type: 'slot',
      slotIdx: i,
      x: startX + i * stepSpacing,
      y: slotY,
    });
  }

  // 2. Group A (+) Box Layout (Centered in Group A card: center = 340)
  const groupAX = 340;
  const groupAY = 165;
  targets.push(
    { type: 'groupA', slotIdx: 0, x: groupAX - 30, y: groupAY - 35 },
    { type: 'groupA', slotIdx: 1, x: groupAX + 30, y: groupAY - 35 },
    { type: 'groupA', slotIdx: 2, x: groupAX - 30, y: groupAY + 15 },
    { type: 'groupA', slotIdx: 3, x: groupAX + 30, y: groupAY + 15 },
    { type: 'groupA', slotIdx: 4, x: groupAX, y: groupAY + 60 }
  );

  // 3. Group B (-) Box Layout (Centered in Group B card: center = 505)
  const groupBX = 505;
  const groupBY = 165;
  targets.push(
    { type: 'groupB', slotIdx: 0, x: groupBX - 30, y: groupBY - 35 },
    { type: 'groupB', slotIdx: 1, x: groupBX + 30, y: groupBY - 35 },
    { type: 'groupB', slotIdx: 2, x: groupBX - 30, y: groupBY + 15 },
    { type: 'groupB', slotIdx: 3, x: groupBX + 30, y: groupBY + 15 }
  );

  return targets;
}
