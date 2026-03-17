import type { GameEvent } from "../engine/gameState";

interface EventPopupProps {
  event: GameEvent;
  onDismiss: () => void;
}

export function EventPopup({ event, onDismiss }: EventPopupProps) {
  const isPositive = (event.coins ?? 0) > 0 || Object.values(event.effect).some((v) => typeof v === "number" && v > 0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 animate-fade-in"
      onClick={onDismiss}
    >
      <div
        className={`
          mx-6 p-5 rounded-2xl shadow-xl max-w-sm w-full
          animate-slide-up
          ${isPositive ? "bg-gradient-to-b from-green-50 to-white" : "bg-gradient-to-b from-amber-50 to-white"}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-4xl mb-2">{event.icon}</div>
          <div className="text-lg font-bold">{event.title}</div>
          <div className="text-sm opacity-60 mt-1">{event.description}</div>

          {/* Effects */}
          <div className="flex justify-center gap-3 mt-3">
            {event.coins !== undefined && event.coins !== 0 && (
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${event.coins > 0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-600"}`}>
                {event.coins > 0 ? "+" : ""}{event.coins} 🪙
              </span>
            )}
            {event.xp !== undefined && event.xp > 0 && (
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                +{event.xp} XP
              </span>
            )}
          </div>

          <button
            onClick={onDismiss}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl text-sm font-medium active:scale-95 transition-transform"
          >
            Понятно
          </button>
        </div>
      </div>
    </div>
  );
}
