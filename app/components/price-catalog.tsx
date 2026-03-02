'use client';

import { useMemo, useState } from 'react';
import { categories, formatPrice, services, ServiceCategory } from '@/data/services';

export default function PriceCatalog() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Все' | ServiceCategory>('Все');
  const [selectedForCalc, setSelectedForCalc] = useState<string[]>([]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return services.filter((service) => {
      const categoryMatch = activeCategory === 'Все' || service.category === activeCategory;
      const queryMatch = normalizedQuery.length === 0 || service.name.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  const calcTotal = useMemo(
    () =>
      selectedForCalc.reduce((sum, id) => {
        const service = services.find((item) => item.id === id);
        return !service || Array.isArray(service.price) ? sum : sum + service.price;
      }, 0),
    [selectedForCalc]
  );

  return (
    <div className="space-y-6">
      <section className="m-card p-6 md:p-7">
        <h1 className="m-title mb-4 text-3xl font-bold">Прайс</h1>
        <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
          <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск услуги" className="input-premium" />
          <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value as 'Все' | ServiceCategory)} className="input-premium">
            <option value="Все">Все категории</option>
            {categories.map((category) => <option key={category} value={category}>{category}</option>)}
          </select>
        </div>
        <ul className="divide-y divide-white/10">
          {filteredServices.map((service) => (
            <li key={service.id} className="rounded-xl py-3 transition-colors hover:bg-white/[0.03]">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <p className="font-medium text-slate-100">{service.name}</p>
                <p className="font-bold text-garage-amber">{formatPrice(service.price)}</p>
              </div>
              <p className="text-xs text-slate-400">{service.unit ? `(${service.unit})` : ''}{service.unit && service.note ? ' — ' : ''}{service.note || ''}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="m-card p-6 md:p-7">
        <h2 className="m-title mb-2 text-2xl font-bold">Калькулятор работ</h2>
        <p className="mb-3 text-sm text-slate-400">Интерфейс сборки работ в стиле digital cockpit.</p>
        <div className="grid gap-2">
          {services.map((service) => (
            <label key={service.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/25 p-2.5 transition-all hover:border-garage-mblue/35 hover:bg-white/[0.03]">
              <span className="text-sm">{service.name}</span>
              <span className="flex items-center gap-2">
                <span className="text-xs text-garage-mblue">{formatPrice(service.price)}</span>
                <input type="checkbox" className="h-4 w-4 accent-garage-mblue" disabled={Array.isArray(service.price)} checked={selectedForCalc.includes(service.id)} onChange={(e) => setSelectedForCalc((prev) => e.target.checked ? [...prev, service.id] : prev.filter((id) => id !== service.id))} />
              </span>
            </label>
          ))}
        </div>
        <p className="mt-4 text-lg font-bold text-garage-mblue">Итого: {new Intl.NumberFormat('ru-RU').format(calcTotal)} ₽</p>
      </section>
    </div>
  );
}
