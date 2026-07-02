interface RaffleStubProps {
  dailyTasksDone: number;
  dailyTasksTotal: number;
}

const TIERS = [
  { icon: "⛽", title: "Ежедневно", desc: "5–10 л топлива или скидка" },
  { icon: "🎯", title: "Еженедельно", desc: "10–20 л топлива" },
  { icon: "🛴", title: "Ежемесячно", desc: "Самокат, генератор, сертификаты" },
  { icon: "🚗", title: "Суперприз", desc: "Автомобиль — конец лета" },
];

export function RaffleStub({ dailyTasksDone, dailyTasksTotal }: RaffleStubProps) {
  return (
    <div className="px-4 mt-1 space-y-3 animate-fade-in">
      <div className="card-glow p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <div className="text-5xl mb-2">💧</div>
          <div className="text-2xl font-black mb-1" style={{ background: "linear-gradient(135deg,#4a9eff,#22c55e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Розыгрыш «Таврида»
          </div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Скоро — купи воду, участвуй в розыгрыше</div>
          <span className="inline-block mt-3 text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-orange)" }}>
            В разработке
          </span>
        </div>
      </div>

      <div className="card p-4 space-y-2">
        <h3 className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>🏆 Уровни призов (черновик)</h3>
        {TIERS.map((t, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-lg w-8 text-center">{t.icon}</span>
            <div>
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{t.title}</div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card p-4">
        <h3 className="text-sm font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Твой прогресс уже сейчас</h3>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          Выполнено заданий сегодня: {dailyTasksDone}/{dailyTasksTotal} — они пригодятся, когда розыгрыш запустится
        </div>
      </div>
    </div>
  );
}
