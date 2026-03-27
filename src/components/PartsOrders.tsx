import { useState } from 'react';
import { MOCK_PARTS_ORDERS } from '../data/mockData';
import type { PartsOrder, OrderStep } from '../types';

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  placed: { label: 'ОФОРМЛЕН', color: 'text-steel', bg: 'bg-gunmetal' },
  confirmed: { label: 'ПОДТВЕРЖДЁН', color: 'text-primary', bg: 'bg-asphalt' },
  shipped: { label: 'ОТПРАВЛЕН', color: 'text-primary', bg: 'bg-asphalt' },
  in_transit: { label: 'В ПУТИ', color: 'text-alert', bg: 'bg-asphalt' },
  delivered: { label: 'ДОСТАВЛЕН', color: 'text-stock-green', bg: 'bg-stock-green-bg' },
};

const FILTERS = ['ВСЕ', 'В ПУТИ', 'ДОСТАВЛЕНЫ'];

function TrackingTimeline({ steps }: { steps: OrderStep[] }) {
  return (
    <div className="mt-3 space-y-0">
      {steps.map((step, i) => {
        const isDone = step.status === 'done';
        const isActive = step.status === 'active';
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="flex gap-3 min-h-[40px]">
            <div className="flex flex-col items-center w-4 shrink-0">
              <div className={`w-3 h-3 shrink-0 border-2 ${
                isDone ? 'bg-stock-green border-stock-green' :
                isActive ? 'bg-primary border-primary animate-neon-pulse' :
                'bg-transparent border-gunmetal'
              }`} />
              {!isLast && (
                <div className={`w-[2px] flex-1 min-h-[16px] ${isDone ? 'bg-stock-green' : 'bg-gunmetal'}`} />
              )}
            </div>
            <div className="pb-2 flex-1">
              <span className={`text-xs font-bold uppercase ${
                isDone ? 'text-steel' : isActive ? 'text-bleached' : 'text-gunmetal'
              }`}>
                {step.label}
              </span>
              {step.detail && (
                <span className="text-xs text-steel ml-2">{step.detail}</span>
              )}
              {step.date && (
                <div className="font-mono text-[10px] text-steel mt-0.5">{step.date}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderRow({ order }: { order: PartsOrder }) {
  const [expanded, setExpanded] = useState(false);
  const statusInfo = STATUS_LABELS[order.status] || STATUS_LABELS.placed;

  const progress = order.trackingSteps.filter(s => s.status === 'done').length / order.trackingSteps.length;

  return (
    <div className="bg-asphalt border-2 border-gunmetal overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 text-left active:bg-gunmetal transition-colors"
      >
        <div className="flex justify-between items-start mb-2">
          <span className="font-mono text-xs text-steel">{order.id}</span>
          <span className={`text-xs font-bold uppercase px-2 py-0.5 border ${statusInfo.color} ${statusInfo.bg} border-current`}>
            {statusInfo.label}
          </span>
        </div>

        <h3 className="text-sm font-bold uppercase text-bleached leading-tight">{order.partName}</h3>
        <div className="flex items-center gap-2 mt-1 text-steel font-mono text-xs">
          <span>SKU: {order.sku}</span>
          <span>·</span>
          <span>×{order.qty}</span>
          <span>·</span>
          <span className="text-primary font-bold">{(order.price * order.qty).toLocaleString()} ₽</span>
        </div>

        <div className="flex items-center gap-2 mt-2 text-xs">
          <span className="text-steel">{order.forVehicle}</span>
          {order.forJob !== '-' && (
            <>
              <span className="text-gunmetal">·</span>
              <span className="text-primary font-mono">{order.forJob}</span>
            </>
          )}
        </div>

        {/* Route + progress */}
        <div className="mt-3 flex items-center gap-2">
          <span className="text-xs text-steel">{order.origin}</span>
          <div className="flex-1 h-[3px] bg-gunmetal relative">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${Math.round(progress * 100)}%` }}
            />
            {progress < 1 && progress > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-primary"
                style={{ left: `${Math.round(progress * 100)}%`, marginLeft: -4 }}
              />
            )}
          </div>
          <span className="text-xs text-steel">{order.destination}</span>
        </div>

        {order.eta && order.status !== 'delivered' && (
          <div className="mt-2 font-mono text-xs text-alert">
            ETA: {order.eta}
          </div>
        )}
      </button>

      {/* Expanded tracking */}
      {expanded && (
        <div className="border-t-2 border-vantablack p-4 bg-vantablack animate-fade-in">
          <h4 className="text-xs font-bold uppercase tracking-widest text-steel mb-2">Трекинг</h4>
          <TrackingTimeline steps={order.trackingSteps} />

          <div className="mt-3 grid grid-cols-2 gap-2">
            <div className="bg-asphalt border border-gunmetal p-2">
              <span className="text-[10px] text-steel uppercase block">Поставщик</span>
              <span className="text-xs font-bold text-bleached">{order.supplier}</span>
            </div>
            <div className="bg-asphalt border border-gunmetal p-2">
              <span className="text-[10px] text-steel uppercase block">Маршрут</span>
              <span className="text-xs font-bold text-bleached">{order.origin} → {order.destination}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function PartsOrders() {
  const [filter, setFilter] = useState('ВСЕ');

  const filtered = MOCK_PARTS_ORDERS.filter(o => {
    if (filter === 'В ПУТИ') return ['shipped', 'in_transit', 'confirmed', 'placed'].includes(o.status);
    if (filter === 'ДОСТАВЛЕНЫ') return o.status === 'delivered';
    return true;
  });

  const inTransitCount = MOCK_PARTS_ORDERS.filter(o => o.status !== 'delivered').length;
  const totalValue = MOCK_PARTS_ORDERS.reduce((s, o) => s + o.price * o.qty, 0);

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      <header className="sticky top-0 z-50 bg-vantablack border-b-2 border-asphalt pt-4 pb-3 px-4">
        <h1 className="font-bold text-xl tracking-widest uppercase text-bleached text-center mb-3">
          ЗАКАЗЫ ДЕТАЛЕЙ
        </h1>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="bg-asphalt border border-gunmetal p-2 text-center">
            <div className="font-mono text-lg font-bold text-primary">{MOCK_PARTS_ORDERS.length}</div>
            <div className="text-[10px] text-steel uppercase">Всего</div>
          </div>
          <div className="bg-asphalt border border-gunmetal p-2 text-center">
            <div className="font-mono text-lg font-bold text-alert">{inTransitCount}</div>
            <div className="text-[10px] text-steel uppercase">В пути</div>
          </div>
          <div className="bg-asphalt border border-gunmetal p-2 text-center">
            <div className="font-mono text-lg font-bold text-primary">{totalValue.toLocaleString()}₽</div>
            <div className="text-[10px] text-steel uppercase">Сумма</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-1 h-10 font-bold text-xs uppercase tracking-wider border-2 transition-colors ${
                filter === f
                  ? 'bg-primary text-vantablack border-primary'
                  : 'bg-asphalt text-bleached border-gunmetal'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <main className="flex-1 p-4 space-y-3 pb-16">
        {filtered.map(order => (
          <OrderRow key={order.id} order={order} />
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gunmetal">
            <h3 className="text-xl font-bold uppercase tracking-widest">НЕТ ЗАКАЗОВ</h3>
          </div>
        )}
      </main>
    </div>
  );
}
