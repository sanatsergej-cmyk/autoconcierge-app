interface ProfileBarProps {
  xp: number;
  level: number;
  coins: number;
}

const LEVEL_NAMES = [
  "",
  "Новичок",
  "Водитель",
  "Бывалый",
  "Механик",
  "Автоэксперт",
  "Автопилот",
  "Легенда",
];

const LEVEL_ICONS = ["", "🔑", "🚗", "🛣️", "🔧", "⭐", "🏎️", "🏆"];
const LEVEL_XP = [0, 0, 50, 200, 500, 1500, 5000, 15000];

export function ProfileBar({ xp, level, coins }: ProfileBarProps) {
  const nextLevelXp = LEVEL_XP[level + 1] ?? LEVEL_XP[level];
  const currentLevelXp = LEVEL_XP[level];
  const progress = Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100);

  return (
    <div className="px-4 pt-3 pb-2">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{LEVEL_ICONS[level]}</span>
          <div>
            <div className="text-sm font-bold">{LEVEL_NAMES[level]}</div>
            <div className="text-[10px] opacity-50">Уровень {level}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-purple-50 rounded-full px-3 py-1">
            <span className="text-xs">⚡</span>
            <span className="text-xs font-bold text-purple-700">{xp} XP</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 rounded-full px-3 py-1">
            <span className="text-xs">🪙</span>
            <span className="text-xs font-bold text-amber-700">{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* XP progress */}
      <div className="mt-2">
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] opacity-40 mt-0.5">
          <span>{xp} XP</span>
          <span>{nextLevelXp} XP</span>
        </div>
      </div>
    </div>
  );
}
