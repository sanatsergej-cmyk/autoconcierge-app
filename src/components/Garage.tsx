import type { CarState } from "../types";

interface GarageProps {
  car: CarState;
  onTapCar: () => void;
}

export function Garage({ car, onTapCar }: GarageProps) {
  const dirtOpacity = Math.max(0, (100 - car.cleanliness) / 100);
  const isHappy = car.mood === "happy";
  const isSad = car.mood === "sad" || car.mood === "angry";

  const moodEmoji = { happy: "😊", normal: "😐", sad: "😟", angry: "😠" }[car.mood];

  const daysSinceWash = Math.floor((Date.now() - car.lastWash) / (1000 * 60 * 60 * 24));

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

  return (
    <div className="relative w-full max-w-sm mx-auto" onClick={onTapCar}>
      {/* Speech bubble */}
      <div className="absolute -top-1 left-1/2 -translate-x-1/2 z-10 card-glow px-4 py-2 text-sm font-medium text-center min-w-[180px] transition-all duration-500"
        style={{ borderRadius: 16 }}>
        {speechText}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45"
          style={{ background: "var(--bg-card)", borderRight: "1px solid rgba(74,158,255,0.2)", borderBottom: "1px solid rgba(74,158,255,0.2)" }} />
      </div>

      {/* Car scene */}
      <div className="relative mt-14">
        {/* Glow under car */}
        <div
          className="absolute bottom-4 left-1/2 -translate-x-1/2 w-64 h-16 rounded-full blur-2xl"
          style={{ background: `${car.color}33` }}
        />

        <svg
          viewBox="0 0 400 220"
          className={`w-full transition-transform duration-300 cursor-pointer select-none ${isHappy ? "animate-bounce-gentle" : ""} ${isSad ? "animate-shake" : ""}`}
        >
          {/* Road surface */}
          <rect x="0" y="195" width="400" height="25" fill="rgba(255,255,255,0.03)" rx="5" />
          <line x1="20" y1="207" x2="60" y2="207" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4" />
          <line x1="100" y1="207" x2="180" y2="207" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4" />
          <line x1="220" y1="207" x2="300" y2="207" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4" />
          <line x1="340" y1="207" x2="380" y2="207" stroke="rgba(255,255,255,0.08)" strokeWidth="2" strokeDasharray="4" />

          {/* Shadow */}
          <ellipse cx="200" cy="197" rx="150" ry="10" fill="rgba(0,0,0,0.4)" />

          {/* Car body */}
          <g>
            {/* Lower body */}
            <rect x="45" y="110" width="310" height="68" rx="14" fill={car.color} />
            {/* Hood */}
            <path d="M45,128 L45,110 Q45,97 58,97 L140,97 L140,128 Z" fill={car.color} />
            {/* Roof */}
            <path d="M122,97 L157,47 Q162,40 172,40 L258,40 Q268,40 273,47 L308,97 Z" fill={car.color} />
            {/* Gloss */}
            <path d="M122,97 L157,47 Q162,40 172,40 L258,40 Q268,40 273,47 L308,97 Z" fill="url(#carGloss)" opacity="0.4" />
            {/* Side highlight */}
            <rect x="50" y="112" width="300" height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />

            {/* Windows */}
            <path d="M162,52 L145,90 L212,90 L212,52 Z" fill="#1a2740" opacity="0.9" />
            <path d="M222,52 L222,90 L296,90 L278,52 Z" fill="#1a2740" opacity="0.9" />
            {/* Window glare */}
            <path d="M167,57 L158,78 L174,78 L179,57 Z" fill="rgba(100,180,255,0.15)" />
            <path d="M228,57 L228,76 L246,76 L242,57 Z" fill="rgba(100,180,255,0.15)" />
            {/* Window divider */}
            <rect x="213" y="45" width="8" height="47" rx="3" fill={car.color} />
            {/* Mirror */}
            <ellipse cx="138" cy="92" rx="8" ry="5" fill={car.color} />

            {/* Headlights — glowing */}
            <rect x="47" y="117" width="24" height="14" rx="6" fill="#FFD700" opacity="0.9" />
            <rect x="47" y="117" width="24" height="14" rx="6" fill="url(#lightGlow)" />
            <rect x="329" y="117" width="24" height="14" rx="6" fill="#FF3333" opacity="0.7" />

            {/* Door handle */}
            <rect x="230" y="117" width="20" height="4" rx="2" fill="rgba(255,255,255,0.15)" />

            {/* Bumpers */}
            <rect x="35" y="163" width="75" height="10" rx="5" fill="rgba(255,255,255,0.05)" />
            <rect x="290" y="163" width="75" height="10" rx="5" fill="rgba(255,255,255,0.05)" />
          </g>

          {/* Wheels */}
          <g>
            {[110, 290].map((cx) => (
              <g key={cx}>
                <circle cx={cx} cy="178" r="30" fill="#111" />
                <circle cx={cx} cy="178" r="22" fill="#2a2a3a" />
                <circle cx={cx} cy="178" r="7" fill="#444" />
                {[0, 72, 144, 216, 288].map((angle) => (
                  <line
                    key={`${cx}-${angle}`}
                    x1={cx + 8 * Math.cos((angle * Math.PI) / 180)}
                    y1={178 + 8 * Math.sin((angle * Math.PI) / 180)}
                    x2={cx + 20 * Math.cos((angle * Math.PI) / 180)}
                    y2={178 + 20 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#555"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            ))}
          </g>

          {/* Dirt */}
          {dirtOpacity > 0.1 && (
            <g opacity={dirtOpacity * 0.8}>
              {[[80,140,10],[155,155,14],[255,137,12],[322,150,11],[185,168,9],[105,122,8],[345,130,7],[60,158,7],[275,165,8]].map(
                ([cx, cy, r], i) => (
                  <circle key={i} cx={cx} cy={cy} r={r! * (0.5 + dirtOpacity * 0.5)} fill="#5a4a35" opacity={0.3 + dirtOpacity * 0.4} />
                ),
              )}
            </g>
          )}

          {/* Sparkle when clean */}
          {car.cleanliness > 90 && (
            <g className="animate-float">
              <text x="55" y="75" fontSize="16" opacity="0.8">✨</text>
              <text x="325" y="65" fontSize="13" opacity="0.6">✨</text>
              <text x="195" y="28" fontSize="14" opacity="0.7">✨</text>
            </g>
          )}

          {/* Status indicators */}
          {car.fuel < 20 && <text x="45" y="88" fontSize="20" className="animate-pulse">⛽</text>}
          {car.health < 50 && <text x="340" y="75" fontSize="20" className="animate-pulse">🔧</text>}
          {car.needsOilChange && <text x="188" y="22" fontSize="16" className="animate-pulse">🛢️</text>}

          <defs>
            <linearGradient id="carGloss" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.5" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <radialGradient id="lightGlow">
              <stop offset="0%" stopColor="#FFD700" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Info */}
      <div className="text-center mt-1 space-y-0.5">
        <div className="text-base font-bold">{car.brand} {car.model} {car.year}</div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {car.mileage.toLocaleString()} км
          {daysSinceWash > 0 && ` · мойка ${daysSinceWash} дн. назад`}
        </div>
        <div className="text-[10px]" style={{ color: "var(--text-muted)", opacity: 0.5 }}>нажми — сменить цвет</div>
      </div>
    </div>
  );
}
