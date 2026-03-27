import { useState } from 'react';
import { MOCK_CLIENTS } from '../data/mockData';

export function ClientDirectory() {
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = MOCK_CLIENTS.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.vehicles.some((v) => v.plate.toLowerCase().includes(search.toLowerCase()))
  );

  // Group by first letter
  const grouped = filtered.reduce<Record<string, typeof filtered>>((acc, c) => {
    const letter = c.name[0];
    if (!acc[letter]) acc[letter] = [];
    acc[letter].push(c);
    return acc;
  }, {});

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Header & Search */}
      <header className="sticky top-0 z-50 bg-vantablack border-b border-gunmetal pb-4 pt-4 px-4">
        <div className="flex items-center justify-between mb-3">
          <h1 className="font-bold text-xl tracking-tight uppercase text-bleached">Клиенты</h1>
          <button className="w-12 h-12 flex items-center justify-center bg-asphalt border border-gunmetal active:bg-gunmetal transition-colors">
            <span className="material-symbols-outlined text-primary text-2xl">person_add</span>
          </button>
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-steel text-2xl">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-14 bg-asphalt border-2 border-gunmetal text-bleached placeholder:text-steel pl-12 pr-4 font-medium text-base focus:outline-none focus:border-primary transition-colors uppercase"
            placeholder="ИМЯ ИЛИ НОМЕР АВТО..."
          />
        </div>
      </header>

      {/* Client list */}
      <main className="flex-1 overflow-y-auto pb-24">
        {Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([letter, clients]) => (
          <div key={letter}>
            <div className="px-4 py-2 bg-asphalt border-y border-gunmetal sticky top-[120px] z-40">
              <span className="font-bold text-primary text-lg">{letter}</span>
            </div>
            {clients.map((c) => (
              <div key={c.id} className="border-b border-gunmetal bg-vantablack">
                <button
                  onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                  className={`w-full flex items-center justify-between p-4 min-h-[72px] text-left border-l-4 transition-colors ${
                    expandedId === c.id ? 'border-l-primary bg-gunmetal' : 'border-l-transparent hover:bg-asphalt'
                  }`}
                >
                  <div className="flex-1 pr-4">
                    <div className="flex items-baseline justify-between mb-1">
                      <h2 className="font-bold text-base uppercase truncate text-bleached">{c.name}</h2>
                      <span className="font-mono text-sm text-steel">{c.visits} ВИЗ.</span>
                    </div>
                    <div className="flex items-center text-steel">
                      <span className="material-symbols-outlined text-[16px] mr-1">call</span>
                      <span className="font-mono text-sm">{c.phone}</span>
                    </div>
                    {c.isVip && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-primary text-vantablack text-xs font-bold uppercase">VIP</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={`tel:${c.phone.replace(/\D/g, '')}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-12 h-12 flex items-center justify-center border-2 border-primary text-primary hover:bg-primary hover:text-vantablack transition-colors"
                    >
                      <span className="material-symbols-outlined">phone_in_talk</span>
                    </a>
                    <span className={`material-symbols-outlined text-steel transition-transform duration-300 ${expandedId === c.id ? 'rotate-180 text-primary' : ''}`}>
                      expand_more
                    </span>
                  </div>
                </button>

                {/* Expanded vehicles */}
                {expandedId === c.id && (
                  <div className="bg-asphalt p-4 space-y-3 animate-fade-in border-t-2 border-gunmetal">
                    <h3 className="font-bold text-sm text-steel uppercase tracking-wider mb-2">Автомобили</h3>
                    {c.vehicles.map((v, i) => (
                      <div key={i} className={`${v.inShop ? 'bg-gunmetal' : 'bg-vantablack'} border border-gunmetal p-3 flex justify-between items-center`}>
                        <div>
                          <div className="font-bold uppercase text-bleached text-sm">{v.make}</div>
                          <div className="font-mono text-xs text-steel mt-1">VIN: {v.vin.slice(0, 11)}...</div>
                        </div>
                        <div className="flex flex-col items-end">
                          {v.inShop ? (
                            <span className="bg-primary text-vantablack font-bold text-xs px-2 py-1 uppercase">В БОКСЕ</span>
                          ) : (
                            <span className="text-steel font-bold text-xs px-2 py-1 border border-steel uppercase">ИСТОРИЯ</span>
                          )}
                          <span className="font-mono text-xs text-steel mt-1">{v.plate}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full mt-1 py-3 border-2 border-dashed border-gunmetal text-steel font-bold uppercase text-sm hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
                      <span className="material-symbols-outlined text-[20px]">directions_car</span>
                      Добавить авто
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex items-center justify-center h-48 text-gunmetal">
            <h3 className="text-xl font-bold uppercase tracking-widest">КЛИЕНТЫ НЕ НАЙДЕНЫ</h3>
          </div>
        )}
      </main>
    </div>
  );
}
