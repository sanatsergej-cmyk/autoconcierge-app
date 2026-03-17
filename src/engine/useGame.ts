import { useState, useEffect, useCallback, useRef } from "react";
import type { GameState, GameEvent } from "./gameState";
import {
  createInitialState,
  loadState,
  saveState,
  processLogin,
  processDegradation,
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
      let s = processDegradation(saved);
      s = processLogin(s);
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

  // Degradation timer (every 5 min while open)
  useEffect(() => {
    const interval = setInterval(() => {
      setState((s) => {
        let updated = processDegradation(s);
        updated = checkAchievements(updated);
        return updated;
      });
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const doAction = useCallback(
    (action: string, modifier: (s: GameState) => GameState) => {
      setState((s) => {
        let updated = modifier(s);

        // Complete daily task
        updated = {
          ...updated,
          dailyTasks: updated.dailyTasks.map((t) =>
            t.action === action && !t.completed
              ? { ...t, completed: true }
              : t,
          ),
        };

        // Award daily task bonus
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

  const wash = useCallback(() => {
    haptic("medium");
    doAction("wash", (s) => ({
      ...s,
      car: { ...s.car, cleanliness: 100, mood: "happy", lastWash: Date.now() },
      coins: s.coins + 50,
      xp: s.xp + 15,
      totalWashes: s.totalWashes + 1,
    }));
  }, [doAction]);

  const fuel = useCallback(() => {
    haptic("medium");
    doAction("fuel", (s) => ({
      ...s,
      car: { ...s.car, fuel: 100, mood: "happy" },
      coins: s.coins + 30,
      xp: s.xp + 10,
      totalFuels: s.totalFuels + 1,
    }));
  }, [doAction]);

  const service = useCallback(() => {
    haptic("heavy");
    doAction("service", (s) => ({
      ...s,
      car: { ...s.car, health: 100, needsOilChange: false, mood: "happy" },
      coins: s.coins + 100,
      xp: s.xp + 30,
      totalServices: s.totalServices + 1,
    }));
  }, [doAction]);

  const tires = useCallback(() => {
    haptic("heavy");
    doAction("tires", (s) => ({
      ...s,
      car: { ...s.car, needsTires: false, mood: "happy" },
      coins: s.coins + 75,
      xp: s.xp + 20,
      totalTires: s.totalTires + 1,
    }));
  }, [doAction]);

  const checkStatus = useCallback(() => {
    haptic("light");
    doAction("check", (s) => ({
      ...s,
      xp: s.xp + 5,
    }));
  }, [doAction]);

  const setCarColor = useCallback((color: string) => {
    setState((s) => ({
      ...s,
      car: { ...s.car, color },
    }));
  }, []);

  const dismissEvent = useCallback(() => {
    setPendingEvent(null);
  }, []);

  return {
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
  };
}
