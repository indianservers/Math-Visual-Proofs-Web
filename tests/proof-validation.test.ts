import { describe, expect, it } from "vitest";
import {
  PYTHAGOREAN_PIECES,
  PYTHAGOREAN_SLOTS,
} from "../app/proof-engine/pythagoreanConfig";
import {
  normalizeRotation,
  validateDock,
} from "../app/proof-engine/validation";

describe("proof docking validation", () => {
  it("normalizes equivalent rotations", () => {
    expect(normalizeRotation(-90)).toBe(270);
    expect(normalizeRotation(450)).toBe(90);
  });

  it("supports authored orientation tolerance", () => {
    const config = PYTHAGOREAN_PIECES[0];
    const slot = { ...PYTHAGOREAN_SLOTS[0], orientationTolerance: 5 };
    const object = {
      id: config.id,
      ...slot.target,
      rotation: 94,
      dockedSlotId: null,
    };
    expect(validateDock(object, config, slot, null).valid).toBe(true);
  });

  it("requires component identity, orientation, and proximity", () => {
    const config = PYTHAGOREAN_PIECES[0];
    const slot = PYTHAGOREAN_SLOTS[0];
    const correct = { id: config.id, ...slot.target, dockedSlotId: null };
    expect(validateDock(correct, config, slot, null)).toEqual({
      valid: true,
      reason: "valid",
    });
    expect(
      validateDock({ ...correct, rotation: 0 }, config, slot, null).reason,
    ).toBe("orientation");
    expect(
      validateDock({ ...correct, x: 400 }, config, slot, null).reason,
    ).toBe("distance");
    expect(
      validateDock(correct, config, PYTHAGOREAN_SLOTS[1], null).reason,
    ).toBe("incompatible");
  });
});
