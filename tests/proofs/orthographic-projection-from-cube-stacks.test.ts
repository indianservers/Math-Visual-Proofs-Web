import { describe, expect, it } from "vitest";
import {
  cubeCount,
  frontView,
  sideView,
  topView,
} from "../../app/visual-proofs/geometry/orthographic-projection-from-cube-stacks/orthoMath";
import { proofConfig } from "../../app/visual-proofs/geometry/orthographic-projection-from-cube-stacks/proof.config";

describe("Orthographic Projections from Cube Stacks", () => {
  it("keeps its catalog identity isolated", () => {
    expect(proofConfig.id).toBe("orthographic-projection-from-cube-stacks");
  });

  it("reads top/front/side from stack heights", () => {
    const grid = [
      [2, 1, 0],
      [1, 0, 0],
      [0, 0, 0],
    ];
    expect(cubeCount(grid)).toBe(4);
    expect(frontView(grid)).toEqual([2, 1, 0]);
    expect(sideView(grid)).toEqual([2, 1, 0]);
    expect(topView(grid)[0]?.[0]).toBe(true);
    expect(topView(grid)[2]?.[2]).toBe(false);
  });
});
