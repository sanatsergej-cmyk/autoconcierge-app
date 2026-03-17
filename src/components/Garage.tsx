import type { CarState } from "../types";

interface GarageProps {
  car: CarState;
  onTapCar: () => void;
}

export function Garage({ car, onTapCar }: GarageProps) {
  const dirtOpacity = Math.max(0, (100 - car.cleanliness) / 100);
  const isHappy = car.mood === "happy";
  const isSad = car.mood === "sad" || car.mood === "angry";

  const moodEmoji = {
    happy: "😊",
    normal: "😐",
    sad: "😟",
    angry: "😠",
  }[car.mood];

  const daysSinceWash = Math.floor(
    (Date.now() - car.lastWash) / (1000 * 60 * 60 * 24),
  );

  const speechText = (() => {
    if (car.cleanliness < 20) return "Помой меня немедленно! 🥺";
    if (car.cleanliness < 40) return "Я такая грязная... 💧";
    if (car.fuel < 15) return "Бензин почти на нуле! ⛽";
    if (car.health < 30) return "Мне очень плохо... 🏥";
    if (car.health < 50) return "Пора на СТО 🔧";
    if (car.needsOilChange) return "Масло пора менять! 🛢️";
    if (isHappy) return "Мне отлично! Спасибо! 🎉";
    if (car.cleanliness > 90 && car.fuel > 80) return "Я в идеале! ✨";
    return `Привет! Я ${car.brand} ${car.model} ${moodEmoji}`;
  })();

  return (
    <div className="relative w-full max-w-sm mx-auto" onClick={onTapCar}>
      {/* Speech bubble */}
      <div
        className={`
          absolute -top-2 left-1/2 -translate-x-1/2 z-10
          bg-white rounded-2xl px-4 py-2 shadow-lg
          text-sm font-medium text-center min-w-[200px]
          transition-all duration-500
          ${isHappy ? "scale-105" : "scale-100"}
        `}
      >
        {speechText}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm" />
      </div>

      {/* Car SVG */}
      <svg
        viewBox="0 0 400 220"
        className={`w-full mt-12 transition-transform duration-300 cursor-pointer select-none ${
          isHappy ? "animate-bounce-gentle" : ""
        } ${isSad ? "animate-shake" : ""}`}
      >
        {/* Shadow */}
        <ellipse cx="200" cy="200" rx="160" ry="15" fill="rgba(0,0,0,0.08)" />

        {/* Car body */}
        <g>
          {/* Lower body */}
          <rect x="40" y="110" width="320" height="70" rx="15" fill={car.color} />
          {/* Hood */}
          <path
            d="M40,130 L40,110 Q40,95 55,95 L140,95 L140,130 Z"
            fill={car.color}
          />
          {/* Roof */}
          <path
            d="M120,95 L155,45 Q160,38 170,38 L260,38 Q270,38 275,45 L310,95 Z"
            fill={car.color}
          />
          {/* Gloss effect */}
          <path
            d="M120,95 L155,45 Q160,38 170,38 L260,38 Q270,38 275,45 L310,95 Z"
            fill="url(#gloss)"
            opacity="0.3"
          />
          {/* Windows */}
          <path d="M160,50 L142,88 L213,88 L213,50 Z" fill="#87CEEB" opacity="0.85" />
          <path d="M223,50 L223,88 L298,88 L278,50 Z" fill="#87CEEB" opacity="0.85" />
          {/* Window reflection */}
          <path d="M165,55 L155,80 L175,80 L180,55 Z" fill="white" opacity="0.15" />
          <path d="M230,55 L230,78 L250,78 L245,55 Z" fill="white" opacity="0.15" />
          {/* Window divider */}
          <rect x="214" y="43" width="8" height="48" rx="3" fill={car.color} />
          {/* Headlights */}
          <rect x="42" y="115" width="25" height="15" rx="6" fill="#FFD700" opacity="0.9" />
          <rect x="333" y="115" width="25" height="15" rx="6" fill="#FF4444" opacity="0.8" />
          {/* Door handle */}
          <rect x="228" y="115" width="22" height="5" rx="2.5" fill="rgba(255,255,255,0.25)" />
          {/* Bumpers */}
          <rect x="30" y="165" width="80" height="10" rx="5" fill="#2a2a2a" />
          <rect x="290" y="165" width="80" height="10" rx="5" fill="#2a2a2a" />
          {/* Side mirror */}
          <ellipse cx="135" cy="90" rx="8" ry="5" fill={car.color} />
          <ellipse cx="135" cy="90" rx="6" ry="4" fill="#87CEEB" opacity="0.6" />
        </g>

        {/* Wheels with detail */}
        <g>
          <circle cx="110" cy="180" r="30" fill="#222" />
          <circle cx="110" cy="180" r="20" fill="#555" />
          <circle cx="110" cy="180" r="7" fill="#888" />
          {/* Spokes */}
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={`fl${angle}`}
              x1={110 + 8 * Math.cos((angle * Math.PI) / 180)}
              y1={180 + 8 * Math.sin((angle * Math.PI) / 180)}
              x2={110 + 18 * Math.cos((angle * Math.PI) / 180)}
              y2={180 + 18 * Math.sin((angle * Math.PI) / 180)}
              stroke="#777"
              strokeWidth="2"
            />
          ))}

          <circle cx="290" cy="180" r="30" fill="#222" />
          <circle cx="290" cy="180" r="20" fill="#555" />
          <circle cx="290" cy="180" r="7" fill="#888" />
          {[0, 60, 120, 180, 240, 300].map((angle) => (
            <line
              key={`rl${angle}`}
              x1={290 + 8 * Math.cos((angle * Math.PI) / 180)}
              y1={180 + 8 * Math.sin((angle * Math.PI) / 180)}
              x2={290 + 18 * Math.cos((angle * Math.PI) / 180)}
              y2={180 + 18 * Math.sin((angle * Math.PI) / 180)}
              stroke="#777"
              strokeWidth="2"
            />
          ))}
        </g>

        {/* Dirt overlay */}
        {dirtOpacity > 0.1 && (
          <g opacity={dirtOpacity * 0.7}>
            {[
              [80, 140, 9],
              [150, 155, 13],
              [250, 135, 11],
              [320, 150, 10],
              [180, 168, 8],
              [100, 120, 7],
              [350, 128, 6],
              [200, 145, 5],
              [270, 165, 7],
              [60, 155, 6],
            ].map(([cx, cy, r], i) => (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r! * (0.5 + dirtOpacity * 0.5)}
                fill="#8B7355"
                opacity={0.2 + dirtOpacity * 0.3}
              />
            ))}
          </g>
        )}

        {/* Sparkle when clean */}
        {car.cleanliness > 90 && (
          <g className="animate-pulse">
            <text x="55" y="78" fontSize="18">✨</text>
            <text x="325" y="68" fontSize="14">✨</text>
            <text x="195" y="28" fontSize="16">✨</text>
          </g>
        )}

        {/* Indicators */}
        {car.fuel < 20 && (
          <text x="45" y="92" fontSize="22" className="animate-pulse">⛽</text>
        )}
        {car.health < 50 && (
          <text x="340" y="78" fontSize="22" className="animate-pulse">🔧</text>
        )}
        {car.needsOilChange && (
          <text x="185" y="22" fontSize="18" className="animate-pulse">🛢️</text>
        )}

        {/* Gloss gradient */}
        <defs>
          <linearGradient id="gloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="white" stopOpacity="0.4" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>

      {/* Info */}
      <div className="text-center mt-1 space-y-0.5">
        <div className="text-sm font-semibold">
          {car.brand} {car.model} {car.year}
        </div>
        <div className="text-xs opacity-50">
          {car.mileage.toLocaleString()} км
          {daysSinceWash > 0 && ` · мыли ${daysSinceWash} дн. назад`}
        </div>
        <div className="text-[10px] opacity-30">нажми на машину — сменить цвет</div>
      </div>
    </div>
  );
}
