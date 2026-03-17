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
import { EventLog } from "./components/EventLog";

type Tab = "garage" | "tasks" | "achievements" | "log";

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

  // Init Telegram WebApp
  useEffect(() => {
    try {
      window.Telegram?.WebApp?.ready();
      window.Telegram?.WebApp?.expand();
    } catch {
      // not in Telegram
    }
    checkStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const achievementData = newAchievement
    ? state.achievements.find((a) => a.id === newAchievement)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-slate-100">
      <ProfileBar
        xp={state.xp}
        level={state.level}
        coins={state.coins}
        streak={state.streak}
      />

      {/* Tabs */}
      <div className="flex gap-1 px-3 mt-1">
        {(
          [
            { id: "garage", icon: "🏠", label: "Гараж" },
            { id: "tasks", icon: "📋", label: "Задания" },
            { id: "achievements", icon: "🏆", label: "Бейджи" },
            { id: "log", icon: "📜", label: "События" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
              tab === t.id
                ? "bg-white shadow-sm text-blue-600"
                : "text-gray-400"
            }`}
          >
            <span className="text-sm">{t.icon}</span>
            <br />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-4">
        {tab === "garage" && (
          <>
            <div className="flex-1 flex flex-col items-center justify-center px-4 relative mt-2">
              <Garage car={state.car} onTapCar={() => setShowColorPicker(true)} />
              <CarStatus car={state.car} />
            </div>
            <ActionButtons
              car={state.car}
              onWash={wash}
              onFuel={fuel}
              onService={service}
              onTires={tires}
            />
          </>
        )}

        {tab === "tasks" && <DailyTasks tasks={state.dailyTasks} streak={state.streak} />}
        {tab === "achievements" && <AchievementsPanel achievements={state.achievements} />}
        {tab === "log" && <EventLog events={state.events} />}
      </div>

      {/* Popups */}
      {pendingEvent && (
        <EventPopup event={pendingEvent} onDismiss={dismissEvent} />
      )}

      {achievementData && (
        <AchievementPopup achievement={achievementData} />
      )}

      {showColorPicker && (
        <ColorPicker
          currentColor={state.car.color}
          onSelect={(c) => {
            setCarColor(c);
            setShowColorPicker(false);
          }}
          onClose={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
}
