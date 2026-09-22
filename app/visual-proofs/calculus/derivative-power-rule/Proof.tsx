"use client";

import { useMemo, useState } from "react";
import { Eye, Play, Sparkles } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, Toggle, ToolButton, useRafAnimation, svgPoint } from "../../../components/phase-one/PhaseOneVisualProof";
import { PlotFrame, plotCurve, plotPoint, type Plot } from "../../../components/phase-one/PhaseTwoPlot";
import s from "../../../components/phase-one/PhaseTwoProof.module.css";
import { choose, formatNumber, powerQuotientTerms } from "../../../lib/phaseTwoMath";
import { proofConfig } from "./proof.config";

const initial = { n: 3, x: 0.6, h: 0.8 };

export default function Proof() {
  const [n, setN] = useState(initial.n), [x, setX] = useState(initial.x), [h, setH] = useState(initial.h);
  const [showDerivative, setShowDerivative] = useState(false), [showExpansion, setShowExpansion] = useState(true);
  const [drag, setDrag] = useState(false), [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setH(Number((0.8 * (1 - progress) + 0.001 * progress).toFixed(4))));
  const derivative = n * x ** (n - 1), quotient = (x + h) ** n / h - x ** n / h;
  const terms = useMemo(() => powerQuotientTerms(n, x, h), [n, x, h]);
  const ySize = Math.max(3.4, 1.6 ** n, n * 1.6 ** (n - 1)) * 1.15;
  const plot: Plot = { xMin: -1.65, xMax: 1.65, yMin: -ySize, yMax: ySize };
  const p = plotPoint(plot, x, x ** n), q = plotPoint(plot, x + h, (x + h) ** n);
  const tangent = (t: number) => x ** n + derivative * (t - x);
  const secant = (t: number) => x ** n + quotient * (t - x);
  const move = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!drag) return;
    const pos = svgPoint(event, { width: 680, height: 390 });
    setX(Math.max(-1.5, Math.min(1.5 - h, -1.65 + (pos.x - 38) / 604 * 3.3)));
  };
  const reset = () => { animation.stop(); setN(initial.n); setX(initial.x); setH(initial.h); setShowDerivative(false); setShowExpansion(true); setFeedback("idle"); setAnswer(""); };
  const expansion = Array.from({ length: n + 1 }, (_, k) => {
    const coefficient = choose(n, k), xPower = n - k;
    const variables = `${xPower ? `x${xPower > 1 ? `^${xPower}` : ""}` : ""}${k ? `h${k > 1 ? `^${k}` : ""}` : ""}`;
    return `${coefficient === 1 && variables ? "" : coefficient}${variables}`;
  }).join(" + ");

  return <PhaseOneVisualProof meta={proofConfig} activeStep={h < .08 ? 2 : showExpansion ? 1 : 0}
    steps={[{ title: "Move two points", body: "P lies at x; Q lies at x+h. Their connecting line has the finite-difference slope." }, { title: "Expand and divide", body: "The xⁿ terms cancel. Every term except nxⁿ⁻¹ still contains h." }, { title: "Let h approach zero", body: "Those h-terms vanish, leaving the tangent slope nxⁿ⁻¹." }]}
    tools={<><ToolButton title="Animate h → 0" subtitle="Watch the secant become the tangent" onClick={() => animation.playing ? animation.stop() : animation.start(3800)} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Show binomial expansion" subtitle="Reveal every term of (x+h)ⁿ" onClick={() => setShowExpansion(!showExpansion)} active={showExpansion} icon={<Sparkles size={18} />} /><ToolButton title="Derivative graph" subtitle="Overlay y = nxⁿ⁻¹" onClick={() => setShowDerivative(!showDerivative)} active={showDerivative} icon={<Eye size={18} />} /><ResetTool onClick={reset} /></>}
    result={<><h2>d(xⁿ)/dx = nxⁿ⁻¹</h2><p>At x = {formatNumber(x)}, the tangent slope is {formatNumber(derivative)}.</p></>}
    challenge={<><p>For f(x)=x⁵, what is f′(2)?</p><div className={s.answer}><input aria-label="Derivative challenge answer" type="number" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} /><button onClick={() => setFeedback(Number(answer) === 80 ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.layout}><div className={s.controls}><h2>Explore the rule</h2><MathRange label="Exponent n" value={n} min={1} max={8} onChange={setN} /><MathRange label="Point x" value={x} min={-1.5} max={1.5 - h} step={.01} display={formatNumber(x, 2)} onChange={setX} /><MathRange label="Step h" value={h} min={.001} max={1.2} step={.001} display={formatNumber(h, 3)} onChange={(value) => { animation.stop(); setH(value); setX((old) => Math.min(old, 1.5 - value)); }} /><Toggle label="Show derivative curve" checked={showDerivative} onChange={setShowDerivative} /><div className={s.mathCard}><strong>Live slopes</strong><p>Secant: {formatNumber(quotient)}</p><p>Tangent: {formatNumber(derivative)}</p></div></div>
      <div className={s.stage}><h2>The slope of y = x<sup>{n}</sup></h2><div className={s.plot}><PlotFrame plot={plot} ariaLabel={`Graph of x to the power ${n}, with secant and tangent lines`} onPointerMove={move} onPointerUp={() => setDrag(false)}><path d={plotCurve(plot, (t) => t ** n)} fill="none" stroke="#5d31ef" strokeWidth="3" /><path d={plotCurve(plot, secant)} fill="none" stroke="#079b8e" strokeWidth="2" strokeDasharray="6 5" /><path d={plotCurve(plot, tangent)} fill="none" stroke="#ef7712" strokeWidth="2" />{showDerivative && <path d={plotCurve(plot, (t) => n * t ** (n - 1))} fill="none" stroke="#eb4d73" strokeWidth="2.5" />}{Number.isFinite(q.y) && <circle cx={q.x} cy={q.y} r="6" fill="#079b8e" />}<circle cx={p.x} cy={p.y} r="9" fill="#5d31ef" stroke="white" strokeWidth="3" style={{ cursor: "grab" }} onPointerDown={(e) => { setDrag(true); e.currentTarget.setPointerCapture(e.pointerId); }} /><text x={p.x + 12} y={p.y - 9} fontSize="14">P</text><text x={q.x + 10} y={q.y - 8} fontSize="14">Q</text></PlotFrame></div><div className={s.legend}><span><i className={s.swatch} style={{ background: "#5d31ef" }} /> xⁿ</span><span><i className={s.swatch} style={{ background: "#079b8e" }} /> secant</span><span><i className={s.swatch} style={{ background: "#ef7712" }} /> tangent</span>{showDerivative && <span>derivative curve</span>}</div><div className={s.mathCard}><strong>Finite difference</strong><p>[(x+h)<sup>{n}</sup> − x<sup>{n}</sup>]/h = {formatNumber(quotient)}</p>{showExpansion && <><p>(x+h)<sup>{n}</sup> = {expansion}</p><p>After cancellation and division: {terms.map((value, index) => <span key={index} style={{ opacity: index === 0 ? 1 : Math.max(.2, Math.min(1, h * 2)) }}>{index > 0 ? " + " : ""}{formatNumber(value)}</span>)}</p></>}</div></div></div>
  </PhaseOneVisualProof>;
}
