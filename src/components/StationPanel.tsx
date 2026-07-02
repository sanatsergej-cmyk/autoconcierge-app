import { useState } from "react";
import type { Station, FuelStatus } from "../types";
import { reportStationStatus } from "../api/fuel";

interface StationPanelProps {
  station: Station;
  onReported: () => void; // родитель перезапросит список + начислит игровые очки
}

const STATUS_LABEL: Record<string, string> = {
  green: "Есть топливо",
  yellow: "Очередь / лимит",
  red: "Нет топлива",
};
const STATUS_COLOR: Record<string, string> = {
  green: "#22c55e",
  yellow: "#f59e0b",
  red: "#ef4444",
};

export function StationPanel({ station, onReported }: StationPanelProps) {
  const [submitting, setSubmitting] = useState<FuelStatus>(null);
  const [error, setError] = useState<string | null>(null);

  const handleReport = async (status: "green" | "yellow" | "red") => {
    setSubmitting(status);
    setError(null);
    try {
      await reportStationStatus(station.id, status);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
      onReported();
    } catch {
      setError("Не получилось отправить — попробуйте ещё раз");
    } finally {
      setSubmitting(null);
    }
  };

  return (
    <div className="card p-4 space-y-3 animate-fade-in">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>{station.name}</div>
          <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {station.address ?? `${station.city} — точный адрес уточняется`}
          </div>
        </div>
        {!station.is_verified && (
          <span
            className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0"
            style={{ background: "rgba(245,158,11,0.15)", color: "var(--accent-orange)" }}
          >
            уточняется
          </span>
        )}
      </div>

      <div
        className="flex items-center gap-2 p-3 rounded-xl"
        style={{ background: "rgba(255,255,255,0.03)" }}
      >
        <span
          className="w-2.5 h-2.5 rounded-full shrink-0"
          style={{ background: station.status ? STATUS_COLOR[station.status] : "#606080" }}
        />
        <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
          {station.status ? STATUS_LABEL[station.status] : "Нет данных"}
        </span>
        {!station.status_confirmed && station.status && (
          <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>(неподтверждено)</span>
        )}
        <span className="text-[11px] ml-auto" style={{ color: "var(--text-muted)" }}>{station.status_age}</span>
      </div>

      {station.fuel_types && (
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>⛽ {station.fuel_types}</div>
      )}
      {station.phone && (
        <div className="text-xs" style={{ color: "var(--text-secondary)" }}>📞 {station.phone}</div>
      )}

      <div>
        <div className="text-xs font-bold mb-2" style={{ color: "var(--text-secondary)" }}>Отметить статус</div>
        <div className="flex gap-2">
          {(["green", "yellow", "red"] as const).map((s) => (
            <button
              key={s}
              disabled={submitting !== null}
              onClick={() => handleReport(s)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              style={{ background: `${STATUS_COLOR[s]}22`, color: STATUS_COLOR[s], border: `1px solid ${STATUS_COLOR[s]}55` }}
            >
              {submitting === s ? "..." : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
        {error && <div className="text-[11px] mt-2" style={{ color: "var(--accent-red)" }}>{error}</div>}
      </div>
    </div>
  );
}
