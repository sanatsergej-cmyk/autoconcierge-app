interface ColorPickerProps {
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  { name: "Чёрный", value: "#1a1a2e" },
  { name: "Белый", value: "#e8e8e8" },
  { name: "Серебро", value: "#a0a0b0" },
  { name: "Красный", value: "#c0392b" },
  { name: "Синий", value: "#2980b9" },
  { name: "Тёмно-синий", value: "#1a3a5c" },
  { name: "Зелёный", value: "#27ae60" },
  { name: "Бордо", value: "#6b2d5b" },
  { name: "Оранжевый", value: "#e67e22" },
  { name: "Жёлтый", value: "#f1c40f" },
  { name: "Серый", value: "#5a5a6a" },
  { name: "Бежевый", value: "#c4a574" },
];

export function ColorPicker({ currentColor, onSelect, onClose }: ColorPickerProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in" style={{ background: "rgba(0,0,0,0.6)" }} onClick={onClose}>
      <div
        className="w-full max-w-md p-5 animate-slide-up"
        style={{ background: "var(--bg-secondary)", borderRadius: "24px 24px 0 0" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="w-10 h-1 rounded-full mx-auto mb-3" style={{ background: "rgba(255,255,255,0.1)" }} />
          <div className="text-sm font-bold">Цвет машины</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onSelect(c.value)}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-90"
              style={currentColor === c.value ? {
                background: "rgba(74,158,255,0.15)",
                border: "1px solid rgba(74,158,255,0.4)",
                borderRadius: 12,
              } : { border: "1px solid transparent" }}
            >
              <div
                className="w-11 h-11 rounded-full shadow-lg"
                style={{
                  backgroundColor: c.value,
                  boxShadow: currentColor === c.value ? `0 0 15px ${c.value}66` : "none",
                }}
              />
              <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{c.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3.5 rounded-2xl text-sm font-semibold active:scale-[0.98] transition-transform"
          style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary)" }}
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
