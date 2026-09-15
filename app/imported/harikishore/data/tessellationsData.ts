export interface TileDefinition {
  id: string;
  name: string;
  sides: number;
  isRegular: boolean;
  interiorAngle: number;
  canTessellateRegularly: boolean;
  tilesAtVertex: number;
  angleSumAtVertex: number;
  gapOrOverlap: number; // 0 = perfect, positive = gap, negative = overlap
  fillColor: string;
  strokeColor: string;
  previewPoints: string;
  tessellationType?: string; // e.g. "3.3.3.3.3.3", "4.4.4.4", "6.6.6", "Semi-regular 8.8.4"
}

export const TILES_DATA: Record<string, TileDefinition> = {
  triangle: {
    id: 'triangle',
    name: 'Equilateral Triangle',
    sides: 3,
    isRegular: true,
    interiorAngle: 60,
    canTessellateRegularly: true,
    tilesAtVertex: 6,
    angleSumAtVertex: 360,
    gapOrOverlap: 0,
    fillColor: 'rgba(139, 92, 246, 0.25)',
    strokeColor: '#7c3aed',
    previewPoints: '20,6 36,34 4,34',
    tessellationType: '3⁶ (6 triangles meet at each vertex)',
  },
  square: {
    id: 'square',
    name: 'Square',
    sides: 4,
    isRegular: true,
    interiorAngle: 90,
    canTessellateRegularly: true,
    tilesAtVertex: 4,
    angleSumAtVertex: 360,
    gapOrOverlap: 0,
    fillColor: 'rgba(59, 130, 246, 0.25)',
    strokeColor: '#2563eb',
    previewPoints: '8,8 32,8 32,32 8,32',
    tessellationType: '4⁴ (4 squares meet at each vertex)',
  },
  pentagon: {
    id: 'pentagon',
    name: 'Regular Pentagon',
    sides: 5,
    isRegular: true,
    interiorAngle: 108,
    canTessellateRegularly: false,
    tilesAtVertex: 3,
    angleSumAtVertex: 324,
    gapOrOverlap: 36, // 36 deg gap
    fillColor: 'rgba(239, 68, 68, 0.22)',
    strokeColor: '#dc2626',
    previewPoints: '20,6 34,16 29,32 11,32 6,16',
    tessellationType: 'Leaves 36° gap (324° total)',
  },
  hexagon: {
    id: 'hexagon',
    name: 'Regular Hexagon',
    sides: 6,
    isRegular: true,
    interiorAngle: 120,
    canTessellateRegularly: true,
    tilesAtVertex: 3,
    angleSumAtVertex: 360,
    gapOrOverlap: 0,
    fillColor: 'rgba(16, 185, 129, 0.28)',
    strokeColor: '#059669',
    previewPoints: '20,6 32,13 32,27 20,34 8,27 8,13',
    tessellationType: '6³ (3 hexagons meet at each vertex)',
  },
  octagon: {
    id: 'octagon',
    name: 'Regular Octagon',
    sides: 8,
    isRegular: true,
    interiorAngle: 135,
    canTessellateRegularly: false,
    tilesAtVertex: 2,
    angleSumAtVertex: 270,
    gapOrOverlap: 90, // 90 deg gap (filled with a square for 8.8.4)
    fillColor: 'rgba(245, 158, 11, 0.25)',
    strokeColor: '#d97706',
    previewPoints: '20,6 30,10 34,20 30,30 20,34 10,30 6,20 10,10',
    tessellationType: 'Leaves 90° gap (forms 8.8.4 with squares)',
  },
  rhombus: {
    id: 'rhombus',
    name: 'Rhombus / Parallelogram',
    sides: 4,
    isRegular: false,
    interiorAngle: 60, // and 120
    canTessellateRegularly: true,
    tilesAtVertex: 4,
    angleSumAtVertex: 360,
    gapOrOverlap: 0,
    fillColor: 'rgba(6, 182, 212, 0.25)',
    strokeColor: '#0891b2',
    previewPoints: '12,8 34,8 28,32 6,32',
    tessellationType: 'Translational Lattice (60° + 120° + 60° + 120°)',
  },
};

export const TILES_LIST: TileDefinition[] = Object.values(TILES_DATA);
