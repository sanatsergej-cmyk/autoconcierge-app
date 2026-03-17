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
  sublabel: string;
  onClick: () => void;
  urgent?: boolean;
  disabled?: boolean;
}

function ActionBtn({ icon, label, sublabel, onClick, urgent, disabled }: ActionBtnProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex flex-col items-center justify-center
        rounded-2xl p-3 min-w-[80px]
        transition-all duration-200 active:scale-95
        ${urgent
          ? "bg-red-50 border-2 border-red-300 shadow-md shadow-red-100"
          : "bg-gray-50 border border-gray-200"
        }
        ${disabled ? "opacity-40 pointer-events-none" : ""}
      `}
    >
      <span className={`text-2xl ${urgent ? "animate-bounce" : ""}`}>{icon}</span>
      <span className="text-xs font-semibold mt-1">{label}</span>
      <span className="text-[10px] opacity-50">{sublabel}</span>
    </button>
  );
}

export function ActionButtons({ car, onWash, onFuel, onService, onTires }: ActionButtonsProps) {
  return (
    <div className="px-4 mt-4">
      <div className="flex gap-2 justify-center flex-wrap">
        <ActionBtn
          icon="🚿"
          label="Мойка"
          sublabel="+50 монет"
          onClick={onWash}
          urgent={car.cleanliness < 40}
          disabled={car.cleanliness >= 95}
        />
        <ActionBtn
          icon="⛽"
          label="Заправка"
          sublabel="+30 монет"
          onClick={onFuel}
          urgent={car.fuel < 20}
          disabled={car.fuel >= 95}
        />
        <ActionBtn
          icon="🔧"
          label="Сервис"
          sublabel="+100 монет"
          onClick={onService}
          urgent={car.health < 50 || car.needsOilChange}
          disabled={car.health >= 95 && !car.needsOilChange}
        />
        <ActionBtn
          icon="🛞"
          label="Шины"
          sublabel="+75 монет"
          onClick={onTires}
          urgent={car.needsTires}
          disabled={!car.needsTires}
        />
      </div>
    </div>
  );
}
