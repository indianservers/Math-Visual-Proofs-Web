"use client";

import { useCallback, useState } from "react";
import { Eye, Grid3X3, Play, Square, Target } from "lucide-react";
import {
  Feedback,
  MathRange,
  PhaseOneVisualProof,
  ResetTool,
  Toggle,
  ToolButton,
  svgPoint,
  useRafAnimation,
} from "../../../components/phase-one/PhaseOneVisualProof";
import { proofConfig } from "./proof.config";

const W = 860, H = 560, cx = 330, cy = 286, radius = 210;
const rad = (degrees: number) => degrees * Math.PI / 180;
const fixed = (value: number) => Math.abs(value) < 0.0005 ? "0.000" : value.toFixed(3);

export default function Proof() {
  const [theta, setTheta] = useState(38);
  const [projections, setProjections] = useState(true);
  const [squares, setSquares] = useState(true);
  const [grid, setGrid] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "wrong">("idle");
  const [activeStep, setActiveStep] = useState(-1);
  const angle = rad(theta);
  const cos = Math.cos(angle), sin = Math.sin(angle);

  const animateFrame = useCallback((progress: number) => {
    setTheta(progress * 360);
    setActiveStep(Math.min(6, Math.floor(progress * 7)));
    if (progress >= 1) setActiveStep(6);
  }, []);
  const animation = useRafAnimation(animateFrame);

  const point = { x: cx + radius * cos, y: cy - radius * sin };

  const updateFromPointer = (event: React.PointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const p = svgPoint(event, { width: W, height: H });
    let degrees = Math.atan2(cy - p.y, p.x - cx) * 180 / Math.PI;
    if (degrees < 0) degrees += 360;
    setTheta(degrees);
  };

  const reset = () => {
    animation.stop(); setTheta(38); setProjections(true); setSquares(true); setGrid(false); setActiveStep(-1); setAnswer(""); setFeedback("idle");
  };
  const check = () => setFeedback(Math.abs(Number(answer) - (1 - Math.sin(rad(53)) ** 2)) < 0.02 ? "correct" : "wrong");
  const squareScale = 122;

  return (
    <PhaseOneVisualProof
      meta={proofConfig}
      activeStep={activeStep}
      steps={[
        { title: "Choose a point", body: "P lies on the unit circle at angle θ." },
        { title: "Read its coordinates", body: <>P = (cos θ, sin θ).</> },
        { title: "Drop projections", body: "The coordinates form perpendicular legs." },
        { title: "Build the triangle", body: "Its hypotenuse is the unit radius." },
        { title: "Compare square areas", body: "The leg squares have areas cos²θ and sin²θ." },
        { title: "Apply Pythagoras", body: <>cos²θ + sin²θ = 1².</> },
        { title: "Conclude", body: <>sin²θ + cos²θ = 1 for every θ.</> },
      ]}
      tools={<>
        <ToolButton title="Advance angle θ" subtitle="Rotate 15°; you can also drag the point" onClick={() => setTheta(value => (value + 15) % 360)} icon={<Target size={18} />} />
        <ToolButton title="Show projections" subtitle="Reveal horizontal and vertical components" active={projections} onClick={() => setProjections(v => !v)} icon={<Eye size={18} />} />
        <ToolButton title="Show squares" subtitle="Compare the two squared lengths" active={squares} onClick={() => setSquares(v => !v)} icon={<Square size={18} />} />
        <ToolButton title="Show grid" subtitle="Toggle coordinate grid lines" active={grid} onClick={() => setGrid(v => !v)} icon={<Grid3X3 size={18} />} />
        <ResetTool onClick={reset} />
        <ToolButton title={animation.playing ? "Pause animation" : "Animate proof"} subtitle="Watch the argument unfold" active={animation.playing} onClick={() => animation.playing ? animation.stop() : animation.start(6500)} icon={<Play size={18} />} />
      </>}
      result={<><h2>sin²θ + cos²θ = 1</h2><p>The squared projection lengths always fill the square on the unit radius.</p></>}
      challenge={<>
        <p>At θ = 53°, sin θ ≈ 0.799. What is cos²θ?</p>
        <div style={{display:"flex",gap:8}}><input value={answer} onChange={e => {setAnswer(e.target.value);setFeedback("idle");}} inputMode="decimal" aria-label="cosine squared answer" placeholder="0.000" /><button type="button" onClick={check}>Check</button></div>
        <Feedback state={feedback} />
      </>}
    >
      <MathRange label="Angle θ" value={theta} min={0} max={360} step={0.1} onChange={setTheta} display={`${theta.toFixed(1)}° · ${(angle / Math.PI).toFixed(2)}π`} />
      <svg className="phaseOneCanvas" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Interactive unit circle proving the Pythagorean identity" onPointerMove={updateFromPointer} onPointerUp={() => setDragging(false)} onPointerLeave={() => setDragging(false)}>
        {grid && Array.from({length:13},(_,i) => <g key={i}><line className="gridLine" x1={cx-300+i*50} y1="40" x2={cx-300+i*50} y2="525"/><line className="gridLine" x1="25" y1={cy-250+i*50} x2="835" y2={cy-250+i*50}/></g>)}
        <line className="axis" x1="45" y1={cy} x2="635" y2={cy}/><line className="axis" x1={cx} y1="45" x2={cx} y2="525"/>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="#6537f0" strokeWidth="2.5" />
        <path d={`M ${cx+58} ${cy} A 58 58 0 ${theta > 180 ? 1 : 0} 0 ${cx+58*Math.cos(angle)} ${cy-58*Math.sin(angle)}`} fill="none" stroke="#7a55f5" strokeWidth="3" />
        <line x1={cx} y1={cy} x2={point.x} y2={point.y} stroke="#27325e" strokeWidth="3" />
        {projections && <>
          <line x1={point.x} y1={point.y} x2={point.x} y2={cy} stroke="#079b8e" strokeWidth="4" strokeDasharray="7 5" />
          <line x1={cx} y1={cy} x2={point.x} y2={cy} stroke="#ef4838" strokeWidth="5" />
          <path d={`M ${point.x-16} ${cy} v-16 h16`} fill="none" stroke="#43517d" strokeWidth="2" />
          <text x={(cx+point.x)/2} y={cy+28} textAnchor="middle" className="mathText" fill="#ef4838">cos θ = {fixed(cos)}</text>
          <text x={point.x+18} y={(cy+point.y)/2} className="mathText" fill="#079b8e">sin θ = {fixed(sin)}</text>
        </>}
        <circle className="purple handle" cx={point.x} cy={point.y} r="10" tabIndex={0} role="slider" aria-label="Angle theta" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(theta)} onPointerDown={(e) => {e.currentTarget.setPointerCapture(e.pointerId);setDragging(true);}} onKeyDown={(e) => {if(e.key==="ArrowRight"||e.key==="ArrowUp")setTheta(v=>(v+1)%360);if(e.key==="ArrowLeft"||e.key==="ArrowDown")setTheta(v=>(v+359)%360);}} />
        <text x={point.x+16} y={point.y-18} className="mathText">P ({fixed(cos)}, {fixed(sin)})</text>
        <text x={cx+70} y={cy-18} fill="#5932ec">θ = {theta.toFixed(1)}°</text>
        <text x={cx+8} y={cy-95} className="mathText">1</text>
        {squares && <>
          <text x="675" y="76" textAnchor="middle" fontWeight="700" fill="#079b8e">Square on |sin θ|</text>
          <rect x={675-squareScale*Math.abs(sin)/2} y="92" width={squareScale*Math.abs(sin)} height={squareScale*Math.abs(sin)} fill="rgba(25,184,138,.16)" stroke="#079b8e" strokeWidth="2" strokeDasharray="5 4" />
          <text x="675" y={113+squareScale*Math.abs(sin)/2} textAnchor="middle" className="mathText" fill="#07865b">sin²θ = {fixed(sin*sin)}</text>
          <text x="675" y="292" textAnchor="middle" fontWeight="700" fill="#ef4838">Square on |cos θ|</text>
          <rect x={675-squareScale*Math.abs(cos)/2} y="308" width={squareScale*Math.abs(cos)} height={squareScale*Math.abs(cos)} fill="rgba(239,72,56,.14)" stroke="#ef4838" strokeWidth="2" strokeDasharray="5 4" />
          <text x="675" y={329+squareScale*Math.abs(cos)/2} textAnchor="middle" className="mathText" fill="#d73729">cos²θ = {fixed(cos*cos)}</text>
        </>}
        <rect x="575" y="472" width="250" height="62" rx="12" fill="#f3f0ff" stroke="#cfc6f8" />
        <text x="700" y="497" textAnchor="middle" className="mathText" fontSize="20">sin²θ + cos²θ</text>
        <text x="700" y="522" textAnchor="middle" fontWeight="700" fill="#5431df">{fixed(sin*sin)} + {fixed(cos*cos)} = {(sin*sin+cos*cos).toFixed(3)}</text>
      </svg>
      <div style={{display:"flex",gap:18,flexWrap:"wrap",padding:"0 8px 6px"}}><Toggle label="Show projections" checked={projections} onChange={setProjections}/><Toggle label="Show squares" checked={squares} onChange={setSquares}/><Toggle label="Show grid" checked={grid} onChange={setGrid}/></div>
    </PhaseOneVisualProof>
  );
}
