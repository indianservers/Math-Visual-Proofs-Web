export type ProofCategory = 
  | 'Transformations & Symmetry'
  | 'Engineering Mathematics'
  | 'Sequences and Series'
  | 'Sequences & Series'
  | 'Geometry'
  | 'Algebra'
  | 'Trigonometry'
  | 'Calculus'
  | 'Number Theory';

export interface MathProofItem {
  id: string;
  catalogId: string;
  title: string;
  formula: string;
  category: ProofCategory;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  description: string;
  learningOutcomes: string[];
  tags: string[];
  route: string;
  featured?: boolean;
  color: string;
  iconName: string;
}

export type ShapeId = 
  | 'triangle'
  | 'square'
  | 'pentagon'
  | 'hexagon'
  | 'octagon'
  | 'rectangle'
  | 'nonagon'
  | 'custom';

export interface ShapeDefinition {
  id: ShapeId;
  name: string;
  displayName: string;
  sides: number;
  isRegular: boolean;
  lineSymmetries: number;
  rotationalOrder: number;
  minAngleStep: number; // in degrees: 360 / rotationalOrder
  color: string;
  strokeColor: string;
  fillColor: string;
  lightFill: string;
  radius: number;
  aspectRatio?: number; // for rectangle
  isCustom?: boolean; // true when generated from user n-input
}

export type ProofState = 
  | 'inspect'
  | 'manipulate'
  | 'preserve'
  | 'connect'
  | 'conclude'
  | 'transfer';

export interface HintItem {
  level: number;
  type: 'Notice' | 'Choose' | 'Predict' | 'Guide' | 'Explain';
  title: string;
  message: string;
  actionPrompt?: string;
}

export interface ChallengeQuestion {
  id: string;
  question: string;
  shapeDescription: string;
  knownProperty: 'lines' | 'order' | 'sides';
  knownValue: number;
  targetProperty: 'lines' | 'order' | 'angle';
  correctAnswer: number;
  hint: string;
  explanation: string;
}
