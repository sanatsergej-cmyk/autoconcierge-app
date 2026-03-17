import type { CarState } from "../types";

interface CarStatusProps {
  car: CarState;
}

function StatusBar({ label, value, icon, gradient }: {
  label: string;
  value: number;
  icon: string;
  gradient: string;
}) {
  const barColor = value > 60 ? gradient : value > 30 ? "linear-gradient(90deg, #f59e0b, #ef4444)" : "linear-gradient(90deg, #ef4444, #dc2626)";

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm"
        style={{ background: "rgba(255,255,255,0.05)" }}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span style={{ color: "var(--text-secondary)" }}>{label}</span>
          <span className="font-bold">{Math.round(value)}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${value}%`, background: barColor }}
          />
        </div>
      </div>
    </div>
  );
}

export function CarStatus({ car }: CarStatusProps) {
  return (
    <div className="w-full max-w-sm mx-auto mt-5 space-y-3 px-1">
      <StatusBar label="Чистота" value={car.cleanliness} icon="🧽" gradient="linear-gradient(90deg, #3b82f6, #6366f1)" />
      <StatusBar label="Топливо" value={car.fuel} icon="⛽" gradient="linear-gradient(90deg, #22c55e, #06b6d4)" />
      <StatusBar label="Здоровье" value={car.health} icon="❤️" gradient="linear-gradient(90deg, #ef4444, #ec4899)" />

      {/* Alerts */}
      {(car.needsOilChange || car.needsTires || car.cleanliness < 30) && (
        <div className="space-y-2 mt-2">
          {car.needsOilChange && (
            <div className="card flex items-center gap-2 px-3 py-2.5 text-sm"
              style={{ borderColor: "rgba(245,158,11,0.3)" }}>
              <span>🛢️</span>
              <span style={{ color: "var(--text-secondary)" }}>Пора менять масло</span>
            </div>
          )}
          {car.needsTires && (
            <div className="card flex items-center gap-2 px-3 py-2.5 text-sm"
              style={{ borderColor: "rgba(59,130,246,0.3)" }}>
              <span>🔄</span>
              <span style={{ color: "var(--text-secondary)" }}>Замена шин</span>
            </div>
          )}
          {car.cleanliness < 30 && (
            <div className="card flex items-center gap-2 px-3 py-2.5 text-sm animate-pulse"
              style={{ borderColor: "rgba(239,68,68,0.3)" }}>
              <span>💧</span>
              <span style={{ color: "var(--text-secondary)" }}>Машина просит мойку!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
