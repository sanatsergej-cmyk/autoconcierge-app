import { useState } from 'react';
import type { CrmScreen } from '../types';
import { Schedule } from './Schedule';
import { ClientDirectory } from './ClientDirectory';
import { PartsTerminal } from './PartsTerminal';

const CRM_TABS: { id: CrmScreen; label: string; icon: string }[] = [
  { id: 'schedule', label: 'Расписание', icon: 'calendar_month' },
  { id: 'clients', label: 'Клиенты', icon: 'group' },
  { id: 'parts', label: 'Запчасти', icon: 'build' },
];

export function CrmPanel() {
  const [screen, setScreen] = useState<CrmScreen>('schedule');

  return (
    <div className="flex flex-col min-h-screen bg-vantablack text-bleached">
      {/* CRM sub-nav */}
      <div className="flex border-b-2 border-gunmetal bg-asphalt">
        {CRM_TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setScreen(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-wider transition-colors ${
              screen === t.id
                ? 'text-primary border-b-2 border-primary'
                : 'text-steel'
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* CRM content */}
      <div className="flex-1 overflow-y-auto pb-16">
        {screen === 'schedule' && <Schedule />}
        {screen === 'clients' && <ClientDirectory />}
        {screen === 'parts' && <PartsTerminal />}
      </div>
    </div>
  );
}