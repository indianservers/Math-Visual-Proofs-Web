"use client";

import clsx, { type ClassValue } from "clsx";
import { PointerEvent, useCallback, useRef, useState } from "react";
import { distance, type Point } from "../lib/geometry";

export type CanvasPoint = Point;

export type CanvasEngineOptions<T extends string> = {
  disabled?: boolean;
  movementThreshold?: number;
  onDragStart?: (target: T, point: CanvasPoint) => void;
  onDragEnd?: (target: T, point: CanvasPoint | null, moved: boolean) => void;
  onDragCancel?: (target: T) => void;
};

export function withinSnapZone(
  point: CanvasPoint,
  target: CanvasPoint,
  radius: number,
) {
  return distance(point, target) <= radius;
}

export function nearestSnap(value: number, targets: number[], radius: number) {
  if (targets.length === 0) return value;
  const nearest = targets.reduce((best, target) =>
    Math.abs(target - value) < Math.abs(best - value) ? target : best,
  );
  return Math.abs(nearest - value) <= radius ? nearest : value;
}

export function clientToCanvasPoint(
  clientX: number,
  clientY: number,
  svg: SVGSVGElement,
  width: number,
  height: number,
): CanvasPoint {
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) * width) / rect.width,
    y: ((clientY - rect.top) * height) / rect.height,
  };
}

/**
 * Shared interaction engine for every visual-proof SVG scene.
 * Scenes own unique geometry and mathematics; this owns the drag lifecycle.
 */
export function useProofCanvas<T extends string>(
  width: number,
  height: number,
  onDrag: (target: T, point: CanvasPoint) => void,
  onDrop?: (target: T) => void,
  options: CanvasEngineOptions<T> = {},
) {
  const [dragTarget, setDragTarget] = useState<T | null>(null);
  const startPoint = useRef<CanvasPoint | null>(null);
  const lastPoint = useRef<CanvasPoint | null>(null);
  const moved = useRef(false);
  const finishing = useRef(false);
  const movementThreshold = options.movementThreshold ?? 3;

  const pointFromCanvasEvent = useCallback(
    (event: PointerEvent<SVGSVGElement>) =>
      clientToCanvasPoint(
        event.clientX,
        event.clientY,
        event.currentTarget,
        width,
        height,
      ),
    [height, width],
  );

  const beginDrag = (target: T, event: PointerEvent<SVGElement>) => {
    if (options.disabled) return;
    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    const svg = event.currentTarget.ownerSVGElement;
    const point = svg
      ? clientToCanvasPoint(event.clientX, event.clientY, svg, width, height)
      : null;
    startPoint.current = point;
    lastPoint.current = point;
    moved.current = false;
    finishing.current = false;
    setDragTarget(target);
    if (point) options.onDragStart?.(target, point);
  };

  const finishDrag = (cancelled = false) => {
    if (!dragTarget || finishing.current) return;
    finishing.current = true;
    const target = dragTarget;
    if (cancelled) options.onDragCancel?.(target);
    else {
      onDrop?.(target);
      options.onDragEnd?.(target, lastPoint.current, moved.current);
    }
    startPoint.current = null;
    lastPoint.current = null;
    moved.current = false;
    setDragTarget(null);
  };

  return {
    beginDrag,
    cancelDrag: () => finishDrag(true),
    dragging: dragTarget !== null,
    dragTarget,
    canvasClassName: (...classNames: ClassValue[]) =>
      clsx(classNames, { "is-dragging": dragTarget !== null }),
    canvasProps: {
      onPointerMove: (event: PointerEvent<SVGSVGElement>) => {
        if (!dragTarget) return;
        const point = pointFromCanvasEvent(event);
        lastPoint.current = point;
        if (
          startPoint.current &&
          distance(startPoint.current, point) >= movementThreshold
        )
          moved.current = true;
        onDrag(dragTarget, point);
      },
      onPointerUp: () => finishDrag(false),
      onPointerCancel: () => finishDrag(true),
      onLostPointerCapture: () => finishDrag(false),
      onPointerLeave: (event: PointerEvent<SVGSVGElement>) => {
        if (event.buttons === 0) finishDrag(false);
      },
    },
  };
}

/** Bounded undo/redo history for object transforms or whole proof scenes. */
export function useCanvasHistory<T>(initialState: T, limit = 50) {
  const [past, setPast] = useState<T[]>([]);
  const [present, setPresent] = useState(initialState);
  const [future, setFuture] = useState<T[]>([]);

  const commit = useCallback(
    (next: T | ((current: T) => T)) => {
      setPresent((current) => {
        const value =
          typeof next === "function"
            ? (next as (current: T) => T)(current)
            : next;
        if (Object.is(value, current)) return current;
        setPast((items) => [...items, current].slice(-limit));
        setFuture([]);
        return value;
      });
    },
    [limit],
  );

  const undo = useCallback(() => {
    setPast((items) => {
      if (items.length === 0) return items;
      const previous = items.at(-1) as T;
      setPresent((current) => {
        setFuture((next) => [current, ...next].slice(0, limit));
        return previous;
      });
      return items.slice(0, -1);
    });
  }, [limit]);

  const redo = useCallback(() => {
    setFuture((items) => {
      if (items.length === 0) return items;
      const next = items[0];
      setPresent((current) => {
        setPast((previous) => [...previous, current].slice(-limit));
        return next;
      });
      return items.slice(1);
    });
  }, [limit]);

  const reset = useCallback(
    (next: T = initialState) => {
      setPast([]);
      setPresent(next);
      setFuture([]);
    },
    [initialState],
  );

  return {
    state: present,
    commit,
    undo,
    redo,
    reset,
    canUndo: past.length > 0,
    canRedo: future.length > 0,
  };
}
