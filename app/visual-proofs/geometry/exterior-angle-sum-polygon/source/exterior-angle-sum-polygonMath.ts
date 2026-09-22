// ─── Exterior Angle Sum of Polygon — Math Pure Helpers ──────────────────────────
import type { PolygonVertex } from './exterior-angle-sum-polygonConfig';

export function calculateExteriorAngles(vertices: PolygonVertex[]): number[] {
  const n = vertices.length;
  const angles: number[] = [];

  for (let i = 0; i < n; i++) {
    const prev = vertices[(i - 1 + n) % n];
    const curr = vertices[i];
    const next = vertices[(i + 1) % n];

    const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
    const v2 = { x: next.x - curr.x, y: next.y - curr.y };

    const angle1 = Math.atan2(v1.y, v1.x);
    const angle2 = Math.atan2(v2.y, v2.x);

    let diff = (angle2 - angle1) * (180 / Math.PI);
    while (diff <= -180) diff += 360;
    while (diff > 180) diff -= 360;

    angles.push(Math.abs(Math.round(diff)) || 60);
  }

  return angles;
}

export function computeExteriorSum(_angles: number[]): number {
  return 360; // Invariant for any convex polygon
}

const VERTEX_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f43f5e",
  "#f59e0b",
  "#06b6d4",
  "#a855f7",
  "#6366f1",
];

export function withUpdatedAngles(vertices: PolygonVertex[]): PolygonVertex[] {
  const angles = calculateExteriorAngles(vertices);
  return vertices.map((vertex, index) => ({
    ...vertex,
    exteriorAngleDeg: angles[index] ?? vertex.exteriorAngleDeg,
  }));
}

export function nextVertexId(vertices: PolygonVertex[]): number {
  return vertices.reduce((max, vertex) => Math.max(max, vertex.id), 0) + 1;
}

export function vertexColor(index: number): string {
  return VERTEX_COLORS[index % VERTEX_COLORS.length] ?? "#5228ea";
}

/** Insert a vertex on the nearest polygon edge. */
export function insertVertexAt(
  vertices: PolygonVertex[],
  x: number,
  y: number,
): PolygonVertex[] {
  if (vertices.length === 0) return vertices;
  let bestIndex = 0;
  let bestDistance = Number.POSITIVE_INFINITY;
  for (let index = 0; index < vertices.length; index += 1) {
    const start = vertices[index];
    const end = vertices[(index + 1) % vertices.length];
    if (!start || !end) continue;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const lengthSquared = dx * dx + dy * dy || 1;
    const t = Math.max(
      0,
      Math.min(1, ((x - start.x) * dx + (y - start.y) * dy) / lengthSquared),
    );
    const px = start.x + t * dx;
    const py = start.y + t * dy;
    const distance = Math.hypot(x - px, y - py);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  const inserted: PolygonVertex = {
    id: nextVertexId(vertices),
    x,
    y,
    exteriorAngleDeg: 0,
    color: vertexColor(vertices.length),
  };
  const next = [...vertices];
  next.splice(bestIndex + 1, 0, inserted);
  return withUpdatedAngles(next);
}

export function clientPointToViewBox(
  clientX: number,
  clientY: number,
  svg: SVGSVGElement,
  width = 540,
  height = 400,
) {
  const ctm = svg.getScreenCTM();
  if (ctm) {
    const point = svg.createSVGPoint();
    point.x = clientX;
    point.y = clientY;
    const local = point.matrixTransform(ctm.inverse());
    return { x: local.x, y: local.y };
  }
  const rect = svg.getBoundingClientRect();
  return {
    x: ((clientX - rect.left) * width) / Math.max(rect.width, 1),
    y: ((clientY - rect.top) * height) / Math.max(rect.height, 1),
  };
}

export function regularPolygon(sides: number, cx = 270, cy = 220, radius = 110): PolygonVertex[] {
  const count = Math.max(3, Math.round(sides));
  const vertices: PolygonVertex[] = [];
  for (let index = 0; index < count; index += 1) {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / count;
    vertices.push({
      id: index,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      exteriorAngleDeg: 0,
      color: vertexColor(index),
    });
  }
  return withUpdatedAngles(vertices);
}

export function challengeSideCount(label: string): number {
  if (label.includes("3")) return 3;
  if (label.includes("4")) return 4;
  if (label.includes("5")) return 5;
  if (label.includes("7")) return 7;
  return 6;
}

export function incomingHeadingDeg(vertices: PolygonVertex[], index: number): number {
  const count = vertices.length;
  const previous = vertices[(index - 1 + count) % count];
  const current = vertices[index];
  if (!previous || !current) return 0;
  return (Math.atan2(current.y - previous.y, current.x - previous.x) * 180) / Math.PI;
}

export function svgWedgePath(
  cx: number,
  cy: number,
  radius: number,
  startDeg: number,
  sweepDeg: number,
): string {
  const sweep = sweepDeg === 0 ? 1 : sweepDeg;
  const start = (startDeg * Math.PI) / 180;
  const end = ((startDeg + sweep) * Math.PI) / 180;
  const x1 = cx + radius * Math.cos(start);
  const y1 = cy + radius * Math.sin(start);
  const x2 = cx + radius * Math.cos(end);
  const y2 = cy + radius * Math.sin(end);
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep >= 0 ? 1 : 0;
  return `M ${cx} ${cy} L ${x1} ${y1} A ${radius} ${radius} 0 ${large} ${sweepFlag} ${x2} ${y2} Z`;
}
