"use client";

import { useState } from "react";
import { GitBranch, Layers, Play, ScanSearch } from "lucide-react";
import { Feedback, MathRange, PhaseOneVisualProof, ResetTool, ToolButton, useRafAnimation } from "../../../components/phase-one/PhaseOneVisualProof";
import s from "../../../components/phase-one/PhaseThreeProof.module.css";
import { formatNumber } from "../../../lib/phaseTwoMath";
import { bayesCells } from "../../../lib/phaseThreeMath";
import { proofConfig } from "./proof.config";

function roundedCounts(values: number[], population: number) {
  const raw = values.map((value) => value * population);
  const counts = raw.map(Math.floor);
  const order = raw.map((value, i) => ({ i, fraction: value - counts[i] })).sort((a, b) => b.fraction - a.fraction);
  const remaining = population - counts.reduce((sum, value) => sum + value, 0);
  for (let j = 0; j < remaining; j++) counts[order[j].i]++;
  return counts;
}

export default function Proof() {
  const [prior, setPrior] = useState(.1), [sensitivity, setSensitivity] = useState(.8), [falsePositive, setFalsePositive] = useState(.2);
  const [population, setPopulation] = useState(1000), [treeVisible, setTreeVisible] = useState(true), [areaVisible, setAreaVisible] = useState(true), [givenB, setGivenB] = useState(true), [stage, setStage] = useState(6);
  const [answer, setAnswer] = useState<"both" | "sensitivity" | "" >(""), [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const animation = useRafAnimation((progress) => setStage(Math.min(6, Math.floor(progress * 7))));
  const cells = bayesCells(prior, sensitivity, falsePositive);
  const counts = roundedCounts([cells.ab, cells.aNotB, cells.notAB, cells.notANotB], population);
  const percent = (value: number) => `${formatNumber(value * 100, 1)}%`;
  const reset = () => { animation.stop(); setPrior(.1); setSensitivity(.8); setFalsePositive(.2); setPopulation(1000); setTreeVisible(true); setAreaVisible(true); setGivenB(true); setStage(6); setAnswer(""); setFeedback("idle"); };
  const cellData = [
    { label: "A ∩ B", value: cells.ab, count: counts[0], fill: "#66d9b0", x: 0, y: 0 },
    { label: "A ∩ ¬B", value: cells.aNotB, count: counts[1], fill: "#f6a5ad", x: 0, y: 1 },
    { label: "¬A ∩ B", value: cells.notAB, count: counts[2], fill: "#b6edda", x: 1, y: 0 },
    { label: "¬A ∩ ¬B", value: cells.notANotB, count: counts[3], fill: "#f9dadd", x: 1, y: 1 },
  ];
  const target = cells.posterior === null ? "undefined (B cannot occur)" : `${formatNumber(cells.posterior, 4)} (${percent(cells.posterior)})`;
  return <PhaseOneVisualProof meta={proofConfig} activeStep={stage < 2 ? 0 : stage < 5 ? 1 : 2}
    steps={[{ title: "Start with a prior", body: "Split outcomes into A and not A according to P(A)." }, { title: "Follow evidence branches", body: "Joint probabilities are P(A∩B)=P(A)P(B|A) and P(¬A∩B)=P(¬A)P(B|¬A)." }, { title: "Condition on B", body: "Ignore non-B outcomes, then divide the A∩B share by all B outcomes." }]}
    tools={<><ToolButton title="Animate update" subtitle="Reveal prior, evidence, then posterior" onClick={() => animation.playing ? animation.stop() : (setStage(0), animation.start(5000))} active={animation.playing} icon={<Play size={18} />} /><ToolButton title="Probability tree" subtitle="Show all four joint outcomes" onClick={() => setTreeVisible(!treeVisible)} active={treeVisible} icon={<GitBranch size={18} />} /><ToolButton title="Population area" subtitle="Compare outcome areas and counts" onClick={() => setAreaVisible(!areaVisible)} active={areaVisible} icon={<Layers size={18} />} /><ToolButton title="Condition on B" subtitle="Highlight only observed B outcomes" onClick={() => setGivenB(!givenB)} active={givenB} icon={<ScanSearch size={18} />} /><ResetTool onClick={reset} /></>}
    result={<><h2>P(A|B) = P(B|A)P(A) / P(B)</h2><p>With the current inputs, P(A|B) = {target}.</p></>}
    challenge={<><p>Does P(A|B) depend on sensitivity alone, or on both sensitivity and the prior?</p><div className={s.buttonRow}><button aria-pressed={answer === "sensitivity"} onClick={() => { setAnswer("sensitivity"); setFeedback("wrong"); }}>Sensitivity alone</button><button aria-pressed={answer === "both"} onClick={() => { setAnswer("both"); setFeedback("correct"); }}>Both</button></div><Feedback state={feedback} /></>}>
    <div className={s.visual}><div className={s.threeSliders}><div className={s.card}><MathRange label="Prior P(A)" value={prior} min={0} max={1} step={.01} display={percent(prior)} onChange={setPrior} /></div><div className={s.card}><MathRange label="Sensitivity P(B|A)" value={sensitivity} min={0} max={1} step={.01} display={percent(sensitivity)} onChange={setSensitivity} /></div><div className={s.card}><MathRange label="False positive P(B|¬A)" value={falsePositive} min={0} max={1} step={.01} display={percent(falsePositive)} onChange={setFalsePositive} /></div></div><div className={s.buttonRow}><label>Population size <select value={population} onChange={(e) => setPopulation(Number(e.target.value))}><option value={100}>100</option><option value={1000}>1,000</option><option value={10000}>10,000</option></select></label><span className={s.small}>Generic A state and observed evidence B; counts are illustrative expectations rounded to a whole population.</span></div><div className={s.split}>
      {treeVisible && <div className={s.card}><h2>Probability tree</h2><svg viewBox="0 0 460 330" role="img" aria-label="Probability tree with four joint outcome branches"><line x1="40" y1="160" x2="150" y2="75" stroke="#603be4" strokeWidth={2 + prior * 7} /><line x1="40" y1="160" x2="150" y2="245" stroke="#3765c9" strokeWidth={2 + (1 - prior) * 7} /><text x="75" y="97" className={s.axisText}>{percent(prior)}</text><text x="75" y="235" className={s.axisText}>{percent(1 - prior)}</text><text x="146" y="65" className={s.svgLabel}>A</text><text x="146" y="267" className={s.svgLabel}>¬A</text>{[[150, 75, 340, 35, sensitivity, cells.ab, "A∩B", "#069b70"], [150, 75, 340, 125, 1 - sensitivity, cells.aNotB, "A∩¬B", "#e25a6c"], [150, 245, 340, 205, falsePositive, cells.notAB, "¬A∩B", "#069b70"], [150, 245, 340, 295, 1 - falsePositive, cells.notANotB, "¬A∩¬B", "#e25a6c"]].map(([x1, y1, x2, y2, conditional, joint, label, color], i) => <g key={i} opacity={givenB && stage >= 4 && i % 2 ? .3 : 1}><line x1={Number(x1)} y1={Number(y1)} x2={Number(x2)} y2={Number(y2)} stroke={String(color)} strokeWidth={2 + Number(conditional) * 6} /><text x={210} y={(Number(y1) + Number(y2)) / 2 - 5} className={s.axisText}>{percent(Number(conditional))}</text><text x={345} y={Number(y2) + 4} fontSize="12" fill={String(color)}>{String(label)} = {percent(Number(joint))}</text></g>)}</svg></div>}
      {areaVisible && <div className={s.card}><h2>Population area model</h2><svg viewBox="0 0 460 330" role="img" aria-label="Area model split into A and not A, each with B and not B outcomes"><rect x="25" y="36" width="410" height="250" fill="white" stroke="#5a39db" strokeWidth="2" />{cellData.map((cell, i) => { const x = 25 + (cell.x ? prior * 410 : 0), width = (cell.x ? 1 - prior : prior) * 410; const conditional = cell.x ? falsePositive : sensitivity; const y = 36 + (cell.y ? conditional * 250 : 0), height = (cell.y ? 1 - conditional : conditional) * 250; return <g key={i} role="img" aria-label={`${cell.label}: ${percent(cell.value)}, ${cell.count} of ${population}`} opacity={givenB && stage >= 4 && cell.y ? .3 : 1}><rect x={x} y={y} width={width} height={height} fill={cell.fill} stroke="white" strokeWidth="2" />{width > 65 && height > 35 && <text x={x + width / 2} y={y + height / 2} fontSize="12" textAnchor="middle" fill="#26325f">{cell.label}: {cell.count}</text>}</g>; })}<text x="25" y="20" className={s.axisText}>A: {counts[0] + counts[1]}</text><text x="270" y="20" className={s.axisText}>¬A: {counts[2] + counts[3]}</text><text x="25" y="313" className={s.axisText}>B outcomes: {counts[0] + counts[2]} of {population}</text></svg></div>}
    </div><div className={`${s.card} ${s.highlight}`}><h2>Given B, which share came from A?</h2><p className={s.formula}>P(A|B) = {formatNumber(cells.ab, 4)} / ({formatNumber(cells.ab, 4)} + {formatNumber(cells.notAB, 4)}) = {target}</p><div style={{ display: "flex", height: 18, background: "#e7e9f6", borderRadius: 9, overflow: "hidden" }} role="img" aria-label={`Posterior share of A among B outcomes: ${target}`}>{cells.posterior !== null && <span style={{ width: `${cells.posterior * 100}%`, background: "#08aa78" }} />}</div><p>P(B) = {formatNumber(cells.evidence, 4)}. {cells.posterior === null ? "No B outcomes exist, so conditioning on B is undefined." : "Only the B branches remain in this conditional view."}</p></div></div>
  </PhaseOneVisualProof>;
}
