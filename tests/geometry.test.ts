import { describe, expect, it } from "vitest";
import {
  angleAt,
  constrainPoint,
  nearestPointSnap,
  pointsToSvg,
  polygonArea,
  rotateAround,
} from "../app/lib/geometry";

describe("geometry foundation", () => {
  it("calculates triangle area independently of winding", () => {
    const triangle = [{ x: 0, y: 0 }, { x: 8, y: 0 }, { x: 0, y: 6 }];
    expect(polygonArea(triangle)).toBe(24);
    expect(polygonArea([...triangle].reverse())).toBe(24);
  });

  it("calculates a right angle", () => {
    expect(angleAt({ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 })).toBeCloseTo(90);
  });

  it("constrains points to a proof canvas", () => {
    expect(constrainPoint({ x: -5, y: 30 }, { minX: 0, maxX: 20, minY: 0, maxY: 20 })).toEqual({ x: 0, y: 20 });
  });

  it("rotates a point around a center", () => {
    const rotated = rotateAround({ x: 1, y: 0 }, { x: 0, y: 0 }, 90);
    expect(rotated.x).toBeCloseTo(0);
    expect(rotated.y).toBeCloseTo(1);
  });

  it("magnetically snaps only inside the target radius", () => {
    const targets = [{ x: 10, y: 10 }, { x: 30, y: 30 }];
    expect(nearestPointSnap({ x: 12, y: 12 }, targets, 5)).toMatchObject({ point: targets[0], snapped: true, targetIndex: 0 });
    expect(nearestPointSnap({ x: 20, y: 20 }, targets, 5).snapped).toBe(false);
  });

  it("serializes SVG points consistently", () => {
    expect(pointsToSvg([{ x: 1, y: 2 }, { x: 3, y: 4 }])).toBe("1,2 3,4");
  });
});
