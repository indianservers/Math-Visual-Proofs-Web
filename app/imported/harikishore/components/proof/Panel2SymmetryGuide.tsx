import React from 'react';
import { Info, Check } from 'lucide-react';
import { SHAPES_DATA } from '../../data/shapesData';
import { ShapeDefinition, ShapeId } from '../../types';
import { sound } from '../../utils/sound';

interface Panel2Props {
  selectedShape: ShapeDefinition;
  onSelectShape: (shape: ShapeDefinition) => void;
}

const TABLE_ROWS: { id: ShapeId; name: string; lines: number; order: number }[] = [
  { id: 'triangle', name: 'Equilateral Triangle', lines: 3, order: 3 },
  { id: 'square', name: 'Square', lines: 4, order: 4 },
  { id: 'pentagon', name: 'Regular Pentagon', lines: 5, order: 5 },
  { id: 'hexagon', name: 'Regular Hexagon', lines: 6, order: 6 },
  { id: 'octagon', name: 'Regular Octagon', lines: 8, order: 8 },
  { id: 'rectangle', name: 'Rectangle', lines: 2, order: 2 },
];

export const Panel2SymmetryGuide: React.FC<Panel2Props> = ({
  selectedShape,
  onSelectShape,
}) => {
  const handleRowClick = (id: ShapeId) => {
    sound.playClick();
    const shape = SHAPES_DATA[id as Exclude<ShapeId, 'custom'>];
    if (shape) onSelectShape(shape);
  };

  return (
    <div className="bg-white rounded-3xl p-5 md:p-6 border border-indigo-100/80 shadow-sm flex flex-col justify-between space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <span className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-extrabold shadow-sm">
            2
          </span>
          <h2 className="text-base md:text-lg font-extrabold text-slate-900 tracking-tight font-sans">
            Symmetry Guide
          </h2>
        </div>
        <p className="text-xs text-slate-500 font-medium ml-8 mt-0.5">
          Compare regular shapes and rectangles.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-2xl border border-indigo-100/80">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-indigo-50/50 text-[11px] font-bold text-slate-700 uppercase tracking-wider border-b border-indigo-100/80">
              <th className="py-2.5 px-3 md:px-4">Shape</th>
              <th className="py-2.5 px-2 md:px-3 text-center">
                Line Symmetry <br />
                <span className="text-[9px] font-normal text-slate-500 lowercase">(mirrors)</span>
              </th>
              <th className="py-2.5 px-2 md:px-3 text-center">
                Rotational Symmetry <br />
                <span className="text-[9px] font-normal text-slate-500 lowercase">(order)</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-50/80 text-xs">
            {TABLE_ROWS.map((row) => {
              const shapeDef = SHAPES_DATA[row.id as Exclude<ShapeId, 'custom'>];
              const isSelected = selectedShape.id === row.id;

              return (
                <tr
                  key={row.id}
                  onClick={() => handleRowClick(row.id)}
                  className={`cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-indigo-50/80 font-bold border-l-4 border-l-indigo-600 text-indigo-950'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  {/* Shape Name with mini icon */}
                  <td className="py-2 px-3 md:px-4 flex items-center gap-2.5">
                    <div className="w-5 h-5 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" viewBox="0 0 40 40">
                        <polygon
                          points={
                            row.id === 'triangle'
                              ? '20,6 36,34 4,34'
                              : row.id === 'square'
                              ? '8,8 32,8 32,32 8,32'
                              : row.id === 'pentagon'
                              ? '20,6 34,16 29,32 11,32 6,16'
                              : row.id === 'hexagon'
                              ? '20,6 32,13 32,27 20,34 8,27 8,13'
                              : row.id === 'octagon'
                              ? '20,6 30,10 34,20 30,30 20,34 10,30 6,20 10,10'
                              : '6,12 34,12 34,28 6,28'
                          }
                          fill={shapeDef.fillColor}
                          stroke={shapeDef.strokeColor}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <span className="text-[11px] font-semibold">{row.name}</span>
                  </td>

                  {/* Line Symmetry Count */}
                  <td className="py-2 px-2 md:px-3 text-center font-bold text-slate-800">
                    <span className={`inline-block px-2 py-0.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : ''}`}>
                      {row.lines}
                    </span>
                  </td>

                  {/* Rotational Symmetry Order */}
                  <td className="py-2 px-2 md:px-3 text-center font-bold text-slate-800">
                    <span className={`inline-block px-2 py-0.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : ''}`}>
                      {row.order}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Info Footnote */}
      <div className="flex items-start gap-2 text-indigo-700 bg-indigo-50/40 p-3 rounded-2xl border border-indigo-100/60">
        <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
        <p className="text-[11px] text-slate-600 leading-tight">
          <strong className="text-indigo-900">Rotational order</strong> means how many times a shape matches itself in a full 360° turn.
        </p>
      </div>
    </div>
  );
};
