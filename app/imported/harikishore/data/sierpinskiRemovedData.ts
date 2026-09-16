export interface SierpinskiRemovedPreset {
  id: string;
  name: string;
  level: number;
  description: string;
}

export const SIERPINSKI_REMOVED_PRESETS: SierpinskiRemovedPreset[] = [
  {
    id: 'step-1',
    name: 'Step 1: 1 Hole',
    level: 1,
    description: 'First center cutout. Total holes: 1 = (8¹ - 1)/7.',
  },
  {
    id: 'step-2',
    name: 'Step 2: 8 New Holes (9 Total)',
    level: 2,
    description: 'Each of 8 sub-squares gets a center hole. Total: 1 + 8 = 9 = (8² - 1)/7.',
  },
  {
    id: 'step-3',
    name: 'Step 3: 64 New Holes (73 Total)',
    level: 3,
    description: '64 smaller holes punched. Total: 1 + 8 + 64 = 73 = (8³ - 1)/7.',
  },
  {
    id: 'step-4',
    name: 'Step 4: 512 New Holes (585 Total)',
    level: 4,
    description: '512 micro holes punched. Total: 1 + 8 + 64 + 512 = 585 = (8⁴ - 1)/7.',
  },
];