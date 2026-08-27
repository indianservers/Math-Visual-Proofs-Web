import { describe, expect, it } from "vitest";
import {
  closestPointOnPath,
  constrainTransform,
  findMagneticSnap,
  rankDockCandidates,
  resolveDrop,
} from "../app/proof-engine/canvasEngine";
import {
  projectPolyhedron,
  PRIMITIVE_SOLIDS,
} from "../app/proof-engine/geometry3d";
import {
  PYTHAGOREAN_CANVAS_CONFIG,
  PYTHAGOREAN_PIECES,
  PYTHAGOREAN_SLOTS,
  type PythagoreanPieceId,
} from "../app/proof-engine/pythagoreanConfig";
import type { ProofObjectState } from "../app/proof-engine/types";
import { parseProofCanvasConfig } from "../app/proof-engine/configSchema";

describe("intelligent proof canvas", () => {
  it("validates a complete theorem configuration before rendering", () => {
    expect(parseProofCanvasConfig(PYTHAGOREAN_CANVAS_CONFIG).id).toBe(
      "pythagorean-area-rearrangement",
    );
    expect(() =>
      parseProofCanvasConfig({
        ...PYTHAGOREAN_CANVAS_CONFIG,
        objects: [
          {
            ...PYTHAGOREAN_PIECES[0],
            compatibleSlotIds: ["missing-slot"],
          },
        ],
      }),
    ).toThrow();
  });
  it("combines bounds, grid, and rotation constraints", () => {
    expect(
      constrainTransform({ x: 103, y: -5, rotation: 82 }, [
        { kind: "bounds", bounds: { minX: 0, maxX: 100, minY: 0, maxY: 100 } },
        { kind: "grid", size: 10 },
        { kind: "rotation-step", degrees: 45 },
      ]),
    ).toEqual({ x: 100, y: 0, rotation: 90 });
  });

  it("constrains movement to the nearest point on an authored path", () => {
    expect(
      closestPointOnPath({ x: 7, y: 2 }, [
        { x: 0, y: 0 },
        { x: 10, y: 0 },
        { x: 10, y: 10 },
      ]),
    ).toEqual({ x: 7, y: 0 });
  });

  it("prefers higher-priority compatible magnetic targets", () => {
    const config = PYTHAGOREAN_PIECES[0];
    const result = findMagneticSnap(config.initial, config, [
      { id: "near", kind: "point", point: { x: 72, y: 82 }, radius: 20 },
      {
        id: "guide",
        kind: "guide",
        point: { x: 80, y: 82 },
        radius: 20,
        priority: 2,
        acceptsTypes: [config.mathematicalType],
      },
      {
        id: "wrong-type",
        kind: "point",
        point: { x: 70, y: 82 },
        radius: 20,
        priority: 5,
        acceptsTypes: ["circle"],
      },
    ]);
    expect(result.snappedTargetId).toBe("guide");
    expect(result.transform).toMatchObject({ x: 80, y: 82 });
  });

  it("ranks and resolves compatible docking independently of rendering", () => {
    const config = PYTHAGOREAN_PIECES[0];
    const slot = PYTHAGOREAN_SLOTS[0];
    const object = { id: config.id, ...slot.target, dockedSlotId: null };
    const objects = Object.fromEntries(
      PYTHAGOREAN_PIECES.map((piece) => [
        piece.id,
        { id: piece.id, ...piece.initial, dockedSlotId: null },
      ]),
    ) as Record<PythagoreanPieceId, ProofObjectState<PythagoreanPieceId>>;
    expect(
      rankDockCandidates(object, config, PYTHAGOREAN_SLOTS, objects)[0].slot.id,
    ).toBe(slot.id);
    expect(
      resolveDrop({
        object,
        config,
        slots: PYTHAGOREAN_SLOTS,
        objects,
        lastValidTransform: config.initial,
      }),
    ).toMatchObject({
      kind: "docked",
      slotId: slot.id,
      transform: slot.target,
    });
  });

  it("returns the last valid transform and a useful reason for a rejected drop", () => {
    const config = PYTHAGOREAN_PIECES[0];
    const object = {
      id: config.id,
      x: 400,
      y: 400,
      rotation: 0,
      dockedSlotId: null,
    };
    const objects = Object.fromEntries(
      PYTHAGOREAN_PIECES.map((piece) => [
        piece.id,
        piece.id === config.id
          ? object
          : { id: piece.id, ...piece.initial, dockedSlotId: null },
      ]),
    ) as Record<PythagoreanPieceId, ProofObjectState<PythagoreanPieceId>>;
    const result = resolveDrop({
      object,
      config,
      slots: PYTHAGOREAN_SLOTS,
      objects,
      lastValidTransform: config.initial,
    });
    expect(result).toMatchObject({
      kind: "rejected",
      transform: config.initial,
    });
  });
});

describe("projected 3D geometry", () => {
  it("projects and depth-sorts every cube face", () => {
    const cube = PRIMITIVE_SOLIDS.cube(100);
    const faces = projectPolyhedron(
      cube.vertices,
      cube.faces,
      {
        x: 0,
        y: 0,
        z: 0,
        rotationX: 25,
        rotationY: 35,
        rotationZ: 0,
        scale: 1,
      },
      {
        projection: "perspective",
        focalLength: 500,
        center: { x: 200, y: 150 },
      },
    );
    expect(faces).toHaveLength(6);
    expect(faces.every((face) => face.points.length === 4)).toBe(true);
    expect(faces[0].depth).toBeGreaterThanOrEqual(faces.at(-1)!.depth);
  });
});
