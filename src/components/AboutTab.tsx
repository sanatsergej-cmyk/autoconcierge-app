import { useEffect, useState } from "react";
import { fetchMonitoredSources, suggestMonitoredSource, type MonitoredSourceOut } from "../api/sources";

const PARTNERS = [
  { icon: "⛽", name: "Сеть АЗС «Старт»", desc: "27 автозаправочных комплексов по Крыму — партнёр по карте топлива" },
  { icon: "💧", name: "Завод «Таврида»", desc: "Артезианская вода и напитки, произведено в Крыму — партнёр по программе баллов" },
];

export function AboutTab() {
  const [sources, setSources] = useState<MonitoredSourceOut[]>([]);
  const [chatRef, setChatRef] = useState("");
  const [label, setLabel] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    fetchMonitoredSources().then(setSources).catch(() => {});
  }, []);

  const handleSuggest = async () => {
    if (!chatRef.trim()) return;
    setStatus("sending");
    try {
      await suggestMonitoredSource(chatRef.trim(), label.trim());
      setStatus("sent");
      setChatRef("");
      setLabel("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="px-4 mt-1 space-y-3 animate-fade-in pb-4">
      <div className="card-glow p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <div className="text-5xl mb-2">ℹ️</div>
          <div className="text-xl font-black mb-1" style={{ color: "var(--text-primary)" }}>О нас</div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Партнёры, источники данных о топливе и как нам помочь
          </div>
        </div>
      </div>

      <div className="card p-4 space-y-2">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>🤝 Партнёры</h3>
        {PARTNERS.map((p, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-lg w-8 text-center shrink-0">{p.icon}</span>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{p.name}</div>
              <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{p.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4 space-y-2">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>💬 Источники, которые мы отслеживаем</h3>
        {sources.length === 0 && (
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Пока список пополняется</div>
        )}
        {sources.map((s) => (
          <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-lg w-8 text-center shrink-0">💬</span>
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>{s.label ?? s.chat_ref}</span>
          </div>
        ))}
      </div>

      <div className="card p-4 space-y-3">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>➕ Предложить чат/канал</h3>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Знаете чат, где пишут про бензин в вашем городе? Пришлите — мы посмотрим и добавим,
          сам чат при этом никому не станет виден напрямую.
        </div>
        <input
          value={chatRef}
          onChange={(e) => setChatRef(e.target.value)}
          placeholder="@username чата или ссылка"
          className="w-full px-3 py-2.5 rounded-xl text-sm"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Короткое описание (необязательно)"
          className="w-full px-3 py-2.5 rounded-xl text-sm"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
        />
        <button
          onClick={handleSuggest}
          disabled={status === "sending" || !chatRef.trim()}
          className="w-full py-3 rounded-2xl font-bold text-sm text-white disabled:opacity-40"
          style={{ background: "linear-gradient(135deg, #4a9eff, #06b6d4)" }}
        >
          {status === "sending" ? "Отправляем…" : "Предложить"}
        </button>
        {status === "sent" && (
          <div className="text-xs text-center" style={{ color: "var(--accent-green)" }}>Спасибо, отправлено на модерацию</div>
        )}
        {status === "error" && (
          <div className="text-xs text-center" style={{ color: "var(--accent-red)" }}>Не получилось отправить, попробуйте ещё раз</div>
        )}
      </div>
    </div>
  );
}
