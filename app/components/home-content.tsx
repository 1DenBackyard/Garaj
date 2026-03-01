'use client';

import { FormEvent, useMemo, useState } from 'react';
import { categories, formatPrice, services, ServiceCategory } from '@/data/services';

type FormState = {
  name: string;
  phone: string;
  car: string;
  serviceId: string;
  comment: string;
  company: string;
};

const initialFormState: FormState = {
  name: '',
  phone: '',
  car: '',
  serviceId: '',
  comment: '',
  company: ''
};

export default function HomeContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Все' | ServiceCategory>('Все');
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({
    type: 'idle',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const categoryMatch = activeCategory === 'Все' || service.category === activeCategory;
      const queryMatch =
        normalizedQuery.length === 0 || service.name.toLowerCase().includes(normalizedQuery);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const data = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Не удалось отправить заявку.');
      }

      setForm(initialFormState);
      setStatus({ type: 'success', message: 'Заявка отправлена' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка при отправке.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16">
      <header className="sticky top-0 z-10 mb-10 border-b border-slate-200 bg-slate-50/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between py-4">
          <p className="text-xl font-semibold">Автосервис</p>
          <nav className="flex gap-2 text-sm font-medium">
            <a className="rounded-md px-3 py-2 hover:bg-slate-200" href="#prices">
              Прайс
            </a>
            <a className="rounded-md px-3 py-2 hover:bg-slate-200" href="#book">
              Записаться
            </a>
          </nav>
        </div>
      </header>

      <section className="mb-12 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="mb-3 text-3xl font-bold">Ремонт и обслуживание автомобилей</h1>
        <p className="mb-4 text-slate-700">
          Цены указаны за работы. Прокладки/химия/жидкости — отдельно.
        </p>
        <div className="space-y-1 text-sm text-slate-600">
          <p>• Работаем по предварительной записи.</p>
          <p>• Финальная стоимость зависит от состояния узлов и доступа к ним.</p>
          <p>• Расходники согласовываем перед началом работ.</p>
        </div>
      </section>

      <section id="prices" className="mb-12 scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Прайс</h2>

        <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Поиск услуги"
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
          />

          <select
            value={activeCategory}
            onChange={(event) => setActiveCategory(event.target.value as 'Все' | ServiceCategory)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
          >
            <option value="Все">Все категории</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <ul className="divide-y divide-slate-200">
          {filteredServices.map((service) => (
            <li key={service.id} className="py-3">
              <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                <p className="font-medium">{service.name}</p>
                <p className="font-semibold">{formatPrice(service.price)}</p>
              </div>
              <p className="text-sm text-slate-600">
                {service.unit ? `(${service.unit})` : ''}
                {service.unit && service.note ? ' — ' : ''}
                {service.note ? service.note : ''}
              </p>
            </li>
          ))}
        </ul>

        {filteredServices.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">По вашему запросу ничего не найдено.</p>
        )}
      </section>

      <section id="book" className="scroll-mt-24 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-2xl font-semibold">Записаться</h2>

        <form onSubmit={handleSubmit} className="grid gap-3">
          <input
            type="text"
            placeholder="Имя"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
            required
          />

          <input
            type="tel"
            placeholder="Телефон"
            value={form.phone}
            onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
            required
          />

          <input
            type="text"
            placeholder="Марка / модель"
            value={form.car}
            onChange={(event) => setForm((prev) => ({ ...prev, car: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
          />

          <select
            value={form.serviceId}
            onChange={(event) => setForm((prev) => ({ ...prev, serviceId: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
          >
            <option value="">Услуга (не выбрано)</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>

          <textarea
            placeholder="Комментарий"
            value={form.comment}
            onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
            className="min-h-24 rounded-md border border-slate-300 px-3 py-2 outline-none ring-slate-300 focus:ring"
          />

          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            aria-hidden="true"
            name="company"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить в Telegram'}
          </button>
        </form>

        {status.type === 'success' && <p className="mt-3 text-sm text-emerald-700">{status.message}</p>}
        {status.type === 'error' && <p className="mt-3 text-sm text-rose-700">{status.message}</p>}
      </section>
    </main>
  );
}
