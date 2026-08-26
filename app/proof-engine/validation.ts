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

export function rotationMatches(actual: number, required: number) {
  return normalizeRotation(actual) === normalizeRotation(required);
}

export function validateDock<Id extends string>(
  object: ProofObjectState<Id>,
  config: ProofObjectConfig<Id>,
  slot: DockingSlotConfig<Id>,
  occupiedBy: Id | null,
): ValidationResult {
  if (!config.compatibleSlotIds.includes(slot.id) || !slot.accepts.includes(object.id))
    return { valid: false, reason: "incompatible" };
  if (occupiedBy && occupiedBy !== object.id)
    return { valid: false, reason: "occupied" };
  if (!rotationMatches(object.rotation, slot.requiredRotation))
    return { valid: false, reason: "orientation" };
  if (distance(object, slot.target) > config.snapTolerance)
    return { valid: false, reason: "distance" };
  return { valid: true, reason: "valid" };
}
