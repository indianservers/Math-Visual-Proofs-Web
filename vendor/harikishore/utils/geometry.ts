export interface Point {
  x: number;
  y: number;
}

export interface LineSegment {
  p1: Point;
  p2: Point;
  angleDeg: number;
  label?: string;
  type: 'vertex-to-vertex' | 'edge-to-edge' | 'vertex-to-edge';
}

/**
 * Generates regular polygon vertices centered at (cx, cy)
 */
export function getRegularPolygonVertices(
  sides: number,
  radius: number,
  cx: number = 0,
  cy: number = 0,
  startAngleDeg: number = -90 // -90 deg makes top vertex point straight up
): Point[] {
  const vertices: Point[] = [];
  const startRad = (startAngleDeg * Math.PI) / 180;
  const angleStep = (2 * Math.PI) / sides;

  for (let i = 0; i < sides; i++) {
    const theta = startRad + i * angleStep;
    vertices.push({
      x: cx + radius * Math.cos(theta),
      y: cy + radius * Math.sin(theta),
    });
  }
  return vertices;
}

/**
 * Generates rectangle vertices centered at (cx, cy)
 */
export function getRectangleVertices(
  width: number,
  height: number,
  cx: number = 0,
  cy: number = 0
): Point[] {
  const halfW = width / 2;
  const halfH = height / 2;
  return [
    { x: cx - halfW, y: cy - halfH },
    { x: cx + halfW, y: cy - halfH },
    { x: cx + halfW, y: cy + halfH },
    { x: cx - halfW, y: cy + halfH },
  ];
}

/**
 * Calculates mirror symmetry lines for a shape
 */
export function getMirrorLines(
  sides: number,
  isRegular: boolean,
  radius: number,
  cx: number = 0,
  cy: number = 0,
  aspectRatio: number = 1.6
): LineSegment[] {
  const lines: LineSegment[] = [];
  const lineLength = radius * 1.55;

  if (!isRegular && sides === 4) {
    // Rectangle: 2 lines of symmetry (Vertical & Horizontal midlines)
    // Vertical line
    lines.push({
      p1: { x: cx, y: cy - lineLength },
      p2: { x: cx, y: cy + lineLength },
      angleDeg: 90,
      type: 'edge-to-edge',
      label: 'Vertical Axis',
    });
    // Horizontal line
    lines.push({
      p1: { x: cx - lineLength * aspectRatio, y: cy },
      p2: { x: cx + lineLength * aspectRatio, y: cy },
      angleDeg: 0,
      type: 'edge-to-edge',
      label: 'Horizontal Axis',
    });
    return lines;
  }

  // Regular n-gon
  const startAngle = -90;
  const angleStep = 360 / sides;

  if (sides % 2 === 1) {
    // Odd n: lines go from each vertex through opposite edge midpoint (n lines)
    for (let i = 0; i < sides; i++) {
      const angleDeg = startAngle + i * angleStep;
      const rad = (angleDeg * Math.PI) / 180;
      lines.push({
        p1: { x: cx - lineLength * Math.cos(rad), y: cy - lineLength * Math.sin(rad) },
        p2: { x: cx + lineLength * Math.cos(rad), y: cy + lineLength * Math.sin(rad) },
        angleDeg: (angleDeg + 360) % 360,
        type: 'vertex-to-edge',
        label: `Mirror Axis ${i + 1}`,
      });
    }
  } else {
    // Even n: n/2 lines connect opposite vertices, n/2 lines connect opposite edge midpoints
    // 1. Vertex-to-vertex lines (n/2 lines)
    const halfN = sides / 2;
    for (let i = 0; i < halfN; i++) {
      const angleDeg = startAngle + i * angleStep;
      const rad = (angleDeg * Math.PI) / 180;
      lines.push({
        p1: { x: cx - lineLength * Math.cos(rad), y: cy - lineLength * Math.sin(rad) },
        p2: { x: cx + lineLength * Math.cos(rad), y: cy + lineLength * Math.sin(rad) },
        angleDeg: (angleDeg + 360) % 360,
        type: 'vertex-to-vertex',
        label: `Vertex Axis ${i + 1}`,
      });
    }
    // 2. Edge-midpoint to edge-midpoint lines (n/2 lines)
    const midOffset = angleStep / 2;
    for (let i = 0; i < halfN; i++) {
      const angleDeg = startAngle + midOffset + i * angleStep;
      const rad = (angleDeg * Math.PI) / 180;
      lines.push({
        p1: { x: cx - lineLength * Math.cos(rad), y: cy - lineLength * Math.sin(rad) },
        p2: { x: cx + lineLength * Math.cos(rad), y: cy + lineLength * Math.sin(rad) },
        angleDeg: (angleDeg + 360) % 360,
        type: 'edge-to-edge',
        label: `Midpoint Axis ${i + 1}`,
      });
    }
  }

  return lines;
}

/**
 * Converts array of vertices to SVG points string
 */
export function pointsToSvgPath(points: Point[]): string {
  if (points.length === 0) return '';
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ') + ' Z';
}

/**
 * Rotates a point (x, y) by angleDegrees around (cx, cy)
 */
export function rotatePoint(p: Point, angleDeg: number, cx: number = 0, cy: number = 0): Point {
  const rad = (angleDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const dx = p.x - cx;
  const dy = p.y - cy;
  return {
    x: cx + dx * cos - dy * sin,
    y: cy + dx * sin + dy * cos,
  };
}

/**
 * Reflects a point (x, y) across a line passing through (cx, cy) at angleDeg
 */
export function reflectPoint(p: Point, lineAngleDeg: number, cx: number = 0, cy: number = 0): Point {
  const rad = (lineAngleDeg * Math.PI) / 180;
  // Translate to origin
  const dx = p.x - cx;
  const dy = p.y - cy;
  // Rotate by -lineAngleDeg to make line lie on x-axis
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const rx = dx * cos + dy * sin;
  const ry = -dx * sin + dy * cos;
  // Reflect across x-axis (invert y)
  const refY = -ry;
  // Rotate back by +lineAngleDeg and translate back
  return {
    x: cx + rx * cos - refY * sin,
    y: cy + rx * sin + refY * cos,
  };
}

/**
 * Check if the given rotation angle (deg) matches a rotational symmetry angle
 */
export function checkRotationalMatch(
  currentAngleDeg: number,
  order: number,
  toleranceDeg: number = 4
): { isMatch: boolean; matchedStep: number; exactAngle: number } {
  const normalized = ((currentAngleDeg % 360) + 360) % 360;
  const stepAngle = 360 / order;

  for (let step = 0; step <= order; step++) {
    const targetAngle = step * stepAngle;
    let diff = Math.abs(normalized - (targetAngle % 360));
    if (diff > 180) diff = 360 - diff;

    if (diff <= toleranceDeg) {
      return {
        isMatch: true,
        matchedStep: (step % order) + 1,
        exactAngle: targetAngle % 360,
      };
    }
  }

  return { isMatch: false, matchedStep: 0, exactAngle: 0 };
}
