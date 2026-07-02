import { useState } from "react";
import { redeemCode } from "../api/user";

interface CodeScannerProps {
  onRedeemed: (newBalance: number) => void;
}

type Status = "idle" | "submitting" | "success" | "already_used" | "not_recognized" | "error";

export function CodeScanner({ onRedeemed }: CodeScannerProps) {
  const [manualCode, setManualCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [lastAward, setLastAward] = useState<number | null>(null);

  const canScanNative = typeof window.Telegram?.WebApp?.showScanQrPopup === "function";

  const submit = async (code: string) => {
    const trimmed = code.trim();
    if (!trimmed) return;
    setStatus("submitting");
    try {
      const res = await redeemCode(trimmed);
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("success");
      setLastAward(res.coins_awarded);
      setStatus("success");
      onRedeemed(res.new_balance);
      setManualCode("");
    } catch (e) {
      if (e instanceof Error && e.message === "ALREADY_USED") {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("warning");
        setStatus("already_used");
      } else if (e instanceof Error && e.message === "NOT_RECOGNIZED") {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error");
        setStatus("not_recognized");
      } else {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred("error");
        setStatus("error");
      }
    }
  };

  const handleNativeScan = () => {
    window.Telegram?.WebApp?.showScanQrPopup?.({ text: "Наведите на код на крышке бутылки" }, (text) => {
      window.Telegram?.WebApp?.closeScanQrPopup?.();
      submit(text);
      return true; // закрыть попап после первого распознанного кода
    });
  };

  return (
    <div className="px-4 mt-1 space-y-3 animate-fade-in">
      <div className="card-glow p-5 text-center relative overflow-hidden">
        <div className="absolute inset-0 shimmer" />
        <div className="relative z-10">
          <div className="text-5xl mb-2">📷</div>
          <div className="text-xl font-black mb-1" style={{ color: "var(--text-primary)" }}>Сканер кода</div>
          <div className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Отсканируй код на бутылке «Таврида» — получи баллы
          </div>
        </div>
      </div>

      {canScanNative && (
        <button
          onClick={handleNativeScan}
          disabled={status === "submitting"}
          className="w-full py-4 rounded-2xl font-bold text-sm text-white disabled:opacity-50"
          style={{ background: "linear-gradient(135deg, #4a9eff, #06b6d4)" }}
        >
          {status === "submitting" ? "Проверяем…" : "📷 Открыть сканер"}
        </button>
      )}

      <div className="card p-4 space-y-2">
        <div className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>
          {canScanNative ? "Или введи код вручную" : "Введи код вручную"}
        </div>
        <div className="flex gap-2">
          <input
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Код с крышки бутылки"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm"
            style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-primary)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <button
            onClick={() => submit(manualCode)}
            disabled={status === "submitting" || !manualCode.trim()}
            className="px-4 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: "var(--accent-blue)" }}
          >
            OK
          </button>
        </div>
      </div>

      {status === "success" && (
        <div className="card p-4 text-center text-sm" style={{ color: "var(--accent-green)" }}>
          ✅ Начислено +{lastAward} 🪙
        </div>
      )}
      {status === "already_used" && (
        <div className="card p-4 text-center text-sm" style={{ color: "var(--accent-orange)" }}>
          Этот код уже был использован
        </div>
      )}
      {status === "not_recognized" && (
        <div className="card p-4 text-center text-sm" style={{ color: "var(--accent-red)" }}>
          Это не код с продукции «Таврида» — проверьте, что сканируете код с крышки бутылки
        </div>
      )}
      {status === "error" && (
        <div className="card p-4 text-center text-sm" style={{ color: "var(--accent-red)" }}>
          Не получилось — попробуйте ещё раз
        </div>
      )}

      <div className="text-[11px] text-center" style={{ color: "var(--text-muted)" }}>
        Код сверяется со списком продукции «Таврида» и не может быть погашен дважды.
        Приз выдаётся только по предъявлению реальной бутылки с этим кодом
      </div>
    </div>
  );
}
