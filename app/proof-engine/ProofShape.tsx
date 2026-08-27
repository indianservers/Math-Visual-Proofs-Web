import clsx from "clsx";
import type {
  KeyboardEventHandler,
  PointerEventHandler,
  ReactNode,
} from "react";
import { pointsToSvg } from "../lib/geometry";
import { projectPolyhedron, type Camera3D } from "./geometry3d";
import type {
  ProofObjectAppearance,
  ShapeGeometry,
  Transform,
  Transform3D,
} from "./types";

type SharedProps = {
  geometry: ShapeGeometry;
  appearance?: ProofObjectAppearance;
  className?: string;
  label?: ReactNode;
  accessibleLabel?: string;
  selected?: boolean;
  disabled?: boolean;
  onPointerDown?: PointerEventHandler<SVGGElement>;
  onKeyDown?: KeyboardEventHandler<SVGGElement>;
};

type ProofShapeProps = SharedProps & {
  transform: Transform;
  transform3D?: Transform3D;
  camera?: Camera3D;
};

function arcPath(radius: number, startAngle: number, endAngle: number) {
  const start = (startAngle * Math.PI) / 180;
  const end = (endAngle * Math.PI) / 180;
  const startPoint = {
    x: radius * Math.cos(start),
    y: radius * Math.sin(start),
  };
  const endPoint = { x: radius * Math.cos(end), y: radius * Math.sin(end) };
  const span = Math.abs(endAngle - startAngle);
  return `M ${startPoint.x} ${startPoint.y} A ${radius} ${radius} 0 ${span > 180 ? 1 : 0} ${endAngle > startAngle ? 1 : 0} ${endPoint.x} ${endPoint.y}`;
}

/**
 * Config-driven SVG renderer shared by authored proofs. Complex theorem-specific
 * annotations can remain custom children while the base geometry stays reusable.
 */
export function ProofShape({
  geometry,
  transform,
  transform3D,
  camera,
  appearance = {},
  className,
  label,
  accessibleLabel,
  selected,
  disabled,
  onPointerDown,
  onKeyDown,
}: ProofShapeProps) {
  const style = {
    fill: appearance.fill ?? "none",
    stroke: appearance.stroke ?? "currentColor",
    strokeWidth: appearance.strokeWidth ?? 1.5,
    opacity: appearance.opacity ?? 1,
  };
  const interactive = Boolean(onPointerDown) && !disabled;
  const common = {
    style,
    vectorEffect: "non-scaling-stroke" as const,
  };
  let shape: ReactNode;
  if (geometry.kind === "polygon") {
    shape = <polygon points={pointsToSvg(geometry.points)} {...common} />;
  } else if (geometry.kind === "rectangle") {
    shape = (
      <rect
        width={geometry.width}
        height={geometry.height}
        rx={geometry.radius}
        {...common}
      />
    );
  } else if (geometry.kind === "circle") {
    shape = <circle r={geometry.radius} {...common} />;
  } else if (geometry.kind === "ellipse") {
    shape = <ellipse rx={geometry.radiusX} ry={geometry.radiusY} {...common} />;
  } else if (geometry.kind === "segment") {
    shape = (
      <line x1="0" y1="0" x2={geometry.end.x} y2={geometry.end.y} {...common} />
    );
  } else if (geometry.kind === "arc") {
    shape = (
      <path
        d={arcPath(geometry.radius, geometry.startAngle, geometry.endAngle)}
        {...common}
      />
    );
  } else {
    const solidTransform = transform3D ?? {
      x: 0,
      y: 0,
      z: 0,
      rotationX: 0,
      rotationY: 0,
      rotationZ: 0,
      scale: 1,
    };
    const solidCamera = camera ?? {
      projection: geometry.projection ?? "orthographic",
      center: { x: 0, y: 0 },
    };
    shape = projectPolyhedron(
      geometry.vertices,
      geometry.faces,
      solidTransform,
      solidCamera,
    ).map((face) => (
      <polygon
        key={face.index}
        points={pointsToSvg(face.points)}
        {...common}
        opacity={(appearance.opacity ?? 1) * (0.58 + (face.index % 3) * 0.16)}
      />
    ));
  }

  return (
    <g
      transform={`translate(${transform.x} ${transform.y}) rotate(${transform.rotation})`}
      className={clsx(
        "proof-shape",
        appearance.className,
        className,
        selected && "selected",
        disabled && "disabled",
      )}
      onPointerDown={interactive ? onPointerDown : undefined}
      onKeyDown={interactive ? onKeyDown : undefined}
      tabIndex={interactive ? 0 : undefined}
      role={interactive ? "button" : "img"}
      aria-label={accessibleLabel}
      aria-disabled={disabled || undefined}
    >
      {shape}
      {label}
    </g>
  );
}
