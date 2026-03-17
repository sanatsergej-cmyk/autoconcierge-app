import type { Achievement } from "../engine/gameState";

interface AchievementPopupProps {
  achievement: Achievement;
}

export function AchievementPopup({ achievement }: AchievementPopupProps) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-slide-down w-[90%] max-w-sm">
      <div
        className="rounded-2xl px-5 py-3.5 flex items-center gap-3 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #f59e0b, #ef4444)",
          boxShadow: "0 8px 30px rgba(245,158,11,0.4)",
        }}
      >
        <div className="absolute inset-0 shimmer" />
        <span className="text-3xl relative z-10 animate-coin-pop">{achievement.icon}</span>
        <div className="relative z-10">
          <div className="text-[10px] font-bold opacity-80">НОВЫЙ БЕЙДЖ!</div>
          <div className="text-sm font-black">{achievement.title}</div>
          <div className="text-[10px] opacity-70">+50 🪙 · +25 XP</div>
        </div>
        <span className="text-xl relative z-10">🎉</span>
      </div>
    </div>
  );
}
