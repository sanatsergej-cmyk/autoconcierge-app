import { useState, useCallback } from "react";

interface ReferralPanelProps {
  coins: number;
}

export function ReferralPanel({ coins }: ReferralPanelProps) {
  const [copied, setCopied] = useState(false);

  // Get telegram user id for referral code, fallback to random
  const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
  const referralCode = tgUser ? `ac_${tgUser.id.toString(16).slice(0, 8)}` : "ac_demo1234";
  const referralLink = `https://t.me/avtocontest_bot?start=${referralCode}`;

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {
      // Fallback for environments without clipboard API
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
    window.Telegram?.WebApp?.HapticFeedback?.impactOccurred("medium");
    const text = `🚗 Присоединяйся к АвтоКонсьерж! Заботься о своей машине и получай бонусы!\n\n${referralLink}`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
    window.open(shareUrl, "_blank");
  }, [referralLink]);

  // Mock referral stats (in real app — fetch from API)
  const stats = { direct: 3, level2: 1, totalCoins: 350 };

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
            Получи <span className="font-bold text-yellow-400">200 🪙</span> за каждого друга
          </div>
        </div>
      </div>

      {/* Rewards breakdown */}
      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
          💰 Как заработать
        </h3>
        <div className="space-y-2">
          {[
            { icon: "👥", text: "Друг зарегистрировался", reward: "+50 🪙" },
            { icon: "🚗", text: "Друг привязал VIN", reward: "+100 🪙" },
            { icon: "⭐", text: "Друг купил подписку", reward: "5% навсегда" },
            { icon: "🔗", text: "Друг друга зарегался", reward: "1% навсегда" },
          ].map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)" }}
            >
              <span className="text-lg w-8 text-center">{item.icon}</span>
              <span className="flex-1 text-sm" style={{ color: "var(--text-primary)" }}>{item.text}</span>
              <span className="text-xs font-bold text-yellow-400 whitespace-nowrap">{item.reward}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { value: stats.direct, label: "Друзья", icon: "👥" },
          { value: stats.level2, label: "2-й уровень", icon: "🔗" },
          { value: stats.totalCoins, label: "Заработано", icon: "🪙" },
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
              {coins} 🪙
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