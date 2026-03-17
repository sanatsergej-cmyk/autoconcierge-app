interface ProfileBarProps {
  xp: number;
  level: number;
  coins: number;
  streak: number;
}

const LEVEL_NAMES = ["", "Новичок", "Водитель", "Бывалый", "Механик", "Эксперт", "Автопилот", "Легенда"];
const LEVEL_ICONS = ["", "🔑", "🚗", "🛣️", "🔧", "⭐", "🏎️", "🏆"];
const LEVEL_XP = [0, 0, 50, 200, 500, 1500, 5000, 15000];

export function ProfileBar({ xp, level, coins, streak }: ProfileBarProps) {
  const nextLevelXp = LEVEL_XP[level + 1] ?? LEVEL_XP[level]!;
  const currentLevelXp = LEVEL_XP[level]!;
  const progress = nextLevelXp > currentLevelXp
    ? Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)
    : 100;

  return (
    <div className="px-4 pt-3 pb-2 glass">
      <div className="flex items-center justify-between">
        {/* Level badge */}
        <div className="flex items-center gap-2">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: "linear-gradient(135deg, rgba(74,158,255,0.2), rgba(139,92,246,0.3))" }}
          >
            {LEVEL_ICONS[level]}
          </div>
          <div>
            <div className="text-sm font-bold">{LEVEL_NAMES[level]}</div>
            <div className="text-[10px] text-gray-500">Уровень {level}</div>
          </div>
        </div>

        {/* Stats pills */}
        <div className="flex items-center gap-1.5">
          {streak > 0 && (
            <div className="flex items-center gap-1 rounded-full px-2.5 py-1.5"
              style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
              <span className="text-xs">🔥</span>
              <span className="text-xs font-bold text-amber-400">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-1 rounded-full px-2.5 py-1.5"
            style={{ background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.3)" }}>
            <span className="text-xs">⚡</span>
            <span className="text-xs font-bold text-purple-400">{xp}</span>
          </div>
          <div className="flex items-center gap-1 rounded-full px-2.5 py-1.5"
            style={{ background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.3)" }}>
            <span className="text-xs">🪙</span>
            <span className="text-xs font-bold text-amber-400">{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="mt-2">
        <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${progress}%`,
              background: "linear-gradient(90deg, #667eea, #764ba2, #ec4899)",
            }}
          />
        </div>
        <div className="flex justify-between text-[9px] mt-1" style={{ color: "var(--text-muted)" }}>
          <span>Ур. {level}</span>
          <span>{Math.max(0, nextLevelXp - xp)} XP до ур. {Math.min(level + 1, 7)}</span>
        </div>
      </div>
    </div>
  );
}
