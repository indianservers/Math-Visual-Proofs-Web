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

export type CanvasDirection = "left" | "right" | "up" | "down";

export type ViewBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

/** Keeps SVG zoom predictable and centered for every proof scene. */
export function calculateViewBox(
  width: number,
  height: number,
  zoom: number,
  center: Point = { x: width / 2, y: height / 2 },
): ViewBox {
  const safeZoom = clamp(zoom, 1, 8);
  const viewWidth = width / safeZoom;
  const viewHeight = height / safeZoom;
  const maxX = Math.max(0, width - viewWidth);
  const maxY = Math.max(0, height - viewHeight);
  return {
    x: clamp(center.x - viewWidth / 2, 0, maxX),
    y: clamp(center.y - viewHeight / 2, 0, maxY),
    width: viewWidth,
    height: viewHeight,
  };
}

/** Spatial selection lets arrow navigation feel natural on any configured canvas. */
export function findDirectionalNeighbor<Id extends string>(
  currentId: Id,
  objects: Record<Id, Pick<Transform, "x" | "y">>,
  direction: CanvasDirection,
): Id | null {
  const current = objects[currentId];
  if (!current) return null;
  const vector = {
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 },
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
  }[direction];
  const candidates = Object.entries<Pick<Transform, "x" | "y">>(objects)
    .filter(([id]) => id !== currentId)
    .map(([id, point]) => {
      const dx = point.x - current.x;
      const dy = point.y - current.y;
      const forward = dx * vector.x + dy * vector.y;
      const sideways = Math.abs(dx * vector.y - dy * vector.x);
      return {
        id: id as Id,
        forward,
        score: forward + sideways * 2.5,
      };
    })
    .filter((candidate) => candidate.forward > 0)
    .sort((a, b) => a.score - b.score);
  return candidates[0]?.id ?? null;
}

export function getDockGuidance<Id extends string>(options: {
  object: ProofObjectState<Id>;
  config: ProofObjectConfig<Id>;
  slots: readonly DockingSlotConfig<Id>[];
  objects: Record<Id, ProofObjectState<Id>>;
}) {
  const candidate = rankDockCandidates(
    options.object,
    options.config,
    options.slots,
    options.objects,
  )[0];
  if (!candidate) {
    return { progress: 0, message: "No matching docking place is configured." };
  }
  const progress = clamp(
    1 - candidate.distance / Math.max(options.config.snapTolerance * 3, 1),
    0,
    1,
  );
  const messages: Record<ValidationResult["reason"], string> = {
    valid: "Perfect match. Release to attach!",
    orientation: "You are close. Rotate until the corners line up.",
    distance: progress > 0.45 ? "Getting warmer—keep moving toward the glow." : "Follow the glow to the matching outline.",
    incompatible: "Choose the outline with the same number or color.",
    occupied: "That place is filled. Try the next empty outline.",
  };
  return { progress, message: messages[candidate.validation.reason], candidate };
}

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
