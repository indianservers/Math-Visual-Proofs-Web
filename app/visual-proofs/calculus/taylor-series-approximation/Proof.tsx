"use client";

import { useMemo, useState } from "react";
import { Eye, Play, Sparkles } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, Toggle, ToolButton, useRafAnimation } from "../../../components/phase-one/PhaseOneVisualProof";
import { PlotFrame, plotCurve, plotPoint, type Plot } from "../../../components/phase-one/PhaseTwoPlot";
import s from "../../../components/phase-one/PhaseTwoProof.module.css";
import { evaluateTaylor, formatNumber, taylorCoefficients, taylorDefinitions, type TaylorKind } from "../../../lib/phaseTwoMath";
import { proofConfig } from "./proof.config";

export default function Proof() {
  const [kind, setKind] = useState<TaylorKind>("exp"), [center, setCenter] = useState(0), [order, setOrder] = useState(3);
  const [showError, setShowError] = useState(true), [showTerms, setShowTerms] = useState(true), [showDerivatives, setShowDerivatives] = useState(false);
  const [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setOrder(Math.min(12, Math.floor(progress * 13))));
  const definition = taylorDefinitions[kind];
  const coefficients = useMemo(() => taylorCoefficients(kind, center, order), [kind, center, order]);
  const approximate = (x: number) => evaluateTaylor(coefficients, x, center);
  const [xMin, xMax] = definition.domain;
  const yRange = kind === "exp" ? [-2, 14] : kind === "log" ? [-2.5, 2.5] : [-2.2, 2.2];
  const plot: Plot = { xMin, xMax, yMin: yRange[0], yMax: yRange[1], height: 350 };
  const errors = Array.from({ length: 120 }, (_, i) => {
    const x = xMin + (xMax - xMin) * i / 119;
    return Math.abs(definition.fn(x) - approximate(x));
  }).filter(Number.isFinite);
  const maxError = Math.max(.1, Math.min(15, Math.max(...errors)));
  const errorPlot: Plot = { xMin, xMax, yMin: 0, yMax: maxError * 1.05, height: 135 };
  const reset = () => { animation.stop(); setKind("exp"); setCenter(0); setOrder(3); setShowError(true); setShowTerms(true); setShowDerivatives(false); setAnswer(""); setFeedback("idle"); };
  const changeKind = (value: TaylorKind) => { animation.stop(); setKind(value); setCenter(0); setOrder(3); };
  const termLabel = (coefficient: number, k: number) => {
    const base = center === 0 ? "x" : `(x${center < 0 ? "+" : "−"}${formatNumber(Math.abs(center), 2)})`;
    return `${formatNumber(Math.abs(coefficient), 4)}${k ? `${base}${k > 1 ? `^${k}` : ""}` : ""}`;
  };
  return <PhaseOneVisualProof meta={proofConfig} activeStep={order > 5 ? 2 : order > 0 ? 1 : 0}
    steps={[{ title: "Match at the center", body: "The constant term makes the polynomial meet f at x=a." }, { title: "Match derivatives", body: "Each new coefficient f⁽ᵏ⁾(a)/k! matches one more derivative at a." }, { title: "Zoom the local fit", body: "Near a the error falls as order rises; far away, a finite polynomial can diverge." }]}
    tools={<><ToolButton title="Animate order" subtitle="Grow P₀ through P₁₂" onClick={() => animation.playing ? animation.stop() : (setOrder(0), animation.start(4500))} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Show polynomial terms" subtitle="Inspect the coefficients" onClick={() => setShowTerms(!showTerms)} active={showTerms} icon={<Sparkles size={18} />} /><ToolButton title="Show derivative match" subtitle="List f⁽ᵏ⁾(a) and P⁽ᵏ⁾(a)" onClick={() => setShowDerivatives(!showDerivatives)} active={showDerivatives} icon={<Eye size={18} />} /><ResetTool onClick={reset} /></>}
    result={<><h2>Pₙ(x) = Σ f⁽ᵏ⁾(a)(x−a)ᵏ/k!</h2><p>Order {order} matches the first {order + 1} derivatives at a = {formatNumber(center, 2)}.</p></>}
    challenge={<><p>What is the coefficient of x² in the order-2 Taylor polynomial of eˣ at a=0?</p><div className={s.answer}><input aria-label="Taylor challenge answer" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} placeholder="e.g. 1/2" /><button onClick={() => setFeedback(["1/2", "0.5", ".5"].includes(answer.replace(/\s/g, "")) ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.layout}><div className={s.controls}><h2>Build a polynomial</h2><label><span>Function</span><select value={kind} onChange={(e) => changeKind(e.target.value as TaylorKind)}>{Object.entries(taylorDefinitions).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><MathRange label="Center a" value={center} min={kind === "log" ? -.7 : -1} max={kind === "log" ? .7 : 1} step={.1} display={formatNumber(center, 1)} onChange={setCenter} /><MathRange label="Order n" value={order} min={0} max={12} onChange={(value) => { animation.stop(); setOrder(value); }} /><Toggle label="Show error graph" checked={showError} onChange={setShowError} /><div className={s.mathCard}><strong>At x = a</strong><p>f(a) = Pₙ(a) = {formatNumber(definition.fn(center))}</p><p>Terms included: {order + 1}</p></div></div><div className={s.stage}><h2>{definition.label} and P<sub>{order}</sub>(x)</h2><div className={s.plot}><PlotFrame plot={plot} ariaLabel={`${definition.label} and Taylor polynomial order ${order}`}><path d={plotCurve(plot, definition.fn)} fill="none" stroke="#4532d4" strokeWidth="3" /><path d={plotCurve(plot, approximate)} fill="none" stroke="#f37535" strokeWidth="3" /><circle cx={plotPoint(plot, center, definition.fn(center)).x} cy={plotPoint(plot, center, definition.fn(center)).y} r="7" fill="#079b8e" stroke="white" strokeWidth="2" /></PlotFrame></div><div className={s.legend}><span>🟣 target f(x)</span><span>🟠 polynomial Pₙ(x)</span><span>🟢 center a</span></div>{showError && <div className={s.plot}><PlotFrame plot={errorPlot} ariaLabel="Absolute approximation error"><path d={plotCurve(errorPlot, (x) => Math.abs(definition.fn(x) - approximate(x)))} fill="none" stroke="#e64672" strokeWidth="2.5" /></PlotFrame><span className={s.small}>Absolute error |f(x)−Pₙ(x)|</span></div>}{showTerms && <div className={s.mathCard}><strong>P<sub>{order}</sub>(x) = </strong>{coefficients.map((coefficient, k) => <span key={k}>{k ? coefficient < 0 ? " − " : " + " : coefficient < 0 ? "−" : ""}{termLabel(coefficient, k)}</span>)}</div>}{showDerivatives && <div className={s.mathCard}><strong>Derivative matching at a</strong>{coefficients.map((_, k) => <p key={k}>k={k}: f⁽ᵏ⁾(a) = P⁽ᵏ⁾(a) = {formatNumber(definition.derivative(k, center))}</p>)}</div>}</div></div>
  </PhaseOneVisualProof>;
}
