import {
  cubeCount,
  frontView,
  projectionsMatch,
  sideView,
  topView,
  type HeightGrid,
} from "../orthographic-projection-from-cube-stacks/orthoMath";

/**
 * Two different solids with identical top / front / side projections.
 * The extra cube in B sits under an already-maximal silhouette.
 */
export const SOLID_A: HeightGrid = [
  [2, 2, 0],
  [2, 1, 0],
  [0, 0, 0],
];

export const SOLID_B: HeightGrid = [
  [2, 2, 0],
  [2, 2, 0],
  [0, 0, 0],
];

export function demonstrateAmbiguity() {
  const match = projectionsMatch(SOLID_A, SOLID_B);
  return {
    match,
    countA: cubeCount(SOLID_A),
    countB: cubeCount(SOLID_B),
    sameProjections: match.top && match.front && match.side,
    differentCounts: cubeCount(SOLID_A) !== cubeCount(SOLID_B),
    top: topView(SOLID_A),
    front: frontView(SOLID_A),
    side: sideView(SOLID_A),
  };
}
