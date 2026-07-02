import type { Station } from "../types";

// В .env мини-аппа: VITE_API_BASE_URL=https://your-domain/fuel-api
// По умолчанию — локальный бэкенд бота для разработки.
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

function currentTelegramUser() {
  const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return {
    telegram_id: u?.id ?? 0,
    full_name: [u?.first_name, u?.last_name].filter(Boolean).join(" ") || "Пользователь",
    username: u?.username ?? null,
  };
}

export async function fetchStations(): Promise<Station[]> {
  const res = await fetch(`${API_BASE}/api/stations`);
  if (!res.ok) throw new Error(`fetchStations: ${res.status}`);
  return res.json();
}

export async function reportStationStatus(
  stationId: number,
  status: "green" | "yellow" | "red",
): Promise<{ ok: boolean; status: string | null; confirmed: boolean }> {
  const user = currentTelegramUser();
  const res = await fetch(`${API_BASE}/api/stations/${stationId}/report`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status, ...user }),
  });
  if (!res.ok) throw new Error(`reportStationStatus: ${res.status}`);
  return res.json();
}
