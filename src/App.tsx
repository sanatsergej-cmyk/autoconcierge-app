import { useState, useEffect } from "react";
import { useGame } from "./engine/useGame";
import { useUserProfile } from "./engine/useUserProfile";
import { ProfileBar } from "./components/ProfileBar";
import { DailyTasks } from "./components/DailyTasks";
import { EventPopup } from "./components/EventPopup";
import { AchievementPopup } from "./components/AchievementPopup";
import { AchievementsPanel } from "./components/AchievementsPanel";
import { ReferralPanel } from "./components/ReferralPanel";
import { FuelMapTab } from "./components/FuelMapTab";
import { RaffleStub } from "./components/RaffleStub";
import { FuelExchangeStub } from "./components/FuelExchangeStub";
import { ContentStub } from "./components/ContentStub";
import { CodeScanner } from "./components/CodeScanner";
import { AboutTab } from "./components/AboutTab";

type Tab = "map" | "scan" | "tasks" | "achievements" | "referral" | "raffle" | "exchange" | "content" | "about";

export default function App() {
  const {
    state,
    pendingEvent,
    newAchievement,
    reportStation,
    dismissEvent,
  } = useGame();
  const { profile, refresh: refreshProfile } = useUserProfile();

  const [tab, setTab] = useState<Tab>("map");

  useEffect(() => {
    try {
      window.Telegram?.WebApp?.ready();
      window.Telegram?.WebApp?.expand();
    } catch { /* not in Telegram */ }
  }, []);

  const achievementData = newAchievement
    ? state.achievements.find((a) => a.id === newAchievement)
    : null;

  const tabs = [
    { id: "map" as const, icon: "🗺️", label: "Карта" },
    { id: "scan" as const, icon: "📷", label: "Скан" },
    { id: "tasks" as const, icon: "📋", label: "Задания" },
    { id: "achievements" as const, icon: "🏆", label: "Бейджи" },
    { id: "referral" as const, icon: "🎁", label: "Друзья" },
    { id: "raffle" as const, icon: "💧", label: "Розыгрыш" },
    { id: "exchange" as const, icon: "🔁", label: "Биржа" },
    { id: "content" as const, icon: "🎥", label: "Контент" },
    { id: "about" as const, icon: "ℹ️", label: "О нас" },
  ];

  // Реальный баланс с бэкенда — источник правды, пока не подгрузился, показываем
  // локальные игровые монеты, чтобы UI не прыгал на пустом месте.
  const displayedCoins = profile?.coins ?? state.coins;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <ProfileBar xp={state.xp} level={state.level} coins={displayedCoins} streak={state.streak} />

      {/* Bottom nav tabs — горизонтальный скролл с чёткой шириной под каждую вкладку,
          чтобы обрезанная последняя кнопка читалась как «свайпни дальше», а не как баг */}
      <div className="relative mt-1 mb-2">
        <div className="flex gap-1.5 px-3 overflow-x-auto no-scrollbar">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`
                shrink-0 w-[64px] py-2 rounded-2xl text-[11px] font-semibold transition-all duration-300
                ${tab === t.id ? "text-white shadow-lg" : "text-gray-500 hover:text-gray-400"}
              `}
              style={tab === t.id ? {
                background: "linear-gradient(135deg, rgba(74,158,255,0.2), rgba(139,92,246,0.2))",
                border: "1px solid rgba(74,158,255,0.3)",
              } : {
                background: "rgba(255,255,255,0.03)",
                border: "1px solid transparent",
              }}
            >
              <span className="text-base">{t.icon}</span>
              <br />
              {t.label}
            </button>
          ))}
        </div>
        {/* лёгкая тень справа — подсказка, что список скроллится */}
        <div
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-6"
          style={{ background: "linear-gradient(90deg, transparent, var(--bg-primary))" }}
        />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {tab === "map" && <FuelMapTab onReported={() => { reportStation(); refreshProfile(); }} />}
        {tab === "scan" && <CodeScanner onRedeemed={refreshProfile} />}
        {tab === "tasks" && <DailyTasks tasks={state.dailyTasks} streak={state.streak} />}
        {tab === "achievements" && <AchievementsPanel achievements={state.achievements} />}
        {tab === "referral" && <ReferralPanel />}
        {tab === "raffle" && (
          <RaffleStub
            dailyTasksDone={state.dailyTasks.filter((t) => t.completed).length}
            dailyTasksTotal={state.dailyTasks.length}
          />
        )}
        {tab === "exchange" && <FuelExchangeStub />}
        {tab === "content" && <ContentStub />}
        {tab === "about" && <AboutTab />}
      </div>

      {/* Popups */}
      {pendingEvent && <EventPopup event={pendingEvent} onDismiss={dismissEvent} />}
      {achievementData && <AchievementPopup achievement={achievementData} />}
    </div>
  );
}
