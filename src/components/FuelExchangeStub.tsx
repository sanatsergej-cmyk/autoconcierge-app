export function FuelExchangeStub() {
  return (
    <div className="px-4 mt-1 space-y-3 animate-fade-in">
      <div className="card p-5 text-center">
        <div className="text-5xl mb-2">🔁</div>
        <div className="text-xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Топливная биржа</div>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Идея на проработке: связать тех, у кого есть лишнее топливо, с теми, кому оно нужно —
          без денег и без физической передачи через нас, только обмен контактами.
        </div>
        <span className="inline-block mt-3 text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-orange)" }}>
          Обсуждается с юристом
        </span>
      </div>
    </div>
  );
}
