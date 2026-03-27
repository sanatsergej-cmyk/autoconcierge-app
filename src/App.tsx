import { useState, useEffect } from "react";
import { useGame } from "./engine/useGame";
import { Garage } from "./components/Garage";
import { CarStatus } from "./components/CarStatus";
import { ActionButtons } from "./components/ActionButtons";
import { ProfileBar } from "./components/ProfileBar";
import { DailyTasks } from "./components/DailyTasks";
import { EventPopup } from "./components/EventPopup";
import { AchievementPopup } from "./components/AchievementPopup";
import { AchievementsPanel } from "./components/AchievementsPanel";
import { ColorPicker } from "./components/ColorPicker";
import { ReferralPanel } from "./components/ReferralPanel";
import { OrderTracker } from "./components/OrderTracker";
import { CrmPanel } from "./components/CrmPanel";

type Tab = "garage" | "tasks" | "achievements" | "referral" | "orders" | "sto";

export default function App() {
  const {
    state,
    pendingEvent,
    newAchievement,
    wash,
    fuel,
    service,
    tires,
    checkStatus,
    setCarColor,
    dismissEvent,
  } = useGame();

  const [tab, setTab] = useState<Tab>("garage");
  const [showColorPicker, setShowColorPicker] = useState(false);

  useEffect(() => {
    try {
      window.Telegram?.WebApp?.ready();
      window.Telegram?.WebApp?.expand();
    } catch { /* not in Telegram */ }
    checkStatus();
  }, [checkStatus]);

  const achievementData = newAchievement
    ? state.achievements.find((a) => a.id === newAchievement)
    : null;

  const tabs = [
    { id: "garage" as const, icon: "🏠", label: "Гараж" },
    { id: "tasks" as const, icon: "📋", label: "Задания" },
    { id: "achievements" as const, icon: "🏆", label: "Бейджи" },
    { id: "referral" as const, icon: "🎁", label: "Друзья" },
    { id: "orders" as const, icon: "📍", label: "Заказы" },
    { id: "sto" as const, icon: "🔧", label: "СТО" },
  ];

  // CRM mode — full takeover with its own layout
  if (tab === "sto") {
    return (
      <div className="crm-mode min-h-screen flex flex-col">
        <CrmPanel />
        {/* Back to game nav */}
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex gap-1 px-3 py-2"
          style={{ background: "#09090B", borderTop: "2px solid #27272A" }}
        >
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-2 text-xs font-semibold transition-all"
              style={
                tab === t.id
                  ? { color: "#CCFF00", background: "rgba(204,255,0,0.1)", border: "1px solid rgba(204,255,0,0.3)" }
                  : { color: "#A1A1AA", background: "rgba(255,255,255,0.03)", border: "1px solid transparent" }
              }
            >
              <span className="text-base">{t.icon}</span>
              <br />
              {t.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--bg-primary)" }}>
      <ProfileBar xp={state.xp} level={state.level} coins={state.coins} streak={state.streak} />

      {/* Bottom nav tabs */}
      <div className="flex gap-1 px-3 mt-1 mb-2">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`
              flex-1 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-300
              ${tab === t.id
                ? "text-white shadow-lg"
                : "text-gray-500 hover:text-gray-400"
              }
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

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        {tab === "garage" && (
          <>
            <div className="flex flex-col items-center px-4 relative mt-1">
              <Garage car={state.car} onTapCar={() => setShowColorPicker(true)} />
              <CarStatus car={state.car} />
            </div>
            <ActionButtons car={state.car} onWash={wash} onFuel={fuel} onService={service} onTires={tires} />
          </>
        )}
        {tab === "tasks" && <DailyTasks tasks={state.dailyTasks} streak={state.streak} />}
        {tab === "achievements" && <AchievementsPanel achievements={state.achievements} />}
        {tab === "referral" && <ReferralPanel coins={state.coins} />}
        {tab === "orders" && <OrderTracker />}
      </div>

      {/* Popups */}
      {pendingEvent && <EventPopup event={pendingEvent} onDismiss={dismissEvent} />}
      {achievementData && <AchievementPopup achievement={achievementData} />}
      {showColorPicker && (
        <ColorPicker
          currentColor={state.car.color}
          onSelect={(c) => { setCarColor(c); setShowColorPicker(false); }}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
}