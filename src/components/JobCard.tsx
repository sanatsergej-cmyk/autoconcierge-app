import { useState } from 'react';
import type { Job, JobStatus } from '../types';

const STATUSES: { value: JobStatus; label: string }[] = [
  { value: 'waiting', label: 'ОЖИДАНИЕ' },
  { value: 'diagnostics', label: 'ДИАГНОСТИКА' },
  { value: 'in_progress', label: 'В РАБОТЕ' },
  { value: 'ready', label: 'ГОТОВ' },
  { value: 'paid', label: 'ОПЛАЧЕН' },
];

const SERVICES = [
  { icon: 'build', name: 'Замена тормозных колодок', price: 3500 },
  { icon: 'oil_barrel', name: 'Замена масла (синтетика)', price: 2500 },
];

const PARTS = [
  { name: 'Колодки тормозные TRW (передние)', sku: 'BRK-C-774', inStock: true },
  { name: 'Фильтр масляный MANN', sku: 'FLT-O-992', inStock: false },
];

interface JobCardProps {
  job: Job;
  onBack: () => void;
}

export function JobCard({ job, onBack }: JobCardProps) {
  const [status, setStatus] = useState<JobStatus>(job.status);
  const [showStatusPicker, setShowStatusPicker] = useState(false);

  const currentStatus = STATUSES.find((s) => s.value === status)!;
  const hasMissingParts = PARTS.some((p) => !p.inStock);

  const statusColor = status === 'ready' ? 'text-stock-green' : status === 'waiting' ? 'text-steel' : 'text-primary';

  return (
    <div className="flex flex-col pb-24 animate-fade-in">
      {/* Header */}
      <header className="flex items-center bg-vantablack p-4 border-b-2 border-gunmetal sticky top-0 z-10">
        <button onClick={onBack} className="text-primary flex w-12 h-12 shrink-0 items-center justify-center border-2 border-gunmetal bg-asphalt active:bg-gunmetal transition-colors">
          <span className="material-symbols-outlined text-[28px]">arrow_back</span>
        </button>
        <h2 className="text-bleached text-lg font-bold uppercase tracking-widest ml-4 flex-1">ЗАКАЗ #{job.id.padStart(4, '0')}</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Status Header */}
        <button
          onClick={() => setShowStatusPicker(!showStatusPicker)}
          className="w-full h-28 bg-asphalt border-2 border-primary offset-shadow flex flex-col items-center justify-center active:translate-y-1 active:translate-x-1 active:shadow-none transition-all relative overflow-hidden"
        >
          <span className="text-steel text-sm font-bold uppercase tracking-widest mb-1">Текущий статус</span>
          <h1 className={`${statusColor} text-[28px] font-bold leading-none tracking-tight uppercase`}>[{currentStatus.label}]</h1>
          <span className="text-primary mt-2 opacity-70 flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">swap_vert</span>
            <span className="text-xs font-mono">НАЖМИТЕ ДЛЯ СМЕНЫ</span>
          </span>
        </button>

        {/* Status picker */}
        {showStatusPicker && (
          <div className="bg-asphalt border-2 border-gunmetal p-3 space-y-2 animate-slide-up">
            {STATUSES.map((s) => (
              <button
                key={s.value}
                onClick={() => { setStatus(s.value); setShowStatusPicker(false); }}
                className={`w-full h-12 border-2 font-bold uppercase tracking-wider text-sm transition-all ${
                  status === s.value
                    ? 'bg-primary text-vantablack border-primary'
                    : 'bg-vantablack text-bleached border-gunmetal hover:border-primary'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}

        {/* Vehicle */}
        <section className="bg-asphalt border-2 border-gunmetal p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="material-symbols-outlined text-primary text-[28px]">directions_car</span>
            <h3 className="text-lg font-bold uppercase tracking-wider text-bleached">Автомобиль</h3>
          </div>
          <p className="text-xl font-bold text-bleached uppercase">{job.vehicle} / {job.vehicleYear}</p>
          <div className="grid grid-cols-2 gap-3 mt-3">
            <div className="bg-vantablack border-2 border-gunmetal p-3">
              <p className="text-steel text-xs uppercase font-bold mb-1">VIN</p>
              <p className="font-mono text-sm text-primary break-all">XWEPH81ABK0012345</p>
            </div>
            <div className="bg-vantablack border-2 border-gunmetal p-3">
              <p className="text-steel text-xs uppercase font-bold mb-1">Пробег</p>
              <p className="font-mono text-sm text-bleached">84 201 км</p>
            </div>
          </div>
        </section>

        {/* Client */}
        <section className="bg-asphalt border-2 border-gunmetal p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-primary text-[28px]">person</span>
              <h3 className="text-lg font-bold uppercase tracking-wider text-bleached">Клиент</h3>
            </div>
            <a href="tel:+79781234567" className="w-12 h-12 bg-vantablack border-2 border-primary flex items-center justify-center text-primary active:bg-primary active:text-vantablack transition-colors">
              <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
            </a>
          </div>
          <p className="text-xl font-bold text-bleached uppercase">{job.client}</p>
          <p className="font-mono text-steel text-sm">+7 978 123-45-67</p>
        </section>

        {/* Services */}
        <section className="space-y-2">
          <h3 className="text-steel text-sm font-bold uppercase tracking-widest px-1 mb-2">Услуги</h3>
          {SERVICES.map((s, i) => (
            <div key={i} className="h-14 bg-asphalt border-2 border-gunmetal flex items-center justify-between px-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-steel text-xl">{s.icon}</span>
                <span className="text-bleached font-bold text-sm uppercase">{s.name}</span>
              </div>
              <span className="font-mono text-primary font-bold text-sm">{s.price.toLocaleString()} ₽</span>
            </div>
          ))}
          <div className="h-14 bg-vantablack border-2 border-dashed border-gunmetal flex items-center justify-center px-4 active:border-primary transition-colors text-steel active:text-primary cursor-pointer">
            <span className="material-symbols-outlined mr-2">add</span>
            <span className="font-bold text-sm uppercase tracking-wider">Добавить услугу</span>
          </div>
        </section>

        {/* Parts */}
        <section className="space-y-2 pt-4 border-t-2 border-gunmetal">
          <h3 className="text-steel text-sm font-bold uppercase tracking-widest px-1 mb-2">Запчасти</h3>
          {PARTS.map((p, i) => (
            <div key={i} className={`bg-asphalt border-2 ${p.inStock ? 'border-gunmetal' : 'border-alert/30'} p-3 flex flex-col gap-2 relative overflow-hidden`}>
              {!p.inStock && <div className="absolute left-0 top-0 bottom-0 w-1 bg-alert" />}
              <div className="flex justify-between items-start">
                <div className={!p.inStock ? 'pl-2' : ''}>
                  <p className="text-bleached font-bold uppercase text-sm">{p.name}</p>
                  <p className="font-mono text-steel text-xs mt-1">SKU: {p.sku}</p>
                </div>
                <span className={`px-2 py-1 font-mono text-xs font-bold uppercase tracking-wider border ${
                  p.inStock
                    ? 'bg-stock-green-bg border-stock-green-border text-stock-green'
                    : 'bg-[#3a1a1a] border-alert text-alert'
                }`}>
                  [{p.inStock ? 'В НАЛИЧИИ' : 'НЕТ'}]
                </span>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Bottom action */}
      <div className="fixed bottom-20 left-0 right-0 p-4 bg-vantablack border-t-2 border-gunmetal z-20">
        {hasMissingParts ? (
          <button className="w-full h-16 bg-alert text-vantablack font-bold text-base uppercase tracking-wider border-2 border-alert offset-shadow-alert active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[28px]">warning</span>
            ОЖИДАНИЕ ЗАПЧАСТЕЙ
          </button>
        ) : (
          <button className="w-full h-16 bg-primary text-vantablack font-bold text-base uppercase tracking-wider border-2 border-primary offset-shadow active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-3">
            <span className="material-symbols-outlined text-[28px]">check_circle</span>
            ЗАВЕРШИТЬ РАБОТУ
          </button>
        )}
      </div>
    </div>
  );
}
