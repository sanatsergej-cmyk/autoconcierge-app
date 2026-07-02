const IDEAS = [
  { icon: "🎬", text: "Сними ролик и отметь нас в Instagram" },
  { icon: "📰", text: "Предложи новость завода" },
  { icon: "💬", text: "Пришли ссылку — мы посмотрим" },
];

export function ContentStub() {
  return (
    <div className="px-4 mt-1 space-y-3 animate-fade-in">
      <div className="card p-5 text-center">
        <div className="text-5xl mb-2">🎥</div>
        <div className="text-xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Контент завода</div>
        <div className="text-sm" style={{ color: "var(--text-secondary)" }}>Скоро сюда переедет приём роликов и новостей</div>
      </div>
      <div className="card p-4 space-y-2">
        {IDEAS.map((i, idx) => (
          <div key={idx} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <span className="text-lg w-8 text-center">{i.icon}</span>
            <span className="text-sm" style={{ color: "var(--text-primary)" }}>{i.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
