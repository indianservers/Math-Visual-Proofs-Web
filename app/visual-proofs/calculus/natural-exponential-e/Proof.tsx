"use client";

import { useState } from "react";
import { Play, Table2, Waves } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, ToolButton, useRafAnimation } from "../../../components/phase-one/PhaseOneVisualProof";
import { PlotFrame, plotCurve, plotPoint, type Plot } from "../../../components/phase-one/PhaseTwoPlot";
import s from "../../../components/phase-one/PhaseThreeProof.module.css";
import { formatNumber } from "../../../lib/phaseTwoMath";
import { compoundAmount, stepCompoundAmount } from "../../../lib/phaseThreeMath";
import { proofConfig } from "./proof.config";

const frequencies = [1, 2, 4, 12, 52, 365, 1000, 10000];
const shownCurves = [1, 2, 4, 12, 365];
const colors = ["#e74c59", "#e88726", "#30a9a2", "#3979d6", "#04945c"];

function stepPath(plot: Plot, principal: number, rate: number, n: number, maxTime: number) {
  const start = plotPoint(plot, 0, principal);
  let path = `M${start.x},${start.y}`;
  const periods = Math.floor(n * maxTime);
  for (let k = 1; k <= periods; k++) {
    const time = k / n, previous = plotPoint(plot, time, principal * (1 + rate / n) ** (k - 1));
    const next = plotPoint(plot, time, principal * (1 + rate / n) ** k);
    path += `H${previous.x.toFixed(2)}V${next.y.toFixed(2)}`;
  }
  return path;
}

export default function Proof() {
  const [frequencyIndex, setFrequencyIndex] = useState(3), [principal, setPrincipal] = useState(1), [rate, setRate] = useState(1), [time, setTime] = useState(1);
  const [showTable, setShowTable] = useState(true), [compare, setCompare] = useState(true), [answer, setAnswer] = useState<"e" | "infinity" | "one" | "" >(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setFrequencyIndex(Math.min(frequencies.length - 1, Math.floor(progress * frequencies.length))));
  const n = frequencies[frequencyIndex], eApproximation = (1 + 1 / n) ** n;
  const amount = compoundAmount(principal, rate, n, time), continuous = principal * Math.exp(rate * time);
  const timeMax = Math.max(2, time), maxY = principal * Math.exp(rate * timeMax) * 1.14;
  const plot: Plot = { xMin: 0, xMax: timeMax, yMin: 0, yMax: maxY, height: 410 };
  const reset = () => { animation.stop(); setFrequencyIndex(3); setPrincipal(1); setRate(1); setTime(1); setShowTable(true); setCompare(true); setAnswer(""); setFeedback("idle"); };
  return <PhaseOneVisualProof meta={proofConfig} activeStep={frequencyIndex > 5 ? 2 : frequencyIndex > 1 ? 1 : 0}
    steps={[{ title: "Compound in steps", body: "At n compounding periods per unit time, each completed period multiplies the amount by 1+r/n." }, { title: "Increase the frequency", body: "The steps become shorter and the value (1+1/n)ⁿ approaches a fixed number." }, { title: "Reach continuous growth", body: "That limit is e; in general P(1+r/n)ⁿᵗ approaches Peʳᵗ." }]}
    tools={<><ToolButton title="Animate compounding" subtitle="Increase n from 1 through 10,000" onClick={() => animation.playing ? animation.stop() : (setFrequencyIndex(0), animation.start(5300))} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Show table" subtitle="Inspect convergence to e" onClick={() => setShowTable(!showTable)} active={showTable} icon={<Table2 size={18} />} /><ToolButton title="Compare curves" subtitle="Overlay five step frequencies" onClick={() => setCompare(!compare)} active={compare} icon={<Waves size={18} />} /><ResetTool onClick={reset} /></>}
    result={<><h2>e = limₙ→∞ (1+1/n)ⁿ</h2><p>For P={formatNumber(principal, 1)}, r={formatNumber(rate, 2)}, t={formatNumber(time, 2)}: Aₙ(t)={formatNumber(amount, 5)} → Peʳᵗ={formatNumber(continuous, 5)}.</p></>}
    challenge={<><p>As n grows, what does (1+1/n)ⁿ approach?</p><div className={s.buttonRow}>{[["one", "1"], ["e", "e ≈ 2.71828"], ["infinity", "∞"]].map(([value, label]) => <button key={value} aria-pressed={answer === value} onClick={() => { setAnswer(value as typeof answer); setFeedback(value === "e" ? "correct" : "wrong"); }}>{label}</button>)}</div><Feedback state={feedback} /></>}>
    <div className={s.visual}><div className={s.row}><div className={`${s.card} ${s.controls}`}><h2>Compounding controls</h2><MathRange label="Frequency n" value={frequencyIndex} min={0} max={frequencies.length - 1} display={n.toLocaleString()} ariaValueText={`${n.toLocaleString()} periods per unit time`} onChange={(index) => { animation.stop(); setFrequencyIndex(index); }} /><MathRange label="Principal P" value={principal} min={.5} max={3} step={.1} display={formatNumber(principal, 1)} onChange={setPrincipal} /><MathRange label="Rate r" value={rate} min={.1} max={1.5} step={.05} display={formatNumber(rate, 2)} onChange={setRate} /><MathRange label="Time t" value={time} min={0} max={3} step={.05} display={formatNumber(time, 2)} onChange={setTime} /><div className={s.metric}>Pure e approximation<b>{formatNumber(eApproximation, 6)}</b>e − value = {formatNumber(Math.E - eApproximation, 6)}</div></div><div className={s.grow}><div className={s.card}><h2>Stepwise growth approaches a smooth curve</h2><div className={s.plot}><PlotFrame plot={plot} ariaLabel={`Compounding step curves compared with continuous growth, selected frequency ${n}`}><path d={plotCurve(plot, (x) => principal * Math.exp(rate * x))} fill="none" stroke="#5a2be6" strokeWidth="3.5" />{compare && shownCurves.map((frequency, i) => <path key={frequency} d={stepPath(plot, principal, rate, frequency, timeMax)} fill="none" stroke={colors[i]} strokeWidth={frequency === n ? 2.8 : 1.5} opacity={frequency === n ? 1 : .65} />)}{!compare && n <= 365 && <path d={stepPath(plot, principal, rate, n, timeMax)} fill="none" stroke="#0b9c77" strokeWidth="2.5" />}{(() => { const p = plotPoint(plot, time, continuous); return <circle cx={p.x} cy={p.y} r="5" fill="#5a2be6" />; })()}</PlotFrame></div><div className={s.legend}><span><i className={s.dot} style={{ background: "#5a2be6" }} />continuous Peʳᵗ</span>{compare && shownCurves.map((frequency, i) => <span key={frequency}><i className={s.dot} style={{ background: colors[i] }} />n={frequency}</span>)}</div><p>At t={formatNumber(time, 2)}, completed-period step value = {formatNumber(stepCompoundAmount(principal, rate, n, time), 5)}. The formula P(1+r/n)ⁿᵗ gives {formatNumber(amount, 5)} between period boundaries.</p></div></div></div><div className={s.split}>{showTable && <div className={s.card}><h2>Convergence table</h2><table className={s.table}><thead><tr><th>n</th><th>(1+1/n)ⁿ</th><th>error from e</th></tr></thead><tbody>{frequencies.map((frequency) => { const value = (1 + 1 / frequency) ** frequency; return <tr key={frequency} aria-selected={frequency === n}><td>{frequency.toLocaleString()}</td><td>{formatNumber(value, 6)}</td><td>{formatNumber(Math.E - value, 6)}</td></tr>; })}<tr><td>∞</td><td>{formatNumber(Math.E, 6)}</td><td>0</td></tr></tbody></table></div>}<div className={`${s.card} ${s.highlight}`}><h2>The limiting value</h2><p className={s.formula}>e = lim n→∞ (1+1/n)ⁿ ≈ 2.718281828…</p><p className={s.formula}>lim n→∞ P(1+r/n)ⁿᵗ = Peʳᵗ</p><p>Higher compounding frequency narrows the gap without overshooting the continuous-growth limit for positive r and t.</p></div></div></div>
  </PhaseOneVisualProof>;
}
