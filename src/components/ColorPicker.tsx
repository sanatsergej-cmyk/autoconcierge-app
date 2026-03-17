interface ColorPickerProps {
  currentColor: string;
  onSelect: (color: string) => void;
  onClose: () => void;
}

const COLORS = [
  { name: "Чёрный", value: "#1a1a2e" },
  { name: "Белый", value: "#f0f0f0" },
  { name: "Серебро", value: "#c0c0c0" },
  { name: "Красный", value: "#c0392b" },
  { name: "Синий", value: "#2980b9" },
  { name: "Тёмно-синий", value: "#1a3a5c" },
  { name: "Зелёный", value: "#27ae60" },
  { name: "Бордовый", value: "#6b2d5b" },
  { name: "Оранжевый", value: "#e67e22" },
  { name: "Жёлтый", value: "#f1c40f" },
  { name: "Серый", value: "#7f8c8d" },
  { name: "Бежевый", value: "#d4a574" },
];

export function ColorPicker({ currentColor, onSelect, onClose }: ColorPickerProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/30"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-md p-5 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-4">
          <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3" />
          <div className="text-sm font-bold">Выбери цвет машины</div>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {COLORS.map((c) => (
            <button
              key={c.value}
              onClick={() => onSelect(c.value)}
              className={`
                flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95
                ${currentColor === c.value ? "ring-2 ring-blue-400 bg-blue-50" : ""}
              `}
            >
              <div
                className="w-10 h-10 rounded-full shadow-inner border border-gray-200"
                style={{ backgroundColor: c.value }}
              />
              <span className="text-[10px] opacity-60">{c.name}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-4 py-3 bg-gray-100 rounded-xl text-sm font-medium text-gray-500 active:scale-[0.98] transition-transform"
        >
          Закрыть
        </button>
      </div>
    </div>
  );
}
