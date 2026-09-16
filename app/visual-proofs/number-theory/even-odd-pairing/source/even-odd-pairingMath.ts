export interface ParityResult {
  n: number;
  pairs: number; // k = floor(n / 2)
  remainder: number; // r = n % 2 (0 or 1)
  isEven: boolean;
  isOdd: boolean;
  formulaTex: string; // e.g. "7 = 2 \times 3 + 1"
  generalFormulaTex: string; // e.g. "n = 2k + 1" or "n = 2k"
  explanation: string;
}

export function calculateParity(n: number): ParityResult {
  const safeN = Math.max(0, Math.floor(n));
  const pairs = Math.floor(safeN / 2);
  const remainder = safeN % 2;
  const isEven = remainder === 0;
  const isOdd = remainder === 1;

  const formulaTex = isEven
    ? `${safeN} = 2 \\times ${pairs}`
    : `${safeN} = 2 \\times ${pairs} + 1`;

  const generalFormulaTex = isEven ? "n = 2k" : "n = 2k + 1";

  const explanation = isEven
    ? "All counters form complete pairs of 2. There are zero leftovers."
    : "Odd numbers are one more than an even number (one leftover counter).";

  return {
    n: safeN,
    pairs,
    remainder,
    isEven,
    isOdd,
    formulaTex,
    generalFormulaTex,
    explanation,
  };
}

export interface PairSlotInfo {
  slotIndex: number;
  socket0CounterId: number | null;
  socket1CounterId: number | null;
  isComplete: boolean;
  isPartial: boolean;
  isLeftoverOnly: boolean;
}

export function computePairSlots(
  n: number,
  placedMap: Record<number, { slotIndex: number; socketIndex: 0 | 1 }>,
  leftoverId: number | null,
): PairSlotInfo[] {
  const totalSlotsNeeded = Math.ceil(n / 2);
  const slots: PairSlotInfo[] = [];

  for (let i = 0; i < totalSlotsNeeded; i++) {
    const isLastSlot = i === totalSlotsNeeded - 1;
    const isOddLeftoverSlot = isLastSlot && n % 2 !== 0;

    let socket0Id: number | null = null;
    let socket1Id: number | null = null;

    Object.entries(placedMap).forEach(([idStr, loc]) => {
      const id = Number(idStr);
      if (loc.slotIndex === i) {
        if (loc.socketIndex === 0) socket0Id = id;
        if (loc.socketIndex === 1) socket1Id = id;
      }
    });

    if (isOddLeftoverSlot && leftoverId !== null) {
      socket1Id = leftoverId;
    }

    const isComplete = socket0Id !== null && socket1Id !== null;
    const isPartial = (socket0Id !== null || socket1Id !== null) && !isComplete;

    slots.push({
      slotIndex: i,
      socket0CounterId: socket0Id,
      socket1CounterId: socket1Id,
      isComplete,
      isPartial,
      isLeftoverOnly: isOddLeftoverSlot,
    });
  }

  return slots;
}

export interface ArrayGridItem {
  id: number;
  row: number; // 0 or 1
  col: number;
  isLeftover: boolean;
}

export function computeArrayGrid(n: number): ArrayGridItem[] {
  const items: ArrayGridItem[] = [];
  const topCount = Math.ceil(n / 2);
  const bottomCount = Math.floor(n / 2);

  let currentId = 1;
  // Fill top row
  for (let col = 0; col < topCount; col++) {
    const isLeftover = col === topCount - 1 && n % 2 !== 0;
    items.push({
      id: currentId++,
      row: 0,
      col,
      isLeftover,
    });
  }

  // Fill bottom row
  for (let col = 0; col < bottomCount; col++) {
    items.push({
      id: currentId++,
      row: 1,
      col,
      isLeftover: false,
    });
  }

  return items;
}

export interface RemainderLaneJump {
  from: number;
  to: number;
  stepIndex: number;
  isRemainder: boolean;
}

export function computeRemainderLaneJumps(n: number): RemainderLaneJump[] {
  const jumps: RemainderLaneJump[] = [];
  const pairs = Math.floor(n / 2);
  const remainder = n % 2;

  for (let i = 0; i < pairs; i++) {
    jumps.push({
      from: i * 2,
      to: (i + 1) * 2,
      stepIndex: i + 1,
      isRemainder: false,
    });
  }

  if (remainder > 0) {
    jumps.push({
      from: pairs * 2,
      to: pairs * 2 + remainder,
      stepIndex: pairs + 1,
      isRemainder: true,
    });
  }

  return jumps;
}

export function checkParityInvariant(
  n: number,
  placedCount: number,
  unplacedCount: number,
  leftoverCount: number,
): { valid: boolean; message: string } {
  const total = placedCount + unplacedCount + leftoverCount;
  if (total !== n) {
    return {
      valid: false,
      message: `Total counters invariant violated: found ${total}, expected ${n}`,
    };
  }
  return { valid: true, message: "Invariant preserved: all counters conserved." };
}
