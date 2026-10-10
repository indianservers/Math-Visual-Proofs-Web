"use client";
import { useState } from "react";
import { useProofCanvas } from "../../../components/useProofCanvas";

export default function Proof() {
  const [radius, setRadius] = useState(3);
  const [angle, setAngle] = useState(Math.PI / 4);
  const cx = 400, cy = 240, scale = 48;
  const x = cx + radius * scale * Math.cos(angle), y = cy - radius * scale * Math.sin(angle);
  const canvas = useProofCanvas<"point">(800, 480, (_, point) => setAngle(Math.atan2(cy - point.y, point.x - cx)));
  return <section style={{height:"100%",overflow:"auto",padding:20,background:"white",borderRadius:16}}>
    <h2>A circle is every point at the same distance from its center.</h2>
    <p>Drag P around the circle. Its distance from O stays equal to r.</p>
    <label>Radius r = {radius}<input aria-label="Circle radius" type="range" min="1" max="4" step="0.1" value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label>
    <svg viewBox="0 0 800 480" style={{width:"100%",maxHeight:"65vh",touchAction:"none"}} {...canvas.canvasProps}>
      <line x1="80" y1={cy} x2="720" y2={cy} stroke="#c6cce0" /><line x1={cx} y1="20" x2={cx} y2="460" stroke="#c6cce0" />
      <circle cx={cx} cy={cy} r={radius*scale} fill="#f2efff" stroke="#6741df" strokeWidth="3" />
      <path d={`M${cx},${cy} H${x} V${y}`} fill="none" stroke="#9099b0" strokeDasharray="5 5" />
      <line x1={cx} y1={cy} x2={x} y2={y} stroke="#f29337" strokeWidth="3" />
      <circle cx={cx} cy={cy} r="5" fill="#172153" /><text x={cx-20} y={cy+24}>O</text>
      <text x={(x+cx)/2+10} y={(y+cy)/2}>r = {radius}</text>
      <circle data-testid="circle-locus-point" cx={x} cy={y} r="12" fill="#ed5277" stroke="white" strokeWidth="3" tabIndex={0} role="slider" aria-label="Point angle" aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(((angle*180/Math.PI)%360+360)%360)} onPointerDown={(event)=>canvas.beginDrag("point",event)} onKeyDown={(event)=>{if(event.key==="ArrowRight"||event.key==="ArrowLeft"){event.preventDefault();setAngle(angle+(event.key==="ArrowRight"?1:-1)*Math.PI/36)}}} />
      <text x={x+18} y={y-12}>P</text>
    </svg>
    <p><b>x² + y² = r²</b> · ({(radius*Math.cos(angle)).toFixed(2)})² + ({(radius*Math.sin(angle)).toFixed(2)})² = {(radius*radius).toFixed(2)}</p>
    <p>The horizontal and vertical distances form a right triangle. The Pythagorean theorem gives the circle equation.</p>
  </section>;
}