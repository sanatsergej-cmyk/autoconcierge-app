import type { CarState } from "../types";

interface GarageProps {
  car: CarState;
}

export function Garage({ car }: GarageProps) {
  const dirtOpacity = Math.max(0, (100 - car.cleanliness) / 100);
  const isHappy = car.mood === "happy";
  const isSad = car.mood === "sad" || car.mood === "angry";

  const moodEmoji = {
    happy: "😊",
    normal: "😐",
    sad: "😟",
    angry: "😠",
  }[car.mood];

  const daysSinceWash = Math.floor((Date.now() - car.lastWash) / (1000 * 60 * 60 * 24));

  return (
    <div className="relative w-full max-w-sm mx-auto">
      {/* Speech bubble */}
      <div
        className={`
          absolute -top-2 left-1/2 -translate-x-1/2 z-10
          bg-white rounded-2xl px-4 py-2 shadow-lg
          text-sm font-medium text-center
          transition-all duration-500
          ${isHappy ? "scale-110" : "scale-100"}
        `}
      >
        {car.cleanliness < 30 && "Помой меня! 🥺"}
        {car.cleanliness >= 30 && car.cleanliness < 60 && "Пора бы помыться... 💧"}
        {car.cleanliness >= 60 && car.fuel < 20 && "Бензин на нуле! ⛽"}
        {car.cleanliness >= 60 && car.fuel >= 20 && car.health < 50 && "Мне нужен доктор! 🔧"}
        {car.cleanliness >= 60 && car.fuel >= 20 && car.health >= 50 && isHappy && "Спасибо! Мне хорошо! 🎉"}
        {car.cleanliness >= 60 && car.fuel >= 20 && car.health >= 50 && !isHappy && `Привет! Я ${car.brand} ${car.model} ${moodEmoji}`}

        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 shadow-sm" />
      </div>

      {/* Car SVG */}
      <svg viewBox="0 0 400 220" className={`w-full mt-10 transition-transform duration-300 ${isHappy ? "animate-bounce-gentle" : ""} ${isSad ? "animate-shake" : ""}`}>
        {/* Shadow */}
        <ellipse cx="200" cy="200" rx="160" ry="15" fill="rgba(0,0,0,0.1)" />

        {/* Car body */}
        <g>
          {/* Lower body */}
          <rect x="40" y="110" width="320" height="70" rx="15" fill={car.color} />

          {/* Hood */}
          <path d="M40,130 L40,110 Q40,95 55,95 L140,95 L140,130 Z" fill={car.color} />

          {/* Roof/cabin */}
          <path d="M120,95 L155,45 Q160,38 170,38 L260,38 Q270,38 275,45 L310,95 Z" fill={car.color} />

          {/* Windows */}
          <path d="M160,50 L140,90 L215,90 L215,50 Z" fill="#87CEEB" opacity="0.8" />
          <path d="M225,50 L225,90 L300,90 L280,50 Z" fill="#87CEEB" opacity="0.8" />

          {/* Window divider */}
          <rect x="216" y="45" width="6" height="48" rx="2" fill={car.color} />

          {/* Headlights */}
          <rect x="42" y="115" width="25" height="15" rx="5" fill="#FFD700" opacity="0.9" />
          <rect x="333" y="115" width="25" height="15" rx="5" fill="#FF4444" opacity="0.8" />

          {/* Door handle */}
          <rect x="230" y="115" width="20" height="4" rx="2" fill="rgba(255,255,255,0.3)" />

          {/* Bumpers */}
          <rect x="30" y="165" width="80" height="10" rx="4" fill="#333" />
          <rect x="290" y="165" width="80" height="10" rx="4" fill="#333" />
        </g>

        {/* Wheels */}
        <g>
          <circle cx="110" cy="180" r="28" fill="#333" />
          <circle cx="110" cy="180" r="18" fill="#666" />
          <circle cx="110" cy="180" r="6" fill="#999" />

          <circle cx="290" cy="180" r="28" fill="#333" />
          <circle cx="290" cy="180" r="18" fill="#666" />
          <circle cx="290" cy="180" r="6" fill="#999" />
        </g>

        {/* Dirt overlay */}
        {dirtOpacity > 0.1 && (
          <g opacity={dirtOpacity * 0.6}>
            <circle cx="80" cy="140" r="8" fill="#8B7355" opacity="0.4" />
            <circle cx="150" cy="155" r="12" fill="#8B7355" opacity="0.3" />
            <circle cx="250" cy="135" r="10" fill="#8B7355" opacity="0.35" />
            <circle cx="320" cy="150" r="9" fill="#8B7355" opacity="0.4" />
            <circle cx="180" cy="170" r="7" fill="#8B7355" opacity="0.3" />
            <circle cx="100" cy="120" r="6" fill="#8B7355" opacity="0.25" />
            <circle cx="350" cy="130" r="5" fill="#8B7355" opacity="0.3" />
          </g>
        )}

        {/* Sparkle when clean */}
        {car.cleanliness > 90 && (
          <g>
            <text x="60" y="80" fontSize="20" opacity="0.8">✨</text>
            <text x="320" y="70" fontSize="16" opacity="0.6">✨</text>
            <text x="200" y="30" fontSize="18" opacity="0.7">✨</text>
          </g>
        )}

        {/* Low fuel indicator */}
        {car.fuel < 20 && (
          <text x="50" y="100" fontSize="24" className="animate-pulse">⛽</text>
        )}

        {/* Health warning */}
        {car.health < 50 && (
          <text x="340" y="80" fontSize="24" className="animate-pulse">🔧</text>
        )}
      </svg>

      {/* Info under car */}
      <div className="text-center mt-2 text-sm opacity-60">
        {car.brand} {car.model} {car.year} &middot; {car.mileage.toLocaleString()} км
        {daysSinceWash > 0 && (
          <span className="ml-2">
            &middot; мыли {daysSinceWash} дн. назад
          </span>
        )}
      </div>
    </div>
  );
}
