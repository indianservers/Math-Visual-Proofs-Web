import type { ReactNode } from "react";

export type Plot = { xMin: number; xMax: number; yMin: number; yMax: number; width?: number; height?: number; pad?: number };

export function plotPoint(plot: Plot, x: number, y: number) {
  const width = plot.width ?? 680, height = plot.height ?? 390, pad = plot.pad ?? 38;
  return { x: pad + (x - plot.xMin) / (plot.xMax - plot.xMin) * (width - 2 * pad), y: height - pad - (y - plot.yMin) / (plot.yMax - plot.yMin) * (height - 2 * pad) };
}

export function plotCurve(plot: Plot, fn: (x: number) => number, samples = 320) {
  let path = "", drawing = false;
  for (let i = 0; i <= samples; i++) {
    const x = plot.xMin + (plot.xMax - plot.xMin) * i / samples;
    const y = fn(x);
    if (!Number.isFinite(y) || y < plot.yMin - (plot.yMax - plot.yMin) || y > plot.yMax + (plot.yMax - plot.yMin)) { drawing = false; continue; }
    const p = plotPoint(plot, x, y);
    path += `${drawing ? "L" : "M"}${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    drawing = true;
  }
  return path;
}

export function PlotFrame({ plot, children, ariaLabel, onPointerMove, onPointerUp }: { plot: Plot; children: ReactNode; ariaLabel: string; onPointerMove?: React.PointerEventHandler<SVGSVGElement>; onPointerUp?: React.PointerEventHandler<SVGSVGElement> }) {
  const width = plot.width ?? 680, height = plot.height ?? 390;
  const ticks = Array.from({ length: 9 }, (_, i) => i / 8);
  const axisX = plotPoint(plot, 0, 0).x, axisY = plotPoint(plot, 0, 0).y;
  return <svg className="phaseOneCanvas" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={ariaLabel} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
    <rect x="0" y="0" width={width} height={height} rx="14" fill="#fbfcff" />
    {ticks.map((t) => <g key={t}><line className="gridLine" x1={38 + t * (width - 76)} x2={38 + t * (width - 76)} y1="38" y2={height - 38} /><line className="gridLine" x1="38" x2={width - 38} y1={38 + t * (height - 76)} y2={38 + t * (height - 76)} /></g>)}
    {axisX >= 38 && axisX <= width - 38 && <line className="axis" x1={axisX} x2={axisX} y1="30" y2={height - 30} />}
    {axisY >= 38 && axisY <= height - 38 && <line className="axis" x1="30" x2={width - 30} y1={axisY} y2={axisY} />}
    <text x={width - 27} y={Math.min(height - 13, Math.max(23, axisY - 7))} fontSize="14">x</text>
    <text x={Math.min(width - 20, Math.max(42, axisX + 8))} y="25" fontSize="14">y</text>
    {children}
  </svg>;
}
