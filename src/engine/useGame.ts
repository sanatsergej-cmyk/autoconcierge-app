import { useState, useEffect, useCallback, useRef } from "react";
import type { GameState, GameEvent } from "./gameState";
import {
  createInitialState,
  loadState,
  saveState,
  processLogin,
  maybeGenerateEvent,
  checkAchievements,
  calculateLevel,
} from "./gameState";

function haptic(type: "light" | "medium" | "heavy" = "light") {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(type);
  } catch {
    // not in Telegram
  }
}

function hapticNotification(type: "success" | "warning" | "error" = "success") {
  try {
    window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type);
  } catch {
    // not in Telegram
  }
}

export function useGame() {
  const [state, setState] = useState<GameState>(() => {
    const saved = loadState();
    if (saved) {
      let s = processLogin(saved);
      s = maybeGenerateEvent(s);
      s = checkAchievements(s);
      return s;
    }
    const fresh = createInitialState();
    return processLogin(fresh);
  });

  const [pendingEvent, setPendingEvent] = useState<GameEvent | null>(null);
  const [newAchievement, setNewAchievement] = useState<string | null>(null);
  const prevAchievements = useRef(state.achievements.filter((a) => a.unlocked).length);

  // Auto-save
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Check for new achievements
  useEffect(() => {
    const currentUnlocked = state.achievements.filter((a) => a.unlocked).length;
    if (currentUnlocked > prevAchievements.current) {
      const newest = state.achievements
        .filter((a) => a.unlocked)
        .sort((a, b) => (b.unlockedAt ?? 0) - (a.unlockedAt ?? 0))[0];
      if (newest) {
        setNewAchievement(newest.id);
        hapticNotification("success");
        setTimeout(() => setNewAchievement(null), 3000);
      }
    }
    prevAchievements.current = currentUnlocked;
  }, [state.achievements]);

  // Show pending event from initial load
  useEffect(() => {
    if (state.events.length > 0) {
      const latest = state.events[0];
      if (Date.now() - latest.timestamp < 5000) {
        setPendingEvent(latest);
        hapticNotification(latest.coins && latest.coins > 0 ? "success" : "warning");
        setTimeout(() => setPendingEvent(null), 4000);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doAction = useCallback(
    (action: string, modifier: (s: GameState) => GameState) => {
      setState((s) => {
        let updated = modifier(s);

        updated = {
          ...updated,
          dailyTasks: updated.dailyTasks.map((t) =>
            t.action === action && !t.completed
              ? { ...t, completed: true }
              : t,
          ),
        };

        const justCompleted = updated.dailyTasks.find(
          (t) => t.action === action && t.completed,
        );
        const wasCompleted = s.dailyTasks.find(
          (t) => t.action === action,
        )?.completed;

        if (justCompleted && !wasCompleted) {
          updated.coins += justCompleted.reward.coins;
          updated.xp += justCompleted.reward.xp;
        }

        updated.level = calculateLevel(updated.xp);
        updated = checkAchievements(updated);
        return updated;
      });
    },
    [],
  );

  /** Вызывается после успешной отметки статуса заправки на карте (реальный API-запрос
   * уже сделан компонентом карты — здесь только начисление игровых очков). */
  const reportStation = useCallback(() => {
    haptic("medium");
    doAction("report", (s) => ({
      ...s,
      coins: s.coins + 30,
      xp: s.xp + 10,
      totalReports: s.totalReports + 1,
    }));
  }, [doAction]);

  /** Отметка "подписался на канал" — пока это доверительная самоотметка (заглушка
   * условия розыгрыша), реальную проверку подписки сделает бот через getChatMember
   * в следующей фазе. */
  const markSubscribed = useCallback(() => {
    haptic("light");
    doAction("subscribe", (s) => ({ ...s }));
  }, [doAction]);

  const markReferral = useCallback(() => {
    haptic("medium");
    doAction("referral", (s) => ({
      ...s,
      coins: s.coins + 200,
      xp: s.xp + 50,
      totalReferrals: s.totalReferrals + 1,
    }));
  }, [doAction]);

  const dismissEvent = useCallback(() => {
    setPendingEvent(null);
  }, []);

  return {
    state,
    pendingEvent,
    newAchievement,
    reportStation,
    markSubscribed,
    markReferral,
    dismissEvent,
  };
}
