import type { DailyTask } from "../engine/gameState";

interface DailyTasksProps {
  tasks: DailyTask[];
  streak: number;
}

export function DailyTasks({ tasks, streak }: DailyTasksProps) {
  const allDone = tasks.every((t) => t.completed);

  return (
    <div className="px-4 mt-4 space-y-4">
      {/* Streak */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-4 text-center">
        <div className="text-3xl mb-1">🔥</div>
        <div className="text-2xl font-bold text-orange-600">{streak}</div>
        <div className="text-xs text-orange-400 font-medium">
          {streak === 0
            ? "Начни стрик — заходи каждый день!"
            : streak === 1
              ? "день подряд"
              : streak < 5
                ? "дня подряд"
                : "дней подряд!"}
        </div>
        {streak >= 3 && (
          <div className="text-[10px] text-orange-300 mt-1">
            Бонус: +{streak * 10} монет за стрик
          </div>
        )}
      </div>

      {/* Tasks */}
      <div>
        <h3 className="text-sm font-bold mb-2 px-1">Задания на сегодня</h3>
        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`
                flex items-center gap-3 p-3 rounded-xl transition-all
                ${task.completed ? "bg-green-50 border border-green-200" : "bg-white border border-gray-100 shadow-sm"}
              `}
            >
              <span className={`text-xl ${task.completed ? "opacity-50" : ""}`}>
                {task.completed ? "✅" : task.icon}
              </span>
              <div className="flex-1">
                <div
                  className={`text-sm font-medium ${task.completed ? "line-through opacity-50" : ""}`}
                >
                  {task.title}
                </div>
                <div className="text-[10px] opacity-40">
                  +{task.reward.coins} монет · +{task.reward.xp} XP
                </div>
              </div>
              {task.completed && (
                <span className="text-xs text-green-500 font-medium">Готово!</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* All done */}
      {allDone && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-4 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <div className="text-sm font-bold text-green-600">
            Все задания выполнены!
          </div>
          <div className="text-xs text-green-400">
            Возвращайся завтра за новыми
          </div>
        </div>
      )}
    </div>
  );
}
