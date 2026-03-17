import type { DailyTask } from "../engine/gameState";

interface DailyTasksProps {
  tasks: DailyTask[];
  streak: number;
}

export function DailyTasks({ tasks, streak }: DailyTasksProps) {
  const allDone = tasks.every((t) => t.completed);
  const doneCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="px-4 mt-4 space-y-4">
      {/* Streak card */}
      <div className="card-glow p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <div className="text-4xl mb-1">🔥</div>
          <div className="text-3xl font-black" style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {streak}
          </div>
          <div className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>
            {streak === 0 ? "Начни стрик!" : streak === 1 ? "день подряд" : streak < 5 ? "дня подряд" : "дней подряд!"}
          </div>
          {streak >= 3 && (
            <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
              Бонус: +{streak * 10} 🪙 за стрик
            </div>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${(doneCount / tasks.length) * 100}%`,
              background: allDone ? "linear-gradient(90deg, #22c55e, #06b6d4)" : "linear-gradient(90deg, #667eea, #764ba2)",
            }}
          />
        </div>
        <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
          {doneCount}/{tasks.length}
        </span>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`card flex items-center gap-3 p-4 transition-all ${task.completed ? "opacity-60" : ""}`}
            style={task.completed ? { borderColor: "rgba(34,197,94,0.3)" } : {}}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{
                background: task.completed
                  ? "rgba(34,197,94,0.15)"
                  : "rgba(255,255,255,0.05)",
              }}
            >
              {task.completed ? "✅" : task.icon}
            </div>
            <div className="flex-1">
              <div className={`text-sm font-semibold ${task.completed ? "line-through" : ""}`}>
                {task.title}
              </div>
              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                +{task.reward.coins} 🪙 · +{task.reward.xp} XP
              </div>
            </div>
            {task.completed && (
              <span className="text-xs font-bold text-green-400">Готово</span>
            )}
          </div>
        ))}
      </div>

      {/* All done celebration */}
      {allDone && (
        <div className="card-glow p-5 text-center relative overflow-hidden">
          <div className="absolute inset-0 shimmer" />
          <div className="relative z-10">
            <div className="text-3xl mb-1">🎉</div>
            <div className="text-sm font-bold text-green-400">Все задания выполнены!</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>Новые задания завтра</div>
          </div>
        </div>
      )}
    </div>
  );
}
