import { useState } from 'react';
import { MOCK_PARTS, PART_CATEGORIES } from '../data/mockData';

export function PartsTerminal() {
  const [activeCategory, setActiveCategory] = useState('ВСЕ');
  const [search, setSearch] = useState('');

  const filtered = MOCK_PARTS.filter((p) => {
    const matchCategory = activeCategory === 'ВСЕ' || p.category.toUpperCase() === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="flex flex-col min-h-screen animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-vantablack border-b-2 border-asphalt pt-4 pb-3 px-4">
        <h1 className="font-bold text-xl tracking-widest uppercase text-bleached text-center mb-3">ТЕРМИНАЛ ЗАПЧАСТЕЙ</h1>

        {/* Search */}
        <div className="relative mb-3">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-steel text-xl">search</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 bg-asphalt border-2 border-gunmetal text-bleached placeholder:text-steel pl-12 pr-4 font-medium text-sm focus:outline-none focus:border-primary transition-colors uppercase"
            placeholder="ПОИСК ПО НАЗВАНИЮ / SKU..."
          />
        </div>
      </header>

      <main className="flex-1 flex flex-col p-4 gap-4 relative">
        {/* Scanner Banner */}
        <button className="w-full h-24 border-[3px] border-dashed border-primary bg-asphalt flex flex-col items-center justify-center gap-2 active:bg-primary active:text-vantablack transition-colors relative overflow-hidden group">
          <span className="material-symbols-outlined text-3xl text-primary group-active:text-vantablack">barcode_scanner</span>
          <span className="font-bold text-base tracking-widest uppercase text-primary group-active:text-vantablack">СКАНИРОВАТЬ ШТРИХКОД</span>
        </button>

        {/* Category tabs */}
        <div className="flex overflow-x-auto gap-2 pb-1 -mx-1 px-1" style={{ scrollbarWidth: 'none' }}>
          {PART_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`h-12 px-5 flex-shrink-0 font-bold text-sm tracking-wider uppercase border-2 transition-colors ${
                activeCategory === cat
                  ? 'bg-primary text-vantablack border-primary offset-shadow'
                  : 'bg-asphalt text-bleached border-asphalt hover:border-steel'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Parts list */}
        <div className="flex flex-col gap-3 pb-24">
          {filtered.map((part) => (
            <div key={part.id} className="bg-asphalt border-2 border-gunmetal p-4 flex flex-col gap-3 relative overflow-hidden">
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <span className="font-mono text-steel text-xs block mb-1">SKU: {part.sku}</span>
                  <h3 className="font-bold text-base uppercase leading-tight text-bleached">{part.name}</h3>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-steel text-xs uppercase tracking-widest mb-1">КОЛ-ВО</span>
                  <span className={`font-mono font-bold text-3xl ${
                    part.qty === 0 ? 'text-alert' : part.isLowStock ? 'text-alert animate-neon-pulse' : 'text-primary'
                  }`}>
                    {part.qty}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 border-t-2 border-vantablack pt-3">
                {part.qty === 0 ? (
                  <>
                    <span className="material-symbols-outlined text-alert text-sm">error</span>
                    <span className="font-mono text-sm text-alert uppercase">Нет в наличии</span>
                  </>
                ) : part.isLowStock ? (
                  <>
                    <span className="material-symbols-outlined text-alert text-sm">warning</span>
                    <span className="font-mono text-sm text-alert uppercase">Мало — {part.location}</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-primary text-sm">inventory_2</span>
                    <span className="font-mono text-sm text-primary uppercase">В наличии — {part.location}</span>
                  </>
                )}
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="flex items-center justify-center h-48 text-gunmetal">
              <h3 className="text-xl font-bold uppercase tracking-widest">ЗАПЧАСТИ НЕ НАЙДЕНЫ</h3>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
