"use client";

import { useState } from "react";
import { Circle, Play, Ruler } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, Toggle, ToolButton, svgPoint, useRafAnimation } from "../../../components/phase-one/PhaseOneVisualProof";
import s from "../../../components/phase-one/PhaseThreeProof.module.css";
import { formatNumber } from "../../../lib/phaseTwoMath";
import { triangleMeasurements, type Vec2 } from "../../../lib/phaseThreeMath";
import { proofConfig } from "./proof.config";

const initialAngles = [-Math.PI / 2, 2.55, .45];
const center = { x: 340, y: 235 }, pixels = 185;
const colors = ["#5b35e3", "#e94e50", "#05a568"];
const degrees = (radians: number) => radians * 180 / Math.PI;
const circularGap = (a: number, b: number) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b)));

export default function Proof() {
  const [angles, setAngles] = useState(initialAngles), [radius, setRadius] = useState(5);
  const [circleVisible, setCircleVisible] = useState(true), [radiiVisible, setRadiiVisible] = useState(false);
  const [sidesVisible, setSidesVisible] = useState(true), [anglesVisible, setAnglesVisible] = useState(true), [ratiosVisible, setRatiosVisible] = useState(true);
  const [drag, setDrag] = useState<number | null>(null), [stage, setStage] = useState(0);
  const [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setStage(Math.min(4, Math.floor(progress * 5))));
  const vertices = angles.map((angle) => ({ x: center.x + pixels * Math.cos(angle), y: center.y + pixels * Math.sin(angle) }));
  const unit = vertices.map((p) => ({ x: (p.x - center.x) / pixels, y: (p.y - center.y) / pixels }));
  const measured = triangleMeasurements(unit[0], unit[1], unit[2], radius);
  const sides = measured.sides.map((value) => value * radius), ratios = measured.ratios.map((value) => value * radius);
  const centroid = vertices.reduce((sum, p) => ({ x: sum.x + p.x / 3, y: sum.y + p.y / 3 }), { x: 0, y: 0 });
  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    if (drag === null) return;
    const p = svgPoint(event, { width: 680, height: 480 });
    const angle = Math.atan2(p.y - center.y, p.x - center.x);
    setAngles((current) => current.every((other, i) => i === drag || circularGap(other, angle) > .2) ? current.map((old, i) => i === drag ? angle : old) : current);
  };
  const reset = () => { animation.stop(); setAngles(initialAngles); setRadius(5); setCircleVisible(true); setRadiiVisible(false); setSidesVisible(true); setAnglesVisible(true); setRatiosVisible(true); setStage(0); setAnswer(""); setFeedback("idle"); };
  const edge = (i: number): [Vec2, Vec2] => [vertices[(i + 1) % 3], vertices[(i + 2) % 3]];

  return <PhaseOneVisualProof meta={proofConfig} activeStep={stage > 2 ? 2 : stage > 0 ? 1 : 0}
    steps={[{ title: "Inscribe a triangle", body: "A, B, and C lie on one circle of radius R. Drag any vertex around its circumference." }, { title: "Read each chord", body: "The side opposite angle A is a chord, giving a = 2R sin A; likewise for b and c." }, { title: "Divide by each sine", body: "All three ratios equal the same diameter 2R, even when the triangle changes shape." }]}
    tools={<><ToolButton title="Animate proof" subtitle="Highlight each side-to-sine relation" onClick={() => animation.playing ? animation.stop() : (setStage(0), animation.start(5200))} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Show circumcircle" subtitle="Reveal the circle through A, B, C" onClick={() => setCircleVisible(!circleVisible)} active={circleVisible} icon={<Circle size={18} />} /><ToolButton title="Show radii" subtitle="Draw OA, OB, and OC" onClick={() => setRadiiVisible(!radiiVisible)} active={radiiVisible} icon={<Ruler size={18} />} /><ToolButton title="Show equal ratios" subtitle="Compare each side with its opposite sine" onClick={() => setRatiosVisible(!ratiosVisible)} active={ratiosVisible} /><ResetTool onClick={reset} /></>}
    result={<><h2>a/sin A = b/sin B = c/sin C = 2R</h2><p>Each live ratio is {formatNumber(2 * radius, 3)}; the triangle can change while the diameter stays fixed.</p></>}
    challenge={<><p>If A = 30° and R = 5, what is side a = 2R sin A?</p><div className={s.answer}><input type="number" aria-label="Sine rule challenge answer" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} /><button onClick={() => setFeedback(Number(answer) === 5 ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.visual}><div className={s.three}><div className={s.card}><h2>Explore the triangle</h2><MathRange label="Radius R" value={radius} min={2} max={10} step={.1} display={formatNumber(radius, 1)} onChange={setRadius} /><p className={s.small}>Drag A, B, or C on the circle.</p><Toggle label="Show side labels" checked={sidesVisible} onChange={setSidesVisible} /><Toggle label="Show angle labels" checked={anglesVisible} onChange={setAnglesVisible} /><Toggle label="Show circumcircle" checked={circleVisible} onChange={setCircleVisible} /><Toggle label="Show radii" checked={radiiVisible} onChange={setRadiiVisible} /></div>
      <div className={s.plot}><svg className="phaseOneCanvas" viewBox="0 0 680 480" role="img" aria-label="Draggable triangle inscribed in a circumcircle" onPointerMove={onMove} onPointerUp={() => setDrag(null)}><rect width="680" height="480" fill="#fbfcff" />{circleVisible && <circle cx={center.x} cy={center.y} r={pixels} fill="#f7f5ff" stroke="#6c49e9" strokeWidth="2" />}{radiiVisible && vertices.map((p, i) => <line key={i} x1={center.x} y1={center.y} x2={p.x} y2={p.y} stroke="#a6a5c9" strokeDasharray="5 5" />)}<circle cx={center.x} cy={center.y} r="4" fill="#26336a" /><text x={center.x + 8} y={center.y + 17} className={s.svgLabel}>O</text>{[0, 1, 2].map((i) => { const [p, q] = edge(i); const middle = { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; const outward = { x: middle.x - centroid.x, y: middle.y - centroid.y }; const norm = Math.hypot(outward.x, outward.y) || 1; return <g key={i}><line x1={p.x} y1={p.y} x2={q.x} y2={q.y} stroke={colors[i]} strokeWidth={stage === i + 1 ? 6 : 3} />{sidesVisible && <text x={middle.x + outward.x / norm * 18} y={middle.y + outward.y / norm * 18} fill={colors[i]} fontSize="20" fontFamily="Georgia" fontStyle="italic" textAnchor="middle">{"abc"[i]}</text>}</g>; })}{vertices.map((p, i) => { const inward = { x: centroid.x - p.x, y: centroid.y - p.y }; const norm = Math.hypot(inward.x, inward.y) || 1; return <g key={i}><circle cx={p.x} cy={p.y} r="10" fill={colors[i]} className={s.handle} tabIndex={0} role="slider" aria-label={`Vertex ${"ABC"[i]} around circumcircle`} aria-valuemin={0} aria-valuemax={359} aria-valuenow={Math.round((angles[i] * 180 / Math.PI + 360) % 360)} onKeyDown={(event) => { const step = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0; if (step) { event.preventDefault(); setAngles((current) => { const next = current[i] + step * Math.PI / 36; return current.every((other, j) => j === i || circularGap(other, next) > .2) ? current.map((value, j) => j === i ? next : value) : current; }); } }} onPointerDown={(event) => { setDrag(i); event.currentTarget.setPointerCapture(event.pointerId); }} /><text x={p.x - inward.x / norm * 22} y={p.y - inward.y / norm * 22 + 5} fontSize="20" fontFamily="Georgia" textAnchor="middle">{"ABC"[i]}</text>{anglesVisible && <text x={p.x + inward.x / norm * 43} y={p.y + inward.y / norm * 43 + 5} fill={colors[i]} fontSize="15" textAnchor="middle">{formatNumber(degrees(measured.angles[i]), 1)}°</text>}</g>; })}</svg></div>
      <div className={s.card}><h2>Live values</h2>{[0, 1, 2].map((i) => <p key={i} style={{ color: colors[i] }}><b>{"abc"[i]}</b> = {formatNumber(sides[i], 2)}<br />{"ABC"[i]} = {formatNumber(degrees(measured.angles[i]), 1)}°</p>)}<p><b>R</b> = {formatNumber(radius, 2)}</p>{ratiosVisible && <><h3>Equal ratios</h3>{ratios.map((value, i) => <p key={i} style={{ color: colors[i] }}>{"abc"[i]}/sin {"ABC"[i]} = {formatNumber(value, 3)}</p>)}<p>2R = {formatNumber(2 * radius, 3)}</p></>}</div></div><div className={`${s.card} ${s.highlight}`}><p className={s.formula}>{stage > 0 && stage < 4 ? `${"abc"[stage - 1]} = 2R sin ${"ABC"[stage - 1]}` : "a = 2R sin A,  b = 2R sin B,  c = 2R sin C"}</p></div></div>
  </PhaseOneVisualProof>;
}
