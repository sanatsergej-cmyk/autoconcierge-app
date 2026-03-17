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
      <div className="card-glow p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <div className="text-3xl mb-1">🏆</div>
          <div className="text-3xl font-black"
            style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {unlocked.length}<span className="text-lg font-normal" style={{ WebkitTextFillColor: "var(--text-muted)" }}>/{achievements.length}</span>
          </div>
          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>бейджей собрано</div>
        </div>
      </div>

      {/* Unlocked */}
      {unlocked.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3 px-1">Разблокировано</h3>
          <div className="grid grid-cols-3 gap-2">
            {unlocked.map((a) => (
              <div key={a.id} className="card-glow p-3 text-center">
                <div className="text-2xl mb-1">{a.icon}</div>
                <div className="text-[11px] font-bold leading-tight">{a.title}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>{a.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked */}
      {locked.length > 0 && (
        <div>
          <h3 className="text-sm font-bold mb-3 px-1" style={{ color: "var(--text-muted)" }}>Заблокировано</h3>
          <div className="grid grid-cols-3 gap-2">
            {locked.map((a) => (
              <div key={a.id} className="card p-3 text-center opacity-40">
                <div className="text-2xl mb-1">{a.hidden ? "🔒" : a.icon}</div>
                <div className="text-[11px] font-bold leading-tight">{a.hidden ? "???" : a.title}</div>
                <div className="text-[9px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {a.hidden ? "Секрет" : a.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
