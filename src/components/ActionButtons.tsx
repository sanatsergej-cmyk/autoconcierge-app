import type { CarState } from "../types";

interface ActionButtonsProps {
  car: CarState;
  onWash: () => void;
  onFuel: () => void;
  onService: () => void;
  onTires: () => void;
}

interface ActionBtnProps {
  icon: string;
  label: string;
  reward: string;
  onClick: () => void;
  urgent?: boolean;
  disabled?: boolean;
  gradient: string;
}

function ActionBtn({ icon, label, reward, onClick, urgent, disabled, gradient }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center
        rounded-2xl p-3 min-w-[76px] relative overflow-hidden
        transition-all duration-200 active:scale-90
        ${disabled ? "opacity-25 pointer-events-none" : ""}
      `}
      style={{
        background: urgent ? gradient : "var(--bg-card)",
        border: urgent ? "none" : "1px solid rgba(255,255,255,0.06)",
        boxShadow: urgent ? "0 4px 15px rgba(0,0,0,0.3)" : "none",
      }}
    >
      {urgent && <div className="absolute inset-0 shimmer" />}
      <span className={`text-2xl relative z-10 ${urgent ? "animate-bounce" : ""}`}>{icon}</span>
      <span className="text-[11px] font-bold mt-1 relative z-10">{label}</span>
      <span className="text-[9px] relative z-10" style={{ color: urgent ? "rgba(255,255,255,0.7)" : "var(--text-muted)" }}>
        {reward}
      </span>
    </button>
  );
}

export function ActionButtons({ car, onWash, onFuel, onService, onTires }: ActionButtonsProps) {
  return (
    <div className="px-4 mt-4">
      <div className="flex gap-2 justify-center">
        <ActionBtn
          icon="🚿" label="Мойка" reward="+50 🪙"
          onClick={onWash}
          urgent={car.cleanliness < 40}
          disabled={car.cleanliness >= 95}
          gradient="linear-gradient(135deg, #3b82f6, #6366f1)"
        />
        <ActionBtn
          icon="⛽" label="Заправка" reward="+30 🪙"
          onClick={onFuel}
          urgent={car.fuel < 20}
          disabled={car.fuel >= 95}
          gradient="linear-gradient(135deg, #22c55e, #06b6d4)"
        />
        <ActionBtn
          icon="🔧" label="Сервис" reward="+100 🪙"
          onClick={onService}
          urgent={car.health < 50 || car.needsOilChange}
          disabled={car.health >= 95 && !car.needsOilChange}
          gradient="linear-gradient(135deg, #ef4444, #ec4899)"
        />
        <ActionBtn
          icon="🛞" label="Шины" reward="+75 🪙"
          onClick={onTires}
          urgent={car.needsTires}
          disabled={!car.needsTires}
          gradient="linear-gradient(135deg, #f59e0b, #ef4444)"
        />
      </div>
    </div>
  );
}
