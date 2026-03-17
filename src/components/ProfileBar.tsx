interface ProfileBarProps {
  xp: number;
  level: number;
  coins: number;
  streak: number;
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

export function ProfileBar({ xp, level, coins, streak }: ProfileBarProps) {
  const nextLevelXp = LEVEL_XP[level + 1] ?? LEVEL_XP[level]!;
  const currentLevelXp = LEVEL_XP[level]!;
  const progress = nextLevelXp > currentLevelXp
    ? Math.min(100, ((xp - currentLevelXp) / (nextLevelXp - currentLevelXp)) * 100)
    : 100;

  return (
    <div className="px-4 pt-3 pb-1 bg-white/80 backdrop-blur-sm">
      {/* Top row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{LEVEL_ICONS[level]}</span>
          <div>
            <div className="text-sm font-bold">{LEVEL_NAMES[level]}</div>
            <div className="text-[10px] opacity-40">Ур. {level}</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {streak > 0 && (
            <div className="flex items-center gap-0.5 bg-orange-50 rounded-full px-2 py-1">
              <span className="text-[10px]">🔥</span>
              <span className="text-[10px] font-bold text-orange-600">{streak}</span>
            </div>
          )}
          <div className="flex items-center gap-0.5 bg-purple-50 rounded-full px-2 py-1">
            <span className="text-[10px]">⚡</span>
            <span className="text-[10px] font-bold text-purple-600">{xp}</span>
          </div>
          <div className="flex items-center gap-0.5 bg-amber-50 rounded-full px-2 py-1">
            <span className="text-[10px]">🪙</span>
            <span className="text-[10px] font-bold text-amber-600">{coins.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* XP bar */}
      <div className="mt-1.5">
        <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-[9px] opacity-30 mt-0.5">
          <span>Ур. {level}</span>
          <span>{nextLevelXp - xp} XP до ур. {Math.min(level + 1, 7)}</span>
        </div>
      </div>
    </div>
  );
}
