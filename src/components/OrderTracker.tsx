import { useState } from "react";
import { MOCK_CLIENT_ORDERS } from "../data/mockData";
import type { ClientOrder, OrderStep } from "../types";

function StepLine({ step, isLast }: { step: OrderStep; isLast: boolean }) {
  const isDone = step.status === "done";
  const isActive = step.status === "active";

  const dotColor = isDone
    ? "linear-gradient(135deg, #22c55e, #06b6d4)"
    : isActive
      ? "linear-gradient(135deg, #4a9eff, #8b5cf6)"
      : "rgba(255,255,255,0.08)";

  const lineColor = isDone ? "#22c55e" : "rgba(255,255,255,0.06)";

  return (
    <div className="flex gap-3 min-h-[56px]">
      {/* Dot + line */}
      <div className="flex flex-col items-center w-6 shrink-0">
        <div
          className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center ${isActive ? "animate-glow-pulse" : ""}`}
          style={{ background: dotColor }}
        >
          {isDone && <span className="text-[10px] text-white font-bold">✓</span>}
          {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
        </div>
        {!isLast && (
          <div className="w-[2px] flex-1 min-h-[20px]" style={{ background: lineColor }} />
        )}
      </div>

      {/* Content */}
      <div className="pb-4 flex-1">
        <div className={`text-sm font-semibold ${isDone ? "text-gray-400" : isActive ? "text-white" : "text-gray-600"}`}>
          {step.label}
        </div>
        {step.detail && (
          <div className="text-xs mt-0.5" style={{ color: isActive ? "var(--accent-blue)" : "var(--text-muted)" }}>
            {step.detail}
          </div>
        )}
        {step.date && (
          <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
            {step.date}
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order }: { order: ClientOrder }) {
  const [expanded, setExpanded] = useState(true);
  const activeIdx = order.steps.findIndex((s) => s.status === "active");
  const progress = activeIdx >= 0 ? activeIdx / order.steps.length : 1;

  return (
    <div className="card-glow p-4 space-y-3 relative overflow-hidden">
      <div className="absolute inset-0 shimmer" />
      <div className="relative z-10">
        {/* Header */}
        <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {order.id}
              </div>
              <div className="text-base font-bold text-white mt-0.5">
                🚗 {order.vehicle}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {order.plate} · {order.service}
              </div>
            </div>
            <span className={`text-gray-500 text-lg transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}>
              ▾
            </span>
          </div>

          {/* Progress bar */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.round(progress * 100)}%`,
                  background: progress >= 1 ? "linear-gradient(90deg, #22c55e, #06b6d4)" : "linear-gradient(90deg, #4a9eff, #8b5cf6)",
                }}
              />
            </div>
            <span className="text-[10px] font-bold" style={{ color: "var(--accent-blue)" }}>
              {Math.round(progress * 100)}%
            </span>
          </div>

          {order.estimatedReady && (
            <div className="mt-2 text-xs" style={{ color: "var(--accent-orange)" }}>
              ⏱ Ожидание: ~{order.estimatedReady}
            </div>
          )}
        </button>

        {/* Steps */}
        {expanded && (
          <div className="mt-4 animate-fade-in">
            {order.steps.map((step, i) => (
              <StepLine key={i} step={step} isLast={i === order.steps.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function OrderTracker() {
  const orders = MOCK_CLIENT_ORDERS;
  const activeOrders = orders.filter((o) => o.steps.some((s) => s.status === "active"));

  return (
    <div className="px-4 mt-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <div className="text-3xl mb-1">📍</div>
        <div
          className="text-lg font-black"
          style={{
            background: "linear-gradient(135deg, #4a9eff, #8b5cf6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Мои заказы
        </div>
        <div className="text-xs" style={{ color: "var(--text-muted)" }}>
          {activeOrders.length} активных
        </div>
      </div>

      {/* Orders */}
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}

      {orders.length === 0 && (
        <div className="card p-8 text-center">
          <div className="text-3xl mb-2">🔧</div>
          <div className="text-sm" style={{ color: "var(--text-muted)" }}>
            Нет активных заказов
          </div>
        </div>
      )}
    </div>
  );
}
