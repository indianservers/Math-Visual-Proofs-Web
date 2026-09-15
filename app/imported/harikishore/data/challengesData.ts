import { ChallengeQuestion } from '../types';

export const BASE_CHALLENGES: ChallengeQuestion[] = [
  {
    id: 'c-heptagon-1',
    question: 'A regular shape has 7 lines of symmetry. What is its rotational symmetry order?',
    shapeDescription: 'Regular Heptagon (7 sides)',
    knownProperty: 'lines',
    knownValue: 7,
    targetProperty: 'order',
    correctAnswer: 7,
    hint: 'Think regular! For any regular n-gon, the number of mirror lines equals the rotational symmetry order (n).',
    explanation: 'Since the shape is regular and has 7 lines of symmetry, it has 7 sides (a regular heptagon), so its rotational symmetry order is also 7.',
  },
  {
    id: 'c-decagon-2',
    question: 'A regular polygon has rotational symmetry of order 10. How many lines of symmetry does it have?',
    shapeDescription: 'Regular Decagon (10 sides)',
    knownProperty: 'order',
    knownValue: 10,
    targetProperty: 'lines',
    correctAnswer: 10,
    hint: 'A regular n-gon always has n lines of symmetry and rotational symmetry of order n.',
    explanation: 'A regular polygon with rotational order 10 has 10 sides and therefore exactly 10 lines of symmetry.',
  },
  {
    id: 'c-angle-3',
    question: 'A regular hexagon has rotational symmetry of order 6. What is the minimum angle (in degrees) to rotate it onto itself?',
    shapeDescription: 'Regular Hexagon (6 sides)',
    knownProperty: 'order',
    knownValue: 6,
    targetProperty: 'angle',
    correctAnswer: 60,
    hint: 'Divide a full turn (360°) by the rotational order: 360 / order.',
    explanation: 'The minimum angle is 360° / 6 = 60°.',
  },
  {
    id: 'c-dodecagon-4',
    question: 'A regular 12-gon (dodecagon) has how many lines of symmetry?',
    shapeDescription: 'Regular Dodecagon (12 sides)',
    knownProperty: 'sides',
    knownValue: 12,
    targetProperty: 'lines',
    correctAnswer: 12,
    hint: 'For every regular n-sided polygon, lines of symmetry = n.',
    explanation: 'A regular 12-gon has 12 vertices and 12 axes of symmetry.',
  },
  {
    id: 'c-rectangle-5',
    question: 'A non-square rectangle has how many lines of symmetry?',
    shapeDescription: 'Rectangle',
    knownProperty: 'sides',
    knownValue: 4,
    targetProperty: 'lines',
    correctAnswer: 2,
    hint: 'Careful! Unlike a square, diagonal folds on a rectangle do not map vertices onto vertices.',
    explanation: 'A rectangle only has 2 lines of symmetry (horizontal and vertical through opposite edge midpoints). Diagonals are NOT lines of symmetry.',
  }
];

export function generateRandomChallenge(): ChallengeQuestion {
  const n = Math.floor(Math.random() * 8) + 5; // 5 to 12
  const types = ['orderFromLines', 'linesFromOrder', 'angleFromOrder'];
  const type = types[Math.floor(Math.random() * types.length)];

  if (type === 'angleFromOrder') {
    const angle = 360 / n;
    // pick n that divides 360 nicely: 5, 6, 8, 9, 10, 12
    const niceN = [5, 6, 8, 9, 10, 12][Math.floor(Math.random() * 6)];
    return {
      id: `random-${Date.now()}`,
      question: `A regular ${niceN}-gon has rotational symmetry of order ${niceN}. What is its smallest angle of rotational symmetry in degrees?`,
      shapeDescription: `Regular ${niceN}-gon`,
      knownProperty: 'order',
      knownValue: niceN,
      targetProperty: 'angle',
      correctAnswer: 360 / niceN,
      hint: `Divide 360° by ${niceN}.`,
      explanation: `Smallest rotation = 360° / ${niceN} = ${360 / niceN}°.`,
    };
  }

  return {
    id: `random-${Date.now()}`,
    question: `A regular polygon has ${n} lines of symmetry. What is its rotational symmetry order?`,
    shapeDescription: `Regular ${n}-gon`,
    knownProperty: 'lines',
    knownValue: n,
    targetProperty: 'order',
    correctAnswer: n,
    hint: 'Think regular! For any regular n-gon, mirror lines = rotational order = n.',
    explanation: `For every regular n-gon, the number of mirror lines equals its rotational order, which is ${n}.`,
  };
}
