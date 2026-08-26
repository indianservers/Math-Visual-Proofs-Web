"use client";

import { PointerEvent, useState } from "react";

type CanvasPoint = { x: number; y: number };

export function withinSnapZone(
  point: CanvasPoint,
  target: CanvasPoint,
  radius: number,
) {
  return Math.hypot(point.x - target.x, point.y - target.y) <= radius;
}

export function nearestSnap(value: number, targets: number[], radius: number) {
  const nearest = targets.reduce((best, target) =>
    Math.abs(target - value) < Math.abs(best - value) ? target : best,
  );
  return Math.abs(nearest - value) <= radius ? nearest : value;
}

/** Shared pointer engine for every visual-proof SVG scene. */
export function useProofCanvas<T extends string>(
  width: number,
  height: number,
  onDrag: (target: T, point: CanvasPoint) => void,
  onDrop?: (target: T) => void,
) {
  const [dragTarget, setDragTarget] = useState<T | null>(null);
  const localPoint = (event: PointerEvent<SVGSVGElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) * width) / rect.width,
      y: ((event.clientY - rect.top) * height) / rect.height,
    };
  };
  const beginDrag = (target: T, event: PointerEvent<SVGElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragTarget(target);
  };
  const endDrag = () => {
    if (dragTarget && onDrop) onDrop(dragTarget);
    setDragTarget(null);
  };
  return {
    beginDrag,
    dragging: dragTarget !== null,
    dragTarget,
    canvasProps: {
      onPointerMove: (event: PointerEvent<SVGSVGElement>) => {
        if (dragTarget) onDrag(dragTarget, localPoint(event));
      },
      onPointerUp: endDrag,
      onPointerCancel: endDrag,
      onPointerLeave: (event: PointerEvent<SVGSVGElement>) => {
        if (event.buttons === 0) endDrag();
      },
    },
  };
}
