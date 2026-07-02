import { useEffect, useState, useCallback } from "react";
import type { Station } from "../types";
import { fetchStations } from "../api/fuel";
import { CrimeaMap } from "./CrimeaMap";
import { StationPanel } from "./StationPanel";

interface FuelMapTabProps {
  onReported: () => void; // начислить игровые очки в useGame
}

export function FuelMapTab({ onReported }: FuelMapTabProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    try {
      const data = await fetchStations();
      setStations(data);
      setError(false);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 5 * 60 * 1000); // обновление раз в 5 минут
    return () => clearInterval(interval);
  }, [load]);

  const selected = stations.find((s) => s.id === selectedId) ?? null;

  if (loading) {
    return <div className="px-4 mt-4 text-sm text-center" style={{ color: "var(--text-muted)" }}>Загружаем карту…</div>;
  }

  if (error) {
    return (
      <div className="px-4 mt-4 card p-4 text-sm text-center" style={{ color: "var(--accent-red)" }}>
        Не удалось загрузить карту. Проверьте соединение и попробуйте снова.
      </div>
    );
  }

  return (
    <div className="px-4 mt-1 space-y-3 animate-fade-in">
      <CrimeaMap stations={stations} selectedId={selectedId} onSelect={setSelectedId} />
      {selected && (
        <StationPanel
          station={selected}
          onReported={() => {
            load();
            onReported();
          }}
        />
      )}
    </div>
  );
}
