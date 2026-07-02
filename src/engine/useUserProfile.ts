import { useState, useEffect, useCallback } from "react";
import { fetchUserProfile, type UserProfile } from "../api/user";

/** Реальный баланс/реферальная статистика из бэкенда — источник правды для монет,
 * в отличие от XP/уровня/стрика, которые остаются локальной игровой прослойкой. */
export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const refresh = useCallback(() => {
    fetchUserProfile().then(setProfile).catch(() => {});
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { profile, refresh };
}
