import type { Achievement } from "../engine/gameState";

interface AchievementsPanelProps {
  achievements: Achievement[];
}

export function AchievementsPanel({ achievements }: AchievementsPanelProps) {
  const unlocked = achievements.filter((a) => a.unlocked);
  const locked = achievements.filter((a) => !a.unlocked);

  return (
    <div className="px-4 mt-4 space-y-4">
      {/* Summary */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-4 text-center">
        <div className="text-3xl mb-1">🏆</div>
        <div className="text-2xl font-bold text-purple-600">
          {unlocked.length}/{achievements.length}
        </div>
        <div className="text-xs text-purple-400">бейджей собрано</div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2 px-1">Разблокировано</h3>
          <div className="grid grid-cols-3 gap-2">
            {unlocked.map((a) => (
              <div
                key={a.id}
                className="bg-white border border-green-200 rounded-xl p-3 text-center shadow-sm"
              >
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-[11px] font-semibold leading-tight">{a.title}</div>
                <div className="text-[9px] opacity-40 mt-0.5">{a.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-2 px-1 opacity-50">Заблокировано</h3>
          <div className="grid grid-cols-3 gap-2">
            {locked.map((a) => (
              <div
                key={a.id}
                className="bg-gray-50 border border-gray-100 rounded-xl p-3 text-center opacity-50"
              >
                <div className="text-2xl mb-1">{a.hidden ? "🔒" : a.icon}</div>
                <div className="text-[11px] font-semibold leading-tight">
                  {a.hidden ? "???" : a.title}
                </div>
                <div className="text-[9px] opacity-40 mt-0.5">
                  {a.hidden ? "Секретный бейдж" : a.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
