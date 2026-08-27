import { distance } from "../lib/geometry";
import type {
  DockingSlotConfig,
  ProofObjectConfig,
  ProofObjectState,
  ValidationResult,
} from "./types";

export function normalizeRotation(rotation: number) {
  return ((rotation % 360) + 360) % 360;
}

export function rotationMatches(
  actual: number,
  required: number,
  tolerance = 0,
) {
  const difference = Math.abs(
    normalizeRotation(actual) - normalizeRotation(required),
  );
  return Math.min(difference, 360 - difference) <= tolerance;
}

export function validateDock<Id extends string>(
  object: ProofObjectState<Id>,
  config: ProofObjectConfig<Id>,
  slot: DockingSlotConfig<Id>,
  occupiedBy: Id | null,
): ValidationResult {
  const acceptsIdentity =
    slot.accepts.length === 0 || slot.accepts.includes(object.id);
  const acceptsType =
    !slot.acceptsTypes?.length ||
    slot.acceptsTypes.includes(config.mathematicalType);
  const acceptsTags =
    !slot.acceptsTags?.length ||
    slot.acceptsTags.some((tag) => config.tags?.includes(tag));
  if (
    !config.compatibleSlotIds.includes(slot.id) ||
    !acceptsIdentity ||
    !acceptsType ||
    !acceptsTags
  )
    return { valid: false, reason: "incompatible" };
  if (occupiedBy && occupiedBy !== object.id)
    return { valid: false, reason: "occupied" };
  if (
    !rotationMatches(
      object.rotation,
      slot.requiredRotation,
      slot.orientationTolerance,
    )
  )
    return { valid: false, reason: "orientation" };
  if (distance(object, slot.target) > config.snapTolerance)
    return { valid: false, reason: "distance" };
  return { valid: true, reason: "valid" };
}
