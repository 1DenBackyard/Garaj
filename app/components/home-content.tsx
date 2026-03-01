'use client';

import { FormEvent, useMemo, useState } from 'react';
import { categories, formatPrice, ServiceCategory, services } from '@/data/services';

type FormState = {
  fullName: string;
  contact: string;
  car: string;
  comment: string;
  company: string;
};

const initialFormState: FormState = {
  fullName: '',
  contact: '',
  car: '',
  comment: '',
  company: ''
};

type RequestState = {
  type: 'idle' | 'success' | 'error';
  message: string;
};

export default function HomeContent() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Все' | ServiceCategory>('Все');
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestState, setRequestState] = useState<RequestState>({ type: 'idle', message: '' });

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
    setRequestState({ type: 'idle', message: '' });
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      });

      const payload = (await response.json()) as { ok: boolean; error?: string };

      if (!response.ok || !payload.ok) {
        throw new Error(payload.error || 'Не удалось отправить заявку.');
      }

      setForm(initialFormState);
      setRequestState({ type: 'success', message: 'Заявка отправлена' });
    } catch (error) {
      setRequestState({
        type: 'error',
        message: error instanceof Error ? error.message : 'Неизвестная ошибка при отправке.'
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 pb-16 pt-4 sm:px-6 lg:px-8">
      <header className="sticky top-0 z-20 mb-6 rounded-xl border border-zinc-200 bg-white/95 shadow-sm backdrop-blur">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <span className="text-base font-semibold sm:text-lg">Хороший сервис</span>
          <nav className="flex items-center gap-2 text-sm">
            <a
              href="#prices"
              className="rounded-lg border border-zinc-300 px-3 py-2 transition hover:bg-zinc-100"
            >
              Прайс
            </a>
            <a
              href="#book"
              className="rounded-lg bg-zinc-900 px-3 py-2 font-medium text-white transition hover:bg-zinc-700"
            >
              Записаться
            </a>
          </nav>
        </div>
      </header>

      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
        <h1 className="text-2xl font-bold leading-tight sm:text-4xl">
          Ремонт и обслуживание автомобилей
        </h1>
        <p className="mt-3 text-sm text-zinc-700 sm:text-base">
          Цены указаны за работы. Прокладки/химия/жидкости - отдельно.
        </p>

        <div className="mt-4 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-700">
          <p>Работаем по предварительной записи.</p>
          <p>Точную стоимость подтверждаем после осмотра.</p>
          <p>Расходники и сроки согласовываем заранее.</p>
        </div>
      </section>

      <section
        id="prices"
        className="mb-6 scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">Прайс</h2>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-700">Поиск по названию</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: замена масла"
              className="h-11 rounded-lg border border-zinc-300 px-3 outline-none ring-zinc-300 transition focus:ring"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-700">Категория</span>
            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value as 'Все' | ServiceCategory)}
              className="h-11 rounded-lg border border-zinc-300 px-3 outline-none ring-zinc-300 transition focus:ring"
            >
              <option value="Все">Все категории</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>

        <ul className="mt-4 divide-y divide-zinc-200">
          {filteredServices.map((service) => {
            const meta = [service.unit, service.note].filter(Boolean).join(' • ');

            return (
              <li key={service.id} className="py-3">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                  <p className="text-sm font-medium sm:text-base">{service.name}</p>
                  <p className="shrink-0 text-base font-semibold text-zinc-900 sm:text-lg">
                    {formatPrice(service.price)}
                  </p>
                </div>
                {meta && <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{meta}</p>}
              </li>
            );
          })}
        </ul>

        {filteredServices.length === 0 && (
          <p className="mt-3 text-sm text-zinc-500">По вашему запросу услуги не найдены.</p>
        )}
      </section>

      <section className="mb-6 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7">
        <h3 className="text-lg font-semibold sm:text-xl">Запчасти по себестоимости</h3>
        <p className="mt-2 text-sm text-zinc-700 sm:text-base">
          Можем достать запчасти практически на любое авто по себестоимости. Напишите в форме ниже,
          что нужно - проверим наличие и сроки.
        </p>
      </section>

      <section
        id="book"
        className="scroll-mt-24 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:p-7"
      >
        <h2 className="text-xl font-semibold sm:text-2xl">Обратная связь</h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-700">ФИО</span>
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Иванов Иван Иванович"
              className="h-11 rounded-lg border border-zinc-300 px-3 outline-none ring-zinc-300 transition focus:ring"
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-700">Телефон или Telegram</span>
            <input
              type="text"
              value={form.contact}
              onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
              placeholder="+7... или @nickname"
              className="h-11 rounded-lg border border-zinc-300 px-3 outline-none ring-zinc-300 transition focus:ring"
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-700">Марка и модель авто</span>
            <input
              type="text"
              value={form.car}
              onChange={(event) => setForm((prev) => ({ ...prev, car: event.target.value }))}
              placeholder="BMW X5 G05"
              className="h-11 rounded-lg border border-zinc-300 px-3 outline-none ring-zinc-300 transition focus:ring"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-700">Комментарий</span>
            <textarea
              value={form.comment}
              onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
              placeholder="Что нужно сделать, когда удобно приехать"
              className="min-h-24 rounded-lg border border-zinc-300 px-3 py-2 outline-none ring-zinc-300 transition focus:ring"
            />
          </label>

          <input
            type="text"
            name="company"
            value={form.company}
            onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))}
            className="hidden"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="h-11 rounded-lg bg-zinc-900 px-4 font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-500"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить в Telegram'}
          </button>
        </form>

        {requestState.type === 'success' && (
          <p className="mt-3 text-sm text-emerald-700">{requestState.message}</p>
        )}
        {requestState.type === 'error' && <p className="mt-3 text-sm text-rose-700">{requestState.message}</p>}
      </section>
    </main>
  );
}
