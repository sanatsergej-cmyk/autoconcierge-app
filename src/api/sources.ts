const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface MonitoredSourceOut {
  id: number;
  platform: string;
  chat_ref: string;
  label: string | null;
  enabled: boolean;
}

export async function fetchMonitoredSources(): Promise<MonitoredSourceOut[]> {
  const res = await fetch(`${API_BASE}/api/monitored-sources`);
  if (!res.ok) throw new Error(`fetchMonitoredSources: ${res.status}`);
  return res.json();
}

export async function suggestMonitoredSource(chatRef: string, label: string): Promise<void> {
  const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const res = await fetch(`${API_BASE}/api/monitored-sources/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_ref: chatRef, label, added_by_telegram_id: u?.id ?? null }),
  });
  if (!res.ok) throw new Error(`suggestMonitoredSource: ${res.status}`);
}
