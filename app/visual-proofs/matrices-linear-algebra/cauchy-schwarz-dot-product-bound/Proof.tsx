"use client";

import { useState } from "react";
import { Move, Play, ScanSearch } from "lucide-react";
import { Feedback, PhaseOneVisualProof, ResetTool, Toggle, ToolButton, svgPoint, useRafAnimation } from "../../../components/phase-one/PhaseOneVisualProof";
import { PlotFrame, plotPoint, type Plot } from "../../../components/phase-one/PhaseTwoPlot";
import s from "../../../components/phase-one/PhaseThreeProof.module.css";
import { formatNumber } from "../../../lib/phaseTwoMath";
import { vectorMetrics, type Vec2 } from "../../../lib/phaseThreeMath";
import { proofConfig } from "./proof.config";

const initialU = { x: 1.6, y: 1.2 }, initialV = { x: 2.4, y: .8 };
const plot: Plot = { xMin: -3.5, xMax: 3.5, yMin: -3.5, yMax: 3.5, width: 480, height: 480 };
const origin = plotPoint(plot, 0, 0);

export default function Proof() {
  const [u, setU] = useState<Vec2>(initialU), [v, setV] = useState<Vec2>(initialV);
  const [projectionVisible, setProjectionVisible] = useState(true), [angleVisible, setAngleVisible] = useState(true), [magnitudesVisible, setMagnitudesVisible] = useState(true), [formulaVisible, setFormulaVisible] = useState(true);
  const [drag, setDrag] = useState<"u" | "v" | null>(null), [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => { const size = Math.hypot(v.x, v.y) || 2.5; const angle = progress * 2 * Math.PI; setV({ x: size * Math.cos(angle), y: size * Math.sin(angle) }); });
  const values = vectorMetrics(u, v);
  const pu = plotPoint(plot, u.x, u.y), pv = plotPoint(plot, v.x, v.y), pp = values.projection ? plotPoint(plot, values.projection.x, values.projection.y) : null;
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = svgPoint(event, { width: 480, height: 480 });
    const next = { x: Math.max(-3.4, Math.min(3.4, (p.x - 38) / 404 * 7 - 3.5)), y: Math.max(-3.4, Math.min(3.4, (480 - 38 - p.y) / 404 * 7 - 3.5)) };
    if (drag === "u") setU(next); else setV(next);
  };
  const reset = () => { animation.stop(); setU(initialU); setV(initialV); setProjectionVisible(true); setAngleVisible(true); setMagnitudesVisible(true); setFormulaVisible(true); setAnswer(""); setFeedback("idle"); };
  const coordinateInput = (vector: Vec2, setter: (value: Vec2) => void, label: string) => <div className={s.inputPair}><input type="number" step="0.1" min="-3.4" max="3.4" aria-label={`${label} x coordinate`} value={formatNumber(vector.x, 2)} onChange={(e) => setter({ ...vector, x: Math.max(-3.4, Math.min(3.4, Number(e.target.value))) })} /><input type="number" step="0.1" min="-3.4" max="3.4" aria-label={`${label} y coordinate`} value={formatNumber(vector.y, 2)} onChange={(e) => setter({ ...vector, y: Math.max(-3.4, Math.min(3.4, Number(e.target.value))) })} /></div>;
  const angleText = values.angle === null ? "undefined for a zero vector" : `${formatNumber(values.angle * 180 / Math.PI, 1)}°`;
  return <PhaseOneVisualProof meta={proofConfig} activeStep={values.equality ? 2 : projectionVisible ? 1 : 0}
    steps={[{ title: "Measure two vectors", body: "Drag their tips or type coordinates. Their dot product and lengths update together." }, { title: "Project one onto the other", body: "u·v = ||u|| ||v|| cos θ, and the projected length never exceeds ||u||." }, { title: "Recognize equality", body: "|cos θ| = 1 precisely for parallel or anti-parallel nonzero vectors; zero vectors also give equality." }]}
    tools={<><ToolButton title="Animate inequality" subtitle="Rotate v through parallel and opposite directions" onClick={() => animation.playing ? animation.stop() : animation.start(5200)} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Show projection" subtitle="Drop u onto the line of v" onClick={() => setProjectionVisible(!projectionVisible)} active={projectionVisible} icon={<ScanSearch size={18} />} /><ToolButton title="Show angle" subtitle="Display θ and cos θ" onClick={() => setAngleVisible(!angleVisible)} active={angleVisible} icon={<Move size={18} />} /><ToolButton title="Show dot-product formula" subtitle="Reveal the cosine argument" onClick={() => setFormulaVisible(!formulaVisible)} active={formulaVisible} /><ResetTool onClick={reset} /></>}
    result={<><h2>|u·v| ≤ ||u|| ||v||</h2><p>{formatNumber(Math.abs(values.product))} ≤ {formatNumber(values.bound)}{values.equality ? " — equality holds." : "."}</p></>}
    challenge={<><p>For u=(3,0) and v=(0,4), what is u·v?</p><div className={s.answer}><input type="number" aria-label="Dot product challenge answer" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} /><button onClick={() => setFeedback(answer !== "" && Number(answer) === 0 ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.visual}><div className={s.row}><div className={`${s.card} ${s.controls}`}><h2>Vectors in ℝ²</h2><label>u = (x,y){coordinateInput(u, setU, "u")}</label><label>v = (x,y){coordinateInput(v, setV, "v")}</label><Toggle label="Show projection" checked={projectionVisible} onChange={setProjectionVisible} /><Toggle label="Show angle" checked={angleVisible} onChange={setAngleVisible} /><Toggle label="Show magnitudes" checked={magnitudesVisible} onChange={setMagnitudesVisible} /><div className={s.metricGrid}><div className={s.metric}>u·v<b>{formatNumber(values.product)}</b></div><div className={s.metric}>θ<b>{angleText}</b></div></div></div>
      <div className={s.plot}><PlotFrame plot={plot} ariaLabel="Two draggable vectors and the projection of u onto v" onPointerMove={move} onPointerUp={() => setDrag(null)}><defs><marker id="cauchy-purple-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#5e35e8" /></marker><marker id="cauchy-teal-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="#008f8c" /></marker></defs>{projectionVisible && pp && <><line x1={pu.x} y1={pu.y} x2={pp.x} y2={pp.y} stroke="#ed951b" strokeDasharray="5 4" strokeWidth="2" /><line x1={origin.x} y1={origin.y} x2={pp.x} y2={pp.y} stroke="#ed951b" strokeWidth="3" /><circle cx={pp.x} cy={pp.y} r="5" fill="#ed951b" /></>}{angleVisible && values.angle !== null && <text x={origin.x + 28} y={origin.y - 16} fontSize="14" fill="#3f30ca">θ = {formatNumber(values.angle * 180 / Math.PI, 1)}°</text>}<line x1={origin.x} y1={origin.y} x2={pu.x} y2={pu.y} stroke="#5e35e8" strokeWidth="4" markerEnd="url(#cauchy-purple-arrow)" /><line x1={origin.x} y1={origin.y} x2={pv.x} y2={pv.y} stroke="#008f8c" strokeWidth="4" markerEnd="url(#cauchy-teal-arrow)" /><circle cx={pu.x} cy={pu.y} r="8" fill="#5e35e8" className={s.handle} onPointerDown={(e) => { setDrag("u"); e.currentTarget.setPointerCapture(e.pointerId); }} /><circle cx={pv.x} cy={pv.y} r="8" fill="#008f8c" className={s.handle} onPointerDown={(e) => { setDrag("v"); e.currentTarget.setPointerCapture(e.pointerId); }} /><text x={pu.x + 11} y={pu.y - 10} className={s.svgLabel}>u</text><text x={pv.x + 11} y={pv.y - 10} className={s.svgLabel}>v</text></PlotFrame></div>
      <div className={`${s.card} ${s.controls}`}><h2>Live comparison</h2>{magnitudesVisible && <><p>||u|| = {formatNumber(values.uLength)}</p><p>||v|| = {formatNumber(values.vLength)}</p></>}<p>u·v = {formatNumber(values.product)}</p><p>|u·v| = {formatNumber(Math.abs(values.product))}</p><p>||u||||v|| = {formatNumber(values.bound)}</p>{angleVisible && <p>cos θ = {values.cosine === null ? "undefined" : formatNumber(values.cosine)}</p>}{projectionVisible && <p>||projᵥ(u)|| = {values.projection ? formatNumber(Math.hypot(values.projection.x, values.projection.y)) : "undefined when v=0"}</p>}<div className={`${s.metric} ${values.equality ? s.highlight : ""}`}><b>{values.equality ? "Equality" : "Bound holds"}</b>{formatNumber(Math.abs(values.product))} ≤ {formatNumber(values.bound)}</div></div></div>{formulaVisible && <div className={`${s.card} ${s.highlight}`}><p className={s.formula}>u·v = ||u|| ||v|| cos θ, hence |u·v| = ||u|| ||v|| |cos θ| ≤ ||u|| ||v||.</p></div>}</div>
  </PhaseOneVisualProof>;
}
