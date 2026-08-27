import type { Point } from "../lib/geometry";
import type { Transform3D, Vector3 } from "./types";

export type Camera3D = {
  projection: "orthographic" | "perspective";
  focalLength?: number;
  center: Point;
};

export function rotateVector3(point: Vector3, transform: Transform3D): Vector3 {
  const rx = (transform.rotationX * Math.PI) / 180;
  const ry = (transform.rotationY * Math.PI) / 180;
  const rz = (transform.rotationZ * Math.PI) / 180;
  const scaled = {
    x: point.x * transform.scale,
    y: point.y * transform.scale,
    z: point.z * transform.scale,
  };
  const aroundX = {
    x: scaled.x,
    y: scaled.y * Math.cos(rx) - scaled.z * Math.sin(rx),
    z: scaled.y * Math.sin(rx) + scaled.z * Math.cos(rx),
  };
  const aroundY = {
    x: aroundX.x * Math.cos(ry) + aroundX.z * Math.sin(ry),
    y: aroundX.y,
    z: -aroundX.x * Math.sin(ry) + aroundX.z * Math.cos(ry),
  };
  return {
    x: aroundY.x * Math.cos(rz) - aroundY.y * Math.sin(rz) + transform.x,
    y: aroundY.x * Math.sin(rz) + aroundY.y * Math.cos(rz) + transform.y,
    z: aroundY.z + transform.z,
  };
}

export function projectVector3(point: Vector3, camera: Camera3D): Point {
  if (camera.projection === "orthographic") {
    return { x: camera.center.x + point.x, y: camera.center.y + point.y };
  }
  const focalLength = camera.focalLength ?? 500;
  const denominator = Math.max(1, focalLength + point.z);
  const factor = focalLength / denominator;
  return {
    x: camera.center.x + point.x * factor,
    y: camera.center.y + point.y * factor,
  };
}

export function projectPolyhedron(
  vertices: readonly Vector3[],
  faces: readonly number[][],
  transform: Transform3D,
  camera: Camera3D,
) {
  const transformed = vertices.map((vertex) =>
    rotateVector3(vertex, transform),
  );
  const projected = transformed.map((vertex) => projectVector3(vertex, camera));
  return faces
    .map((face, index) => ({
      index,
      points: face.map((vertexIndex) => projected[vertexIndex]),
      depth:
        face.reduce((sum, vertexIndex) => sum + transformed[vertexIndex].z, 0) /
        face.length,
    }))
    .sort((a, b) => b.depth - a.depth);
}

export const PRIMITIVE_SOLIDS = {
  cube(size = 100) {
    const half = size / 2;
    const vertices: Vector3[] = [
      { x: -half, y: -half, z: -half },
      { x: half, y: -half, z: -half },
      { x: half, y: half, z: -half },
      { x: -half, y: half, z: -half },
      { x: -half, y: -half, z: half },
      { x: half, y: -half, z: half },
      { x: half, y: half, z: half },
      { x: -half, y: half, z: half },
    ];
    return {
      vertices,
      faces: [
        [0, 1, 2, 3],
        [4, 7, 6, 5],
        [0, 4, 5, 1],
        [1, 5, 6, 2],
        [2, 6, 7, 3],
        [4, 0, 3, 7],
      ],
    };
  },
  pyramid(width = 100, height = 120) {
    const half = width / 2;
    return {
      vertices: [
        { x: -half, y: half, z: -half },
        { x: half, y: half, z: -half },
        { x: half, y: half, z: half },
        { x: -half, y: half, z: half },
        { x: 0, y: -height / 2, z: 0 },
      ],
      faces: [
        [0, 3, 2, 1],
        [0, 1, 4],
        [1, 2, 4],
        [2, 3, 4],
        [3, 0, 4],
      ],
    };
  },
} as const;
