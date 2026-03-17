import type { CarState } from "../types";

interface CarStatusProps {
  car: CarState;
}

function StatusBar({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className="flex items-center gap-3 w-full">
      <span className="text-lg w-6 text-center">{icon}</span>
      <div className="flex-1">
        <div className="flex justify-between text-xs mb-1">
          <span className="opacity-70">{label}</span>
          <span className="font-medium">{value}%</span>
        </div>
        <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${value}%`,
              backgroundColor: value > 60 ? color : value > 30 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export function CarStatus({ car }: CarStatusProps) {
  return (
    <div className="w-full max-w-sm mx-auto mt-6 space-y-3 px-2">
      <StatusBar label="Чистота" value={car.cleanliness} icon="🧽" color="#3b82f6" />
      <StatusBar label="Топливо" value={car.fuel} icon="⛽" color="#22c55e" />
      <StatusBar label="Здоровье" value={car.health} icon="❤️" color="#ef4444" />

      {/* Alerts */}
      <div className="space-y-2 mt-3">
        {car.needsOilChange && (
          <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 text-sm">
            <span>🛢️</span>
            <span>Пора менять масло</span>
          </div>
        )}
        {car.needsTires && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm">
            <span>🔄</span>
            <span>Сезонная замена шин</span>
          </div>
        )}
        {car.cleanliness < 30 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-3 py-2 text-sm animate-pulse">
            <span>💧</span>
            <span>Машина просит мойку!</span>
          </div>
        )}
      </div>
    </div>
  );
}
