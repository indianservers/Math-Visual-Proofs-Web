"use client";

import { useMemo, useState } from "react";
import { Play, ScanSearch } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, ToolButton, useRafAnimation, svgPoint } from "../../../components/phase-one/PhaseOneVisualProof";
import { PlotFrame, plotCurve, plotPoint, type Plot } from "../../../components/phase-one/PhaseTwoPlot";
import s from "../../../components/phase-one/PhaseTwoProof.module.css";
import { formatNumber, meanValuePoints, mvtDefinitions, type MvtKind } from "../../../lib/phaseTwoMath";
import { proofConfig } from "./proof.config";

export default function Proof() {
  const [kind, setKind] = useState<MvtKind>("cubic"), [a, setA] = useState(-2), [b, setB] = useState(2), [index, setIndex] = useState(0);
  const [drag, setDrag] = useState<"a" | "b" | null>(null), [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setB(-1.7 + 3.9 * progress));
  const definition = mvtDefinitions[kind], slope = (definition.fn(b) - definition.fn(a)) / (b - a);
  const roots = useMemo(() => meanValuePoints(kind, a, b), [kind, a, b]);
  const c = roots[Math.min(index, roots.length - 1)];
  const plot: Plot = { xMin: -2.7, xMax: 2.7, yMin: kind === "cubic" ? -9 : -2, yMax: kind === "cubic" ? 9 : 8 };
  const pa = plotPoint(plot, a, definition.fn(a)), pb = plotPoint(plot, b, definition.fn(b));
  const pc = c === undefined ? null : plotPoint(plot, c, definition.fn(c));
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const p = svgPoint(event, { width: 680, height: 390 });
    const value = Math.max(-2.5, Math.min(2.5, -2.7 + (p.x - 38) / 604 * 5.4));
    if (drag === "a") setA(Math.min(value, b - .2));
    else setB(Math.max(value, a + .2));
    setIndex(0);
  };
  const reset = () => { animation.stop(); setKind("cubic"); setA(-2); setB(2); setIndex(0); setAnswer(""); setFeedback("idle"); };
  return <PhaseOneVisualProof meta={proofConfig} activeStep={roots.length ? 2 : 0}
    steps={[{ title: "Choose an interval", body: "The function is continuous on [a,b] and differentiable between the endpoints." }, { title: "Measure average change", body: "The secant through A and B has slope [f(b)−f(a)]/(b−a)." }, { title: "Find parallel tangents", body: "At every highlighted c, f′(c) equals that secant slope. Some intervals have more than one." }]}
    tools={<><ToolButton title="Animate the interval" subtitle="Move B and recompute c continuously" onClick={() => animation.playing ? animation.stop() : (setA(-2), setB(-1.7), animation.start(4500))} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Next tangent point" subtitle={`${roots.length} solution${roots.length === 1 ? "" : "s"} in this interval`} onClick={() => setIndex((index + 1) % Math.max(1, roots.length))} disabled={roots.length < 2} icon={<ScanSearch size={18} />} /><ResetTool onClick={reset} /></>}
    result={<><h2>f′(c) = [f(b)−f(a)]/(b−a)</h2><p>{roots.length ? `${roots.length} point${roots.length === 1 ? "" : "s"} found: ${roots.map((root) => formatNumber(root)).join(", ")}` : "Choose a wider interval to reveal a mean-value point."}</p></>}
    challenge={<><p>For f(x)=x² on [1,3], which c has tangent slope equal to the secant slope?</p><div className={s.answer}><input aria-label="Mean value challenge answer" type="number" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} /><button onClick={() => setFeedback(Number(answer) === 2 ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.layout}><div className={s.controls}><h2>Set the interval</h2><label><span>Function</span><select value={kind} onChange={(e) => { setKind(e.target.value as MvtKind); setIndex(0); }}>{Object.entries(mvtDefinitions).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><MathRange label="Left endpoint a" value={a} min={-2.5} max={b - .2} step={.01} display={formatNumber(a, 2)} onChange={(value) => { setA(value); setIndex(0); }} /><MathRange label="Right endpoint b" value={b} min={a + .2} max={2.5} step={.01} display={formatNumber(b, 2)} onChange={(value) => { animation.stop(); setB(value); setIndex(0); }} /><div className={s.mathCard}><strong>Secant slope</strong><p>m = {formatNumber(slope)}</p><p>Current c = {c === undefined ? "—" : formatNumber(c)}</p><p>f′(c) = {c === undefined ? "—" : formatNumber(definition.derivative(c))}</p></div></div><div className={s.stage}><h2>Where does the tangent run parallel?</h2><div className={s.plot}><PlotFrame plot={plot} ariaLabel="Mean Value Theorem graph with draggable endpoints and tangent point" onPointerMove={move} onPointerUp={() => setDrag(null)}><path d={plotCurve(plot, definition.fn)} fill="none" stroke="#5831dd" strokeWidth="3" /><path d={plotCurve(plot, (x) => definition.fn(a) + slope * (x - a))} fill="none" stroke="#079b8e" strokeWidth="2" strokeDasharray="6 4" />{c !== undefined && <path d={plotCurve(plot, (x) => definition.fn(c) + definition.derivative(c) * (x - c))} fill="none" stroke="#ef7712" strokeWidth="2.5" />}{roots.map((root, i) => { const point = plotPoint(plot, root, definition.fn(root)); return <circle key={i} cx={point.x} cy={point.y} r={i === index ? 8 : 5} fill={i === index ? "#ef7712" : "#ffbe85"} />; })}<circle cx={pa.x} cy={pa.y} r="9" fill="#079b8e" stroke="white" strokeWidth="3" style={{ cursor: "grab" }} onPointerDown={(e) => { setDrag("a"); e.currentTarget.setPointerCapture(e.pointerId); }} /><circle cx={pb.x} cy={pb.y} r="9" fill="#079b8e" stroke="white" strokeWidth="3" style={{ cursor: "grab" }} onPointerDown={(e) => { setDrag("b"); e.currentTarget.setPointerCapture(e.pointerId); }} /><text x={pa.x - 19} y={pa.y - 12} fontSize="14">A</text><text x={pb.x + 10} y={pb.y - 12} fontSize="14">B</text>{pc && <text x={pc.x + 10} y={pc.y - 12} fontSize="14">c</text>}</PlotFrame></div><div className={s.legend}><span>🟣 f(x)</span><span>🟢 secant AB</span><span>🟠 tangent at c</span></div><div className={s.mathCard}>m = [f({formatNumber(b, 2)}) − f({formatNumber(a, 2)})]/({formatNumber(b - a, 2)}) = {formatNumber(slope)}. {roots.length > 1 && "Use Next tangent point to inspect every solution."}</div></div></div>
  </PhaseOneVisualProof>;
}
