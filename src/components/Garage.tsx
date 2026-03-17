import { useState } from "react";
import type { CarState } from "../types";

interface GarageProps {
  car: CarState;
  onTapCar: () => void;
}

// IMAGIN.studio free API for real car renders
function getCarImageUrl(car: CarState, angle = 23): string {
  const model = car.model.toLowerCase().replace(/\s+/g, "-");
  return `https://cdn.imagin.studio/getImage?customer=img&make=${encodeURIComponent(car.brand)}&modelFamily=${encodeURIComponent(model)}&modelYear=${car.year}&angle=${angle}&paintId=pspc0${getColorCode(car.color)}`;
}

function getColorCode(hex: string): string {
  const map: Record<string, string> = {
    "#1a1a2e": "020", // black
    "#e8e8e8": "085", // white
    "#a0a0b0": "032", // silver
    "#c0392b": "071", // red
    "#2980b9": "048", // blue
    "#1a3a5c": "093", // dark blue
    "#27ae60": "056", // green
    "#6b2d5b": "074", // burgundy
    "#e67e22": "064", // orange
    "#f1c40f": "060", // yellow
    "#5a5a6a": "030", // grey
    "#c4a574": "023", // beige
  };
  return map[hex] ?? "020";
}

export function Garage({ car, onTapCar }: GarageProps) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [floatingCoins, setFloatingCoins] = useState<Array<{ id: number; x: number; y: number }>>([]);

  const isHappy = car.mood === "happy";
  const isSad = car.mood === "sad" || car.mood === "angry";
  const dirtOpacity = Math.max(0, (100 - car.cleanliness) / 100);
  const daysSinceWash = Math.floor((Date.now() - car.lastWash) / (1000 * 60 * 60 * 24));

  const moodEmoji = { happy: "😊", normal: "😐", sad: "😟", angry: "😠" }[car.mood];

  const speechText = (() => {
    if (car.cleanliness < 20) return "Помой меня!!! 🥺";
    if (car.cleanliness < 40) return "Я грязная... 💧";
    if (car.fuel < 15) return "Заправь меня! ⛽";
    if (car.health < 30) return "Мне плохо! 🏥";
    if (car.health < 50) return "Нужен сервис 🔧";
    if (car.needsOilChange) return "Масло пора менять! 🛢️";
    if (isHappy) return "Мне супер! 🎉";
    if (car.cleanliness > 90 && car.fuel > 80) return "Я сияю! ✨";
    return `${car.brand} ${car.model} ${moodEmoji}`;
  })();

  const handleTap = (e: React.MouseEvent | React.TouchEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0]!.clientX : (e as React.MouseEvent).clientX;
    const clientY = "touches" in e ? e.touches[0]!.clientY : (e as React.MouseEvent).clientY;
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    setFloatingCoins((prev) => [...prev, { id: Date.now(), x, y }]);
    setTimeout(() => setFloatingCoins((prev) => prev.slice(1)), 1200);
    onTapCar();
  };

  const imageUrl = getCarImageUrl(car);

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Speech bubble */}
      <div className="card-glow px-4 py-2.5 text-sm font-medium text-center mx-auto w-fit min-w-[180px] mb-3 relative"
        style={{ borderRadius: 16 }}>
        {speechText}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: "var(--bg-card)", borderRight: "1px solid rgba(74,158,255,0.2)", borderBottom: "1px solid rgba(74,158,255,0.2)" }} />
      </div>

      {/* Car scene */}
      <div
        className={`relative cursor-pointer select-none transition-transform duration-300 ${isHappy ? "animate-bounce-gentle" : ""} ${isSad ? "animate-shake" : ""}`}
        onClick={handleTap}
      >
        {/* Glow under car */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 w-72 h-20 rounded-full blur-3xl opacity-40"
          style={{ background: `radial-gradient(ellipse, ${car.color}88, transparent)` }}
        />

        {/* Real car image */}
        {!imgError && (
          <img
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            className={`w-full max-h-[200px] object-contain relative z-10 transition-opacity duration-500 drop-shadow-2xl ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
            onError={() => setImgError(true)}
            draggable={false}
          />
        )}

        {/* Fallback SVG if image fails */}
        {(imgError || !imgLoaded) && (
          <svg viewBox="0 0 400 200" className={`w-full ${imgLoaded && !imgError ? "hidden" : ""}`} style={{ maxHeight: 180 }}>
            <ellipse cx="200" cy="185" rx="150" ry="10" fill="rgba(0,0,0,0.3)" />
            <rect x="45" y="100" width="310" height="65" rx="14" fill={car.color} />
            <path d="M45,118 L45,100 Q45,87 58,87 L140,87 L140,118 Z" fill={car.color} />
            <path d="M122,87 L157,40 Q162,33 172,33 L258,33 Q268,33 273,40 L308,87 Z" fill={car.color} />
            <path d="M162,45 L145,82 L212,82 L212,45 Z" fill="#1a2740" opacity="0.9" />
            <path d="M222,45 L222,82 L296,82 L278,45 Z" fill="#1a2740" opacity="0.9" />
            <circle cx="110" cy="168" r="26" fill="#111" />
            <circle cx="110" cy="168" r="16" fill="#2a2a3a" />
            <circle cx="290" cy="168" r="26" fill="#111" />
            <circle cx="290" cy="168" r="16" fill="#2a2a3a" />
            <rect x="47" y="107" width="22" height="12" rx="5" fill="#FFD700" opacity="0.8" />
            <rect x="331" y="107" width="22" height="12" rx="5" fill="#FF3333" opacity="0.7" />
          </svg>
        )}

        {/* Dirt overlay on image */}
        {dirtOpacity > 0.15 && imgLoaded && !imgError && (
          <div className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at 30% 60%, rgba(90,74,53,${dirtOpacity * 0.3}), transparent 60%),
                           radial-gradient(ellipse at 70% 50%, rgba(90,74,53,${dirtOpacity * 0.25}), transparent 50%)`,
            }}
          />
        )}

        {/* Sparkles when clean */}
        {car.cleanliness > 90 && (
          <div className="absolute inset-0 z-20 pointer-events-none animate-float">
            <div className="absolute top-4 left-8 text-lg">✨</div>
            <div className="absolute top-8 right-12 text-sm">✨</div>
            <div className="absolute bottom-12 left-1/2 text-base">✨</div>
          </div>
        )}

        {/* Status indicators */}
        <div className="absolute top-2 left-0 right-0 z-20 pointer-events-none flex justify-between px-4">
          {car.fuel < 20 && <span className="text-xl animate-pulse">⛽</span>}
          {car.fuel >= 20 && <span />}
          {car.health < 50 && <span className="text-xl animate-pulse">🔧</span>}
          {car.needsOilChange && car.health >= 50 && <span className="text-lg animate-pulse">🛢️</span>}
        </div>

        {/* Floating coins on tap */}
        {floatingCoins.map((coin) => (
          <div
            key={coin.id}
            className="absolute z-30 pointer-events-none text-sm font-bold"
            style={{
              left: coin.x,
              top: coin.y,
              color: "#f59e0b",
              animation: "float-up 1.2s ease-out forwards",
            }}
          >
            +🪙
          </div>
        ))}
      </div>

      {/* Road */}
      <div className="w-full h-2 rounded-full mt-1" style={{ background: "rgba(255,255,255,0.03)" }}>
        <div className="flex justify-around items-center h-full px-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-6 h-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)" }} />
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="text-center mt-3 space-y-0.5">
        <div className="text-base font-bold">{car.brand} {car.model} {car.year}</div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {car.mileage.toLocaleString()} км
          {daysSinceWash > 0 && ` · мойка ${daysSinceWash} дн. назад`}
        </div>
        <div className="text-[10px]" style={{ color: "var(--text-muted)", opacity: 0.4 }}>нажми — сменить цвет</div>
      </div>

      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-60px) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
