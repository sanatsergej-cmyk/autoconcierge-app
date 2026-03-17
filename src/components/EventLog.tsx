import type { GameEvent } from "../engine/gameState";

interface EventLogProps {
  events: GameEvent[];
}

export function EventLog({ events }: EventLogProps) {
  if (events.length === 0) {
    return (
      <div className="px-4 mt-12 text-center">
        <div className="text-4xl mb-3 animate-float">📜</div>
        <div className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Пока нет событий</div>
        <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
          Заходи чаще — события случаются при каждом открытии!
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-4 space-y-2">
      <h3 className="text-sm font-bold mb-3 px-1">Последние события</h3>
      {events.map((event) => {
        const time = new Date(event.timestamp);
        const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time.getMinutes().toString().padStart(2, "0")}`;
        const dateStr = time.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

        return (
          <div key={event.id} className="card flex items-start gap-3 p-4">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: "rgba(255,255,255,0.05)" }}>
              {event.icon}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold">{event.title}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{event.description}</div>
              <div className="flex gap-2 mt-1.5">
                {event.coins !== undefined && event.coins !== 0 && (
                  <span className="text-[10px] font-bold" style={{ color: event.coins > 0 ? "#f59e0b" : "#ef4444" }}>
                    {event.coins > 0 ? "+" : ""}{event.coins} 🪙
                  </span>
                )}
                {event.xp !== undefined && event.xp > 0 && (
                  <span className="text-[10px] font-bold" style={{ color: "#8b5cf6" }}>+{event.xp} XP</span>
                )}
              </div>
            </div>
            <div className="text-[10px] text-right shrink-0" style={{ color: "var(--text-muted)" }}>
              <div>{timeStr}</div>
              <div>{dateStr}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
