export type ProofState = 'inspect' | 'manipulate' | 'preserve' | 'connect' | 'conclude' | 'transfer';

export interface Hint {
  title: string;
  text: string;
}

export const LIMITS = {
  defaultDigits: [7, 3, 8, 6, 2, 4, 1],
  minDigits: 3,
  maxDigits: 8,
  snapThreshold: 40, // screen pixels
};

export const HINTS: Record<number, Hint> = {
  1: {
    title: 'Inspect the Number',
    text: 'Look at the number 7386241. Alternating digits from the right will go into Group A (+) and Group B (-).'
  },
  2: {
    title: 'Sort the Digits',
    text: 'Drag the 1st digit from the right (1) into Group A. The 2nd digit (4) goes to Group B. Alternate this sorting gesture for all digits.'
  },
  3: {
    title: 'Check the Invariant',
    text: 'As you sort, note that the alternating sum remainder modulo 11 remains congruent to the original number modulo 11.'
  },
  4: {
    title: 'Analyze the Powers of 10',
    text: 'Observe that 10^0 ≡ 1, 10^1 ≡ -1, 10^2 ≡ 1, 10^3 ≡ -1 (mod 11). This explains why the signs alternate.'
  },
  5: {
    title: 'Complete the Identity',
    text: 'Assemble the final theorem to prove that a number is divisible by 11 if and only if the alternating sum is divisible by 11.'
  }
};
