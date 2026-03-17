import type { GameEvent } from "../engine/gameState";

interface EventPopupProps {
  event: GameEvent;
  onDismiss: () => void;
}

export function EventPopup({ event, onDismiss }: EventPopupProps) {
  const isPositive = (event.coins ?? 0) > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onDismiss}>
      <div
        className="mx-6 p-6 rounded-3xl max-w-sm w-full animate-slide-up relative overflow-hidden"
        style={{
          background: isPositive
            ? "linear-gradient(160deg, #1a2e1a, #1a1a2e)"
            : "linear-gradient(160deg, #2e1a1a, #1a1a2e)",
          border: isPositive
            ? "1px solid rgba(34,197,94,0.3)"
            : "1px solid rgba(239,68,68,0.3)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 shimmer" />
        <div className="text-center relative z-10">
          <div className="text-5xl mb-3 animate-coin-pop">{event.icon}</div>
          <div className="text-lg font-black">{event.title}</div>
          <div className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{event.description}</div>

          <div className="flex justify-center gap-3 mt-4">
            {event.coins !== undefined && event.coins !== 0 && (
              <span className="text-sm font-bold px-3 py-1.5 rounded-full"
                style={{
                  background: event.coins > 0 ? "rgba(245,158,11,0.2)" : "rgba(239,68,68,0.2)",
                  color: event.coins > 0 ? "#f59e0b" : "#ef4444",
                }}>
                {event.coins > 0 ? "+" : ""}{event.coins} 🪙
              </span>
            )}
            {event.xp !== undefined && event.xp > 0 && (
              <span className="text-sm font-bold px-3 py-1.5 rounded-full"
                style={{ background: "rgba(139,92,246,0.2)", color: "#8b5cf6" }}>
                +{event.xp} XP
              </span>
            )}
          </div>

          <button
            onClick={onDismiss}
            className="mt-5 px-8 py-3 rounded-2xl text-sm font-bold active:scale-95 transition-transform w-full"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}
          >
            Окей
          </button>
        </div>
      </div>
    </div>
  );
}
