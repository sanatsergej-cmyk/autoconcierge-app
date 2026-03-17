import type { Achievement } from "../engine/gameState";

interface AchievementPopupProps {
  achievement: Achievement;
}

export function AchievementPopup({ achievement }: AchievementPopupProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white rounded-2xl px-5 py-3 shadow-xl flex items-center gap-3">
        <span className="text-2xl">{achievement.icon}</span>
        <div>
          <div className="text-xs font-medium opacity-80">Новый бейдж!</div>
          <div className="text-sm font-bold">{achievement.title}</div>
        </div>
        <span className="text-lg">🎉</span>
      </div>
    </div>
  );
}
