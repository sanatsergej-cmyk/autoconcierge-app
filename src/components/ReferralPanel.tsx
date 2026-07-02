import { useState, useCallback, useEffect } from "react";
import { fetchUserProfile, type UserProfile } from "../api/user";

export function ReferralPanel() {
  const [copied, setCopied] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchUserProfile().then(setProfile).catch(() => setError(true));
  }, []);

  const referralLink = profile?.referral_link ?? "";

  const handleCopy = useCallback(() => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      const input = document.createElement("input");
      input.value = referralLink;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [referralLink]);

  const handleShare = useCallback(() => {
    if (!referralLink) return;
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
    const text = `🚗 Присоединяйся к АвтоКонсьерж! Карта топлива в Крыму и бонусы за активность.\n\n${referralLink}`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
  }, [referralLink]);

  if (error) {
    return (
      <div className="px-4 mt-4 card p-4 text-sm text-center" style={{ color: "var(--accent-red)" }}>
        Не удалось загрузить реферальные данные. Проверьте соединение.
      </div>
    );
  }

  if (!profile) {
    return <div className="px-4 mt-4 text-sm text-center" style={{ color: "var(--text-muted)" }}>Загружаем…</div>;
  }

  return (
    <div className="px-4 mt-4 space-y-4 animate-fade-in">
      {/* Invite banner */}
      <div className="card-glow p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <div className="text-5xl mb-2">🎁</div>
          <div
            className="text-2xl font-black mb-1"
            style={{
              background: "linear-gradient(135deg, #4a9eff, #8b5cf6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Пригласи друга
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Получи <span className="font-bold text-yellow-400">50 🪙</span> за каждого друга,
            он получит <span className="font-bold text-yellow-400">20 🪙</span> welcome-бонус
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: profile.referrals_level1, label: "Друзья", icon: "👥" },
          { value: profile.referrals_level2, label: "2-й уровень", icon: "🔗" },
          { value: profile.coins, label: "Баланс", icon: "🪙" },
        ].map((s, i) => (
          <div key={i} className="card p-3 text-center">
            <div className="text-lg mb-1">{s.icon}</div>
            <div
              className="text-xl font-black"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {s.value}
            </div>
            <div className="text-[10px] font-medium" style={{ color: "var(--text-muted)" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Referral link */}
      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
          🔗 Твоя ссылка
        </h3>
        <div
          className="p-3 rounded-xl text-xs font-mono break-all"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--accent-blue)" }}
        >
          {referralLink}
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
            style={{
              background: copied
                ? "linear-gradient(135deg, #22c55e, #06b6d4)"
                : "linear-gradient(135deg, #667eea, #764ba2)",
              color: "#fff",
            }}
          >
            {copied ? "✅ Скопировано!" : "📋 Копировать"}
          </button>
          <button
            onClick={handleShare}
            className="flex-1 py-3 rounded-2xl font-bold text-sm transition-all duration-300"
            style={{
              background: "linear-gradient(135deg, #4a9eff, #06b6d4)",
              color: "#fff",
            }}
          >
            📤 Поделиться
          </button>
        </div>
      </div>

      {/* Balance card */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Твой баланс</div>
            <div
              className="text-2xl font-black"
              style={{
                background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              {profile.coins} 🪙
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>1 автокоин = 1 ₽</div>
            <div className="text-xs mt-1" style={{ color: "var(--text-secondary)" }}>
              Скидки у партнёров
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
