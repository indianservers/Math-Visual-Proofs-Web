import {
  clamp,
  constrainPoint,
  distance,
  nearestPointSnap,
  type Point,
} from "../lib/geometry";
import { normalizeRotation, validateDock } from "./validation";
import type {
  DockCandidate,
  DockingSlotConfig,
  DropResolution,
  MovementConstraint,
  ProofObjectConfig,
  ProofObjectState,
  SnapTarget,
  Transform,
} from "./types";

function closestPointOnSegment(point: Point, start: Point, end: Point): Point {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const lengthSquared = dx * dx + dy * dy;
  if (lengthSquared === 0) return start;
  const t = clamp(
    ((point.x - start.x) * dx + (point.y - start.y) * dy) / lengthSquared,
    0,
    1,
  );
  return { x: start.x + t * dx, y: start.y + t * dy };
}

export function closestPointOnPath(point: Point, path: readonly Point[]) {
  if (path.length === 0) return point;
  if (path.length === 1) return path[0];
  let best = closestPointOnSegment(point, path[0], path[1]);
  let bestDistance = distance(point, best);
  for (let index = 1; index < path.length - 1; index += 1) {
    const candidate = closestPointOnSegment(
      point,
      path[index],
      path[index + 1],
    );
    const candidateDistance = distance(point, candidate);
    if (candidateDistance < bestDistance) {
      best = candidate;
      bestDistance = candidateDistance;
    }
  }
  return best;
}

/** Applies authored mathematical constraints in declaration order. */
export function constrainTransform(
  transform: Transform,
  constraints: readonly MovementConstraint[] = [],
): Transform {
  return constraints.reduce<Transform>((current, constraint) => {
    if (constraint.kind === "bounds") {
      const point = constrainPoint(current, constraint.bounds);
      return { ...current, ...point };
    }
    if (constraint.kind === "axis") {
      return constraint.axis === "x"
        ? { ...current, y: constraint.value ?? transform.y }
        : { ...current, x: constraint.value ?? transform.x };
    }
    if (constraint.kind === "grid") {
      const tolerance = constraint.tolerance ?? constraint.size / 2;
      const gridX = Math.round(current.x / constraint.size) * constraint.size;
      const gridY = Math.round(current.y / constraint.size) * constraint.size;
      return {
        ...current,
        x: Math.abs(gridX - current.x) <= tolerance ? gridX : current.x,
        y: Math.abs(gridY - current.y) <= tolerance ? gridY : current.y,
      };
    }
    if (constraint.kind === "path") {
      return { ...current, ...closestPointOnPath(current, constraint.points) };
    }
    if (constraint.kind === "rotation-step") {
      return {
        ...current,
        rotation: normalizeRotation(
          Math.round(current.rotation / constraint.degrees) *
            constraint.degrees,
        ),
      };
    }
    return current;
  }, transform);
}

function snapTargetAccepts(target: SnapTarget, config: ProofObjectConfig) {
  const typeAccepted =
    !target.acceptsTypes?.length ||
    target.acceptsTypes.includes(config.mathematicalType);
  const tagAccepted =
    !target.acceptsTags?.length ||
    target.acceptsTags.some((tag) => config.tags?.includes(tag));
  return typeAccepted && tagAccepted;
}

export function findMagneticSnap(
  transform: Transform,
  config: ProofObjectConfig,
  targets: readonly SnapTarget[],
) {
  const eligible = targets.filter((target) =>
    snapTargetAccepts(target, config),
  );
  const inRange = eligible.filter(
    (target) => distance(transform, target.point) <= target.radius,
  );
  if (inRange.length === 0)
    return { transform, snappedTargetId: null as string | null };
  const bestPriority = Math.max(
    ...inRange.map((target) => target.priority ?? 0),
  );
  const prioritized = inRange.filter(
    (target) => (target.priority ?? 0) === bestPriority,
  );
  const nearest = nearestPointSnap(
    transform,
    prioritized.map((target) => target.point),
    Number.POSITIVE_INFINITY,
  );
  const target = prioritized[nearest.targetIndex];
  return {
    transform: { ...transform, ...target.point },
    snappedTargetId: target.id,
  };
}

export function rankDockCandidates<Id extends string>(
  object: ProofObjectState<Id>,
  config: ProofObjectConfig<Id>,
  slots: readonly DockingSlotConfig<Id>[],
  objects: Record<Id, ProofObjectState<Id>>,
): DockCandidate<Id>[] {
  return slots
    .map((slot) => {
      const occupiedBy =
        Object.values<ProofObjectState<Id>>(objects).find(
          (candidate) => candidate.dockedSlotId === slot.id,
        )?.id ?? null;
      const validation = validateDock(object, config, slot, occupiedBy);
      const proximity = distance(object, slot.target);
      const score =
        (validation.valid ? 10_000 : 0) +
        (slot.priority ?? 0) * 100 -
        proximity;
      return { slot, distance: proximity, score, validation };
    })
    .sort((a, b) => b.score - a.score);
}

const DROP_MESSAGES = {
  incompatible: "This piece belongs to a different docking shape.",
  occupied: "That docking position already contains another piece.",
  orientation: "Rotate the piece until its edges match the docking outline.",
  distance: "Move the piece closer to its matching docking outline.",
  valid: "The piece is attached.",
} as const;

/** Pure drop decision used by pointer, touch, keyboard, and animation input. */
export function resolveDrop<Id extends string>(options: {
  object: ProofObjectState<Id>;
  config: ProofObjectConfig<Id>;
  slots: readonly DockingSlotConfig<Id>[];
  objects: Record<Id, ProofObjectState<Id>>;
  lastValidTransform: Transform;
  allowFreeDrop?: boolean;
}): DropResolution {
  const candidates = rankDockCandidates(
    options.object,
    options.config,
    options.slots,
    options.objects,
  );
  const best = candidates[0];
  if (best?.validation.valid) {
    return {
      kind: "docked",
      transform: best.slot.target,
      slotId: best.slot.id,
      message: best.slot.event || DROP_MESSAGES.valid,
    };
  }
  if (options.allowFreeDrop) {
    return {
      kind: "free",
      transform: options.object,
      message: "Piece moved. Bring it near a compatible outline to attach it.",
    };
  }
  const reason = best?.validation.reason ?? "incompatible";
  return {
    kind: "rejected",
    transform: options.lastValidTransform,
    reason,
    message: DROP_MESSAGES[reason],
  };
}
