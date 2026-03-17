import type { GameEvent } from "../engine/gameState";

interface EventLogProps {
  events: GameEvent[];
}

export function EventLog({ events }: EventLogProps) {
  if (events.length === 0) {
    return (
      <div className="px-4 mt-8 text-center">
        <div className="text-3xl mb-2">📜</div>
        <div className="text-sm font-medium opacity-40">Пока нет событий</div>
        <div className="text-xs opacity-30 mt-1">
          Заходи почаще — события происходят случайно!
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 mt-4 space-y-2">
      <h3 className="text-sm font-bold mb-2 px-1">Последние события</h3>
      {events.map((event) => {
        const time = new Date(event.timestamp);
        const timeStr = `${time.getHours().toString().padStart(2, "0")}:${time
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
        const dateStr = time.toLocaleDateString("ru-RU", {
          day: "numeric",
          month: "short",
        });

        return (
          <div
            key={event.id}
            className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm flex items-start gap-3"
          >
            <span className="text-xl">{event.icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{event.title}</div>
              <div className="text-xs opacity-50">{event.description}</div>
              <div className="flex gap-2 mt-1">
                {event.coins !== undefined && event.coins !== 0 && (
                  <span
                    className={`text-[10px] font-bold ${event.coins > 0 ? "text-amber-500" : "text-red-400"}`}
                  >
                    {event.coins > 0 ? "+" : ""}
                    {event.coins} 🪙
                  </span>
                )}
                {event.xp !== undefined && event.xp > 0 && (
                  <span className="text-[10px] font-bold text-purple-400">
                    +{event.xp} XP
                  </span>
                )}
              </div>
            </div>
            <div className="text-[10px] opacity-30 text-right">
              <div>{timeStr}</div>
              <div>{dateStr}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
