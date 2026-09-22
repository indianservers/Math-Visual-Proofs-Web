"use client";

import { useState } from "react";
import { Play, Sparkles } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, ToolButton, useRafAnimation } from "../../../components/phase-one/PhaseOneVisualProof";
import s from "../../../components/phase-one/PhaseTwoProof.module.css";
import { choose } from "../../../lib/phaseTwoMath";
import { proofConfig } from "./proof.config";

export default function Proof() {
  const [n, setN] = useState(5), [factors, setFactors] = useState<boolean[]>([false, false, true, true, false]), [revealed, setRevealed] = useState(5);
  const [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setRevealed(Math.min(n, Math.floor(progress * (n + 1)))));
  const k = factors.filter(Boolean).length, coefficient = choose(n, k);
  const setExponent = (value: number) => { animation.stop(); setN(value); setFactors(Array.from({ length: value }, (_, i) => i < Math.min(2, value))); setRevealed(value); };
  const selectK = (value: number) => setFactors(Array.from({ length: n }, (_, i) => i < value));
  const reset = () => { animation.stop(); setN(5); setFactors([false, false, true, true, false]); setRevealed(5); setAnswer(""); setFeedback("idle"); };
  const term = (i: number) => `${choose(n, i) === 1 && n > 0 ? "" : choose(n, i)}${n - i ? `x${n - i > 1 ? `^${n - i}` : ""}` : ""}${i ? `y${i > 1 ? `^${i}` : ""}` : ""}`;
  return <PhaseOneVisualProof meta={proofConfig} activeStep={revealed < n ? 1 : 2}
    steps={[{ title: "Choose one from each factor", body: "Each factor (x+y) contributes either x or y. Click factor cards to change the selection." }, { title: "Count matching choices", body: "Exactly k selections of y can be made in C(n,k) ways." }, { title: "Read Pascal's row", body: "Adjacent coefficients add to the next row, giving the full expansion." }]}
    tools={<><ToolButton title="Animate expansion" subtitle="Reveal terms from left to right" onClick={() => animation.playing ? animation.stop() : (setRevealed(0), animation.start(4200))} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Choose next term" subtitle="Cycle the y exponent k" onClick={() => selectK((k + 1) % (n + 1))} icon={<Sparkles size={18} />} /><ResetTool onClick={reset} /></>}
    result={<><h2>(x+y)ⁿ = Σ C(n,k)xⁿ⁻ᵏyᵏ</h2><p>Selected term: {term(k)}; there are {coefficient} ways to choose {k} y{ k === 1 ? "" : "s"}.</p></>}
    challenge={<><p>What is the coefficient of x⁴y² in (x+y)⁶?</p><div className={s.answer}><input aria-label="Binomial challenge answer" type="number" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} /><button onClick={() => setFeedback(Number(answer) === 15 ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.layout}><div className={s.controls}><h2>Choose the power</h2><MathRange label="Exponent n" value={n} min={0} max={10} onChange={setExponent} /><div className={s.mathCard}><strong>Current choice</strong><p>y selected: k = {k}</p><p>Coefficient C({n},{k}) = {coefficient}</p><p>Term: {term(k)}</p></div><div className={s.small}>Click any number in row {n}, or toggle x/y in the factor cards.</div></div><div className={s.stage}><h2>Pascal&apos;s triangle</h2><div className={s.scroll} aria-label="Pascal triangle">{Array.from({ length: n + 1 }, (_, row) => <div key={row} className={s.pascalRow}>{Array.from({ length: row + 1 }, (_, col) => <button key={col} type="button" aria-label={`Row ${row}, coefficient ${col}: ${choose(row, col)}`} aria-pressed={row === n && col === k} onClick={() => row === n ? selectK(col) : setExponent(row)}>{choose(row, col)}</button>)}</div>)}</div><div className={s.mathCard}><strong>Expansion of (x+y)<sup>{n}</sup></strong><p>{Array.from({ length: n + 1 }, (_, i) => <span key={i} style={{ opacity: i <= revealed ? 1 : .25, color: i === k ? "#5d31ef" : undefined, fontWeight: i === k ? 800 : undefined }}>{i ? " + " : ""}{term(i)}</span>)}</p></div><div className={s.mathCard}><strong>Choose x or y from each factor</strong><div className={s.factorList}>{factors.map((isY, i) => <button key={i} type="button" aria-label={`Factor ${i + 1}: ${isY ? "y" : "x"}; click to switch`} aria-pressed={isY} onClick={() => setFactors((current) => current.map((choice, index) => index === i ? !choice : choice))}>{isY ? "y" : "x"}</button>)}</div><p>{n === 0 ? "The empty product is 1." : `This selection produces x^${n - k}y^${k}. ${coefficient} distinct selections produce the same term.`}</p></div><div className={s.mathCard}><strong>Pascal recurrence</strong><p>C({n},{k}) = {n > 0 && k > 0 && k < n ? `${choose(n - 1, k - 1)} + ${choose(n - 1, k)} = ${coefficient}` : coefficient}. Edge coefficients are 1.</p></div></div></div>
  </PhaseOneVisualProof>;
}
