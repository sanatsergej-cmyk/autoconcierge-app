import type { Station } from "../types";

interface CrimeaMapProps {
  stations: Station[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

const STATUS_COLOR: Record<string, string> = {
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
};
const NO_DATA_COLOR = "#606080";

export function CrimeaMap({ stations, selectedId, onSelect }: CrimeaMapProps) {
  return (
    <div className="card p-4">
      <svg viewBox="0 0 400 260" className="w-full h-auto" style={{ maxHeight: 320 }}>
        <path
          d="M70,30 Q120,20 160,25 Q200,30 230,55 Q270,60 300,70 Q345,80 375,110 Q365,130 340,130 Q310,140 290,120 Q270,135 255,150 Q225,175 190,195 Q170,210 150,205 Q115,195 95,175 Q60,150 35,120 Q25,90 40,70 Q50,45 70,30 Z"
          fill="rgba(74,158,255,0.06)"
          stroke="rgba(74,158,255,0.35)"
          strokeWidth={1.5}
        />

        {stations.map((s) => {
          const color = s.status ? STATUS_COLOR[s.status] : NO_DATA_COLOR;
          const isSelected = s.id === selectedId;
          const r = isSelected ? 9 : 6.5;

          return (
            <g
              key={s.id}
              onClick={() => onSelect(s.id)}
              style={{ cursor: "pointer" }}
            >
              {s.status && s.status_confirmed && (
                <circle cx={s.map_x} cy={s.map_y} r={r + 5} fill={color} opacity={0.25}>
                  <animate attributeName="r" values={`${r + 5};${r + 10};${r + 5}`} dur="2.2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.35;0;0.35" dur="2.2s" repeatCount="indefinite" />
                </circle>
              )}
              <circle
                cx={s.map_x}
                cy={s.map_y}
                r={r}
                fill={color}
                stroke={isSelected ? "#fff" : "none"}
                strokeWidth={isSelected ? 2 : 0}
              />
              <text
                x={s.map_x}
                y={s.map_y - r - 4}
                textAnchor="middle"
                fontSize={9}
                fill={isSelected ? "#fff" : "#a0a0c0"}
                fontFamily="Inter, sans-serif"
                fontWeight={isSelected ? 700 : 400}
              >
                {s.city}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex gap-3 flex-wrap mt-3 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLOR.green }} />есть топливо</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLOR.yellow }} />очередь/лимит</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: STATUS_COLOR.red }} />нет топлива</span>
        <span className="flex items-center gap-1"><i className="w-2 h-2 rounded-full inline-block" style={{ background: NO_DATA_COLOR }} />нет данных</span>
      </div>
    </div>
  );
}
