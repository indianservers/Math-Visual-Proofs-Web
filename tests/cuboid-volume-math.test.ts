import { describe, expect, it } from "vitest";
import { animationStep, cubeDimensions, cuboidMeasures, visibleCubesAtProgress, wholeDimension } from "../app/lib/cuboidVolumeMath";

describe("cuboid unit-cube proof", () => {
  it("counts base squares, layers, and unit cubes without mixing units", () => {
    expect(cuboidMeasures({ length: 4, width: 3, height: 2 })).toEqual({ baseArea: 12, layers: 2, volume: 24 });
    expect(cuboidMeasures(cubeDimensions(3)).volume).toBe(27);
    expect(cuboidMeasures(cubeDimensions(10)).volume).toBe(1000);
  });

  it("keeps dimensions integral and within the scene's supported range", () => {
    expect([wholeDimension(-3), wholeDimension(3.6), wholeDimension(99)]).toEqual([1, 4, 10]);
  });

  it("builds one row, one layer, then every layer", () => {
    const dimensions = { length: 4, width: 3, height: 2 };
    expect(visibleCubesAtProgress(0, dimensions)).toBe(0);
    expect(visibleCubesAtProgress(0.24, dimensions)).toBe(4);
    expect(visibleCubesAtProgress(0.46, dimensions)).toBe(12);
    expect(visibleCubesAtProgress(1, dimensions)).toBe(24);
    expect(animationStep(0.5)).toBe(3);
  });
});
