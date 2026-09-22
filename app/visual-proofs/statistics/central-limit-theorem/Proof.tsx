"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BarChart3, Play, ScanSearch } from "lucide-react";
import { Feedback, PhaseOneVisualProof, ResetTool, ToolButton } from "../../../components/phase-one/PhaseOneVisualProof";
import { PlotFrame, plotCurve, plotPoint, type Plot } from "../../../components/phase-one/PhaseTwoPlot";
import s from "../../../components/phase-one/PhaseThreeProof.module.css";
import { formatNumber } from "../../../lib/phaseTwoMath";
import { distributions, drawSample, normalDensity, type DistributionKind } from "../../../lib/phaseThreeMath";
import { proofConfig } from "./proof.config";

const sizes = [1, 2, 5, 10, 30, 50, 100];
const repetitions = [100, 500, 1000, 5000, 10000];
const binCount = 44;
type Simulation = { bins: number[]; total: number; inside: number; sum: number; sumSquares: number; latest: number | null };
const emptySimulation = (): Simulation => ({ bins: Array(binCount).fill(0), total: 0, inside: 0, sum: 0, sumSquares: 0, latest: null });

export default function Proof() {
  const [kind, setKind] = useState<DistributionKind>("exponential"), [n, setN] = useState(30), [repeats, setRepeats] = useState(1000);
  const [simulation, setSimulation] = useState<Simulation>(emptySimulation), [sample, setSample] = useState<number[]>([]), [overlay, setOverlay] = useState(true), [running, setRunning] = useState(false);
  const [answer, setAnswer] = useState(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const frame = useRef<number | null>(null);
  const definition = distributions[kind], se = definition.sd / Math.sqrt(n);
  const histMin = definition.mean - 6 * se, histMax = definition.mean + 6 * se, binWidth = (histMax - histMin) / binCount;
  const sourcePlot: Plot = { xMin: definition.mean - 4 * definition.sd, xMax: definition.mean + 4 * definition.sd, yMin: 0, yMax: Math.max(1.1, definition.density(definition.mean) * 1.3), height: 170 };
  const maxDensity = simulation.inside ? Math.max(...simulation.bins) / (simulation.inside * binWidth) : 0;
  const histPlot: Plot = { xMin: histMin, xMax: histMax, yMin: 0, yMax: Math.max(maxDensity, normalDensity(definition.mean, definition.mean, se)) * 1.3, height: 275 };
  const cancel = useCallback(() => { if (frame.current !== null) cancelAnimationFrame(frame.current); frame.current = null; setRunning(false); }, []);
  useEffect(() => () => { if (frame.current !== null) cancelAnimationFrame(frame.current); }, []);
  const clear = () => { cancel(); setSimulation(emptySimulation()); setSample([]); };
  const changeKind = (next: DistributionKind) => { clear(); setKind(next); };
  const changeSize = (next: number) => { clear(); setN(next); };
  const addOne = () => {
    cancel();
    const values = drawSample(kind, n), mean = values.reduce((sum, value) => sum + value, 0) / n;
    const bin = Math.floor((mean - histMin) / binWidth);
    setSample(values);
    setSimulation((current) => { const bins = [...current.bins]; if (bin >= 0 && bin < binCount) bins[bin]++; return { bins, total: current.total + 1, inside: current.inside + (bin >= 0 && bin < binCount ? 1 : 0), sum: current.sum + mean, sumSquares: current.sumSquares + mean * mean, latest: mean }; });
  };
  const run = (animated: boolean) => {
    cancel();
    const batchSize = animated ? 12 : 110;
    let remaining = repeats;
    setRunning(true);
    const tick = () => {
      const count = Math.min(batchSize, remaining), bins = Array(binCount).fill(0) as number[];
      let sum = 0, sumSquares = 0, inside = 0, latest = 0, lastSample: number[] = [];
      for (let i = 0; i < count; i++) {
        const values = drawSample(kind, n), mean = values.reduce((total, value) => total + value, 0) / n;
        const bin = Math.floor((mean - histMin) / binWidth);
        if (bin >= 0 && bin < binCount) { bins[bin]++; inside++; }
        sum += mean; sumSquares += mean * mean; latest = mean; lastSample = values;
      }
      setSample(lastSample);
      setSimulation((current) => ({ bins: current.bins.map((value, i) => value + bins[i]), total: current.total + count, inside: current.inside + inside, sum: current.sum + sum, sumSquares: current.sumSquares + sumSquares, latest }));
      remaining -= count;
      if (remaining > 0) frame.current = requestAnimationFrame(tick);
      else { frame.current = null; setRunning(false); }
    };
    frame.current = requestAnimationFrame(tick);
  };
  const reset = () => { clear(); setKind("exponential"); setN(30); setRepeats(1000); setOverlay(true); setAnswer(""); setFeedback("idle"); };
  const observedMean = simulation.total ? simulation.sum / simulation.total : null;
  const observedSd = simulation.total > 1 ? Math.sqrt(Math.max(0, simulation.sumSquares / simulation.total - (observedMean ?? 0) ** 2)) : null;
  const lastMean = sample.length ? sample.reduce((sum, value) => sum + value, 0) / sample.length : null;
  return <PhaseOneVisualProof meta={proofConfig} activeStep={simulation.total > 100 ? 2 : simulation.total ? 1 : 0}
    steps={[{ title: "Start from a source", body: "Choose a population with finite mean μ and variance σ². The five presets meet these conditions." }, { title: "Average each sample", body: "Draw n independent observations, then place their mean in the lower histogram." }, { title: "Watch the sampling distribution", body: "For sufficiently large n, the means are approximately normal, centered at μ with standard error σ/√n." }]}
    tools={<><ToolButton title="Draw one sample" subtitle="See its observations and mean" onClick={addOne} icon={<ScanSearch size={18} />} /><ToolButton title="Draw many samples" subtitle={`Add ${repeats.toLocaleString()} means in batches`} onClick={() => running ? cancel() : run(false)} active={running} icon={<BarChart3 size={18} />} /><ToolButton title="Animate sampling" subtitle="Add means gradually" onClick={() => running ? cancel() : run(true)} active={running} icon={<Play size={18} />} /><ToolButton title="Normal overlay" subtitle="Compare with N(μ, σ/√n)" onClick={() => setOverlay(!overlay)} active={overlay} /><ResetTool onClick={reset} /></>}
    result={<><h2>Sample mean ≈ N(μ, σ/√n) for large n</h2><p>Here μ = {formatNumber(definition.mean)} and σ/√{n} = {formatNumber(se)}. The approximation improves under standard CLT conditions as n grows.</p></>}
    challenge={<><p>If population SD σ = 12 and n = 36, what is the standard error?</p><div className={s.answer}><input type="number" aria-label="Standard error challenge answer" value={answer} onChange={(e) => { setAnswer(e.target.value); setFeedback("idle"); }} /><button onClick={() => setFeedback(Number(answer) === 2 ? "correct" : "wrong")}>Check</button></div><Feedback state={feedback} /></>}>
    <div className={s.visual}><div className={s.row}><div className={`${s.card} ${s.controls}`}><h2>Sampling controls</h2><label>Source distribution<select value={kind} onChange={(e) => changeKind(e.target.value as DistributionKind)}>{Object.entries(distributions).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label><label>Sample size n<select value={n} onChange={(e) => changeSize(Number(e.target.value))}>{sizes.map((value) => <option key={value} value={value}>{value}</option>)}</select></label><label>Number of samples<select value={repeats} onChange={(e) => setRepeats(Number(e.target.value))}>{repetitions.map((value) => <option key={value} value={value}>{value.toLocaleString()}</option>)}</select></label><div className={s.metricGrid}><div className={s.metric}>Population μ<b>{formatNumber(definition.mean)}</b></div><div className={s.metric}>Population σ<b>{formatNumber(definition.sd)}</b></div></div><button className={s.choice} onClick={addOne}>Draw one sample</button><button className={s.choice} onClick={() => running ? cancel() : run(false)}>{running ? "Stop sampling" : `Draw ${repeats.toLocaleString()} means`}</button></div>
      <div className={s.grow}><div className={s.card}><h2>1. Population and one random sample</h2><div className={s.plot}><PlotFrame plot={sourcePlot} ariaLabel={`${definition.label} source distribution and latest sample`}>{kind === "bernoulli" ? [0, 1].map((x) => { const p = plotPoint(sourcePlot, x, 0); return <rect key={x} x={p.x - 12} y={plotPoint(sourcePlot, 0, x === 0 ? .7 : .3).y} width="24" height={plotPoint(sourcePlot, 0, 0).y - plotPoint(sourcePlot, 0, x === 0 ? .7 : .3).y} fill="#a28bff" />; }) : <path d={plotCurve(sourcePlot, definition.density)} fill="none" stroke="#7450e9" strokeWidth="3" />}{sample.slice(0, 30).map((value, i) => { const p = plotPoint(sourcePlot, value, 0); return <circle key={i} cx={p.x} cy={p.y - 5 - i % 3 * 4} r="3" fill="#5e35e8" />; })}</PlotFrame></div><p>Latest sample: {sample.length ? `${sample.length} observations; mean = ${formatNumber(lastMean ?? 0)}` : "Draw a sample to begin."}{sample.length > 30 ? " First 30 dots shown." : ""}</p></div><div className={s.card} style={{ marginTop: 10 }}><h2>2. Distribution of sample means ({simulation.total.toLocaleString()} drawn)</h2><div className={s.plot}><PlotFrame plot={histPlot} ariaLabel="Histogram of sample means with optional theoretical normal curve">{simulation.inside > 0 && simulation.bins.map((count, i) => { const x = histMin + i * binWidth, height = count / (simulation.inside * binWidth); const top = plotPoint(histPlot, x, height), bottom = plotPoint(histPlot, x, 0); const right = plotPoint(histPlot, x + binWidth, 0); return <rect key={i} x={top.x + .5} y={top.y} width={Math.max(0, right.x - top.x - 1)} height={Math.max(0, bottom.y - top.y)} fill="#a896f7" opacity=".7" />; })}{overlay && <path d={plotCurve(histPlot, (x) => normalDensity(x, definition.mean, se))} fill="none" stroke="#4f29e7" strokeWidth="2.5" />}{simulation.latest !== null && <circle cx={plotPoint(histPlot, simulation.latest, 0).x} cy={plotPoint(histPlot, simulation.latest, 0).y - 6} r="5" fill="#f07731" />}</PlotFrame></div><div className={s.metricGrid}><div className={s.metric}>Mean of means<b>{observedMean === null ? "—" : formatNumber(observedMean)}</b>theory {formatNumber(definition.mean)}</div><div className={s.metric}>SD of means<b>{observedSd === null ? "—" : formatNumber(observedSd)}</b>theory {formatNumber(se)}</div></div><p className={s.small}>{simulation.total - simulation.inside > 0 ? `${simulation.total - simulation.inside} extreme mean(s) lie outside the plotted ±6-SE range; all are included in summary statistics.` : "Histogram shows the ±6-standard-error range."}</p></div></div></div></div>
  </PhaseOneVisualProof>;
}
