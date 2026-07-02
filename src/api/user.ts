const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export interface UserProfile {
  telegram_id: number;
  coins: number;
  referral_code: string;
  referral_link: string;
  referrals_level1: number;
  referrals_level2: number;
  referrals_total: number;
}

function currentTelegramUser() {
  const u = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return {
    telegram_id: u?.id ?? 0,
    full_name: [u?.first_name, u?.last_name].filter(Boolean).join(" ") || "Пользователь",
    username: u?.username ?? null,
  };
}

export async function fetchUserProfile(): Promise<UserProfile> {
  const user = currentTelegramUser();
  const params = new URLSearchParams({
    full_name: user.full_name,
    ...(user.username ? { username: user.username } : {}),
  });
  const res = await fetch(`${API_BASE}/api/users/${user.telegram_id}?${params}`);
  if (!res.ok) throw new Error(`fetchUserProfile: ${res.status}`);
  return res.json();
}

export async function redeemCode(
  code: string,
): Promise<{ ok: boolean; coins_awarded: number; new_balance: number }> {
  const user = currentTelegramUser();
  const res = await fetch(`${API_BASE}/api/redeem-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ code, ...user }),
  });
  if (res.status === 409) {
    throw new Error("ALREADY_USED");
  }
  if (res.status === 422) {
    throw new Error("NOT_RECOGNIZED"); // код не из белого списка продукции Тавриды
  }
  if (!res.ok) throw new Error(`redeemCode: ${res.status}`);
  return res.json();
}
