import React from 'react';
import { Info, Check, X } from 'lucide-react';
import { TILES_LIST, TILES_DATA, TileDefinition } from '../../data/tessellationsData';
import { sound } from '../../utils/sound';

interface Panel2Props {
  selectedTile: TileDefinition;
  onSelectTile: (tile: TileDefinition) => void;
}

export const Panel2TessellationGuide: React.FC<Panel2Props> = ({
  selectedTile,
  onSelectTile,
}) => {
  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-emerald-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Tessellation Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Vertex-angle condition: 360° must be divisible by interior angle θ.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-emerald-100/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-emerald-50/50 text-[10px] font-bold text-slate-700 uppercase tracking-wider border-b border-emerald-100/80">
              <th className="py-2.5 px-3">Shape</th>
              <th className="py-2.5 px-2 text-center">Interior Angle (θ)</th>
              <th className="py-2.5 px-2 text-center">360° / θ</th>
              <th className="py-2.5 px-2 text-center">Tessellates?</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-emerald-50/80 text-xs">
            {TILES_LIST.map((tile) => {
              const isSelected = selectedTile.id === tile.id;
              const ratio = (360 / tile.interiorAngle).toFixed(2);
              const isInteger = 360 % tile.interiorAngle === 0;

              return (
                <tr
                  key={tile.id}
                  onClick={() => {
                    sound.playClick();
                    onSelectTile(tile);
                  }}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-emerald-50/80 font-bold border-l-4 border-l-emerald-600 text-emerald-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <td className="py-2 px-3 flex items-center gap-2">
                    <div className="w-4 h-4 flex items-center justify-center shrink-0">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 40 40">
                        <polygon
                          points={tile.previewPoints}
                          fill={tile.fillColor}
                          stroke={tile.strokeColor}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold">{tile.name}</span>
                  </td>

                  <td className="py-2 px-2 text-center font-mono font-bold text-slate-800">
                    {tile.interiorAngle}°
                  </td>

                  <td className="py-2 px-2 text-center font-mono font-semibold text-slate-600">
                    {isInteger ? (360 / tile.interiorAngle).toString() : ratio}
                  </td>

                  <td className="py-2 px-2 text-center">
                    {tile.canTessellateRegularly ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        <Check className="w-3 h-3 text-emerald-600" /> Yes
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold">
                        <X className="w-3 h-3 text-rose-600" /> No
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-emerald-800 bg-emerald-50/40 p-3 rounded-2xl border border-emerald-100/60">
        <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-emerald-950">Regular Tessellation Rule:</strong> Only regular polygons whose interior angle divides 360° evenly (triangles 60°, squares 90°, hexagons 120°) can tessellate the plane alone.
        </p>
      </div>
    </div>
  );
};
