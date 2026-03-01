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

type CategoryBlock = {
  category: ServiceCategory;
  items: typeof services;
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
      const byCategory = activeCategory === 'Все' || service.category === activeCategory;
      const byQuery =
        normalizedQuery.length === 0 || service.name.toLowerCase().includes(normalizedQuery);

      return byCategory && byQuery;
    });
  }, [activeCategory, query]);

  const groupedServices = useMemo<CategoryBlock[]>(() => {
    const byCategory = new Map<ServiceCategory, typeof services>();

    for (const category of categories) {
      byCategory.set(category, []);
    }

    for (const item of filteredServices) {
      const list = byCategory.get(item.category);
      if (list) {
        list.push(item);
      }
    }

    return categories
      .map((category) => ({
        category,
        items: byCategory.get(category) || []
      }))
      .filter((group) => group.items.length > 0);
  }, [filteredServices]);

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
    <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="halo halo-left" />
        <div className="halo halo-right" />
      </div>

      <header className="sticky top-0 z-30 mb-6 rounded-2xl border border-zinc-800/80 bg-zinc-950/90 shadow-2xl backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
          <div className="min-w-0">
            <p className="text-base font-semibold tracking-wide text-zinc-100 sm:text-lg">Хороший сервис</p>
            <p className="mt-1 max-w-xl text-xs text-zinc-400 sm:text-sm">
              Мы - команда аккредитованных экспертов: работаем с душой, берём проекты в свободное
              время и держим цены без лишней наценки.
            </p>
          </div>

          <nav className="flex items-center gap-2 text-sm">
            <a
              href="#prices"
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-200 transition hover:border-amber-500/60 hover:text-white"
            >
              Прайс
            </a>
            <a
              href="#book"
              className="rounded-lg bg-amber-500 px-3 py-2 font-semibold text-zinc-950 transition hover:bg-amber-400"
            >
              Записаться
            </a>
          </nav>
        </div>
      </header>

      <section className="mb-6 overflow-hidden rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl sm:p-7">
        <div className="grid-pattern rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-400">Все по делу, качественно, дешево</p>
          <h1 className="mt-3 text-2xl font-bold leading-tight text-zinc-100 sm:text-4xl">
            Ремонт и обслуживание автомобилей
          </h1>
          <p className="mt-3 text-sm text-zinc-300 sm:text-base">
            Цены указаны за работы. Прокладки, химия и жидкости считаются отдельно.
          </p>

          <div className="mt-5 grid gap-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 text-sm text-zinc-300 sm:grid-cols-3 sm:gap-4">
            <p>Работаем по предварительной записи.</p>
            <p>Точную стоимость подтверждаем после осмотра.</p>
            <p>Запчасти и сроки заранее согласовываем с вами.</p>
          </div>
        </div>
      </section>

      <section
        id="prices"
        className="mb-6 scroll-mt-28 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl sm:p-7"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Каталог работ</h2>
            <p className="mt-1 text-sm text-zinc-400">{filteredServices.length} позиций по текущему фильтру</p>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-300">Поиск услуги</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Например: мойка радиаторов"
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-zinc-100 outline-none ring-amber-500/40 transition focus:ring"
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-300">Категория</span>
            <select
              value={activeCategory}
              onChange={(event) => setActiveCategory(event.target.value as 'Все' | ServiceCategory)}
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-zinc-100 outline-none ring-amber-500/40 transition focus:ring"
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

        {groupedServices.length > 0 ? (
          <div className="mt-5 grid gap-4">
            {groupedServices.map((group) => (
              <article key={group.category} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-zinc-100 sm:text-lg">{group.category}</h3>
                  <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-400">
                    {group.items.length}
                  </span>
                </div>

                <ul className="divide-y divide-zinc-800">
                  {group.items.map((service) => {
                    const meta = [service.unit, service.note].filter(Boolean).join(' • ');

                    return (
                      <li key={service.id} className="py-3 first:pt-2">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                          <p className="text-sm text-zinc-200 sm:text-base">{service.name}</p>
                          <p className="shrink-0 text-base font-semibold text-amber-400 sm:text-lg">
                            {formatPrice(service.price)}
                          </p>
                        </div>
                        {meta && <p className="mt-1 text-xs text-zinc-500 sm:text-sm">{meta}</p>}
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-zinc-500">По вашему запросу услуги не найдены.</p>
        )}
      </section>

      <section className="mb-6 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl sm:p-7">
        <h3 className="text-lg font-semibold text-zinc-100 sm:text-xl">Запчасти по себестоимости</h3>
        <p className="mt-2 text-sm text-zinc-300 sm:text-base">
          Подберем и привезем запчасти почти на любое авто без лишней накрутки. Оставьте заявку,
          и мы напишем по срокам и стоимости.
        </p>
      </section>

      <section
        id="book"
        className="scroll-mt-28 rounded-3xl border border-zinc-800 bg-zinc-900/70 p-5 shadow-2xl sm:p-7"
      >
        <h2 className="text-xl font-semibold text-zinc-100 sm:text-2xl">Оставить заявку</h2>
        <p className="mt-1 text-sm text-zinc-400">Ответим в Telegram или по телефону.</p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-300">ФИО</span>
            <input
              type="text"
              value={form.fullName}
              onChange={(event) => setForm((prev) => ({ ...prev, fullName: event.target.value }))}
              placeholder="Иванов Иван Иванович"
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-zinc-100 outline-none ring-amber-500/40 transition focus:ring"
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-300">Телефон или Telegram</span>
            <input
              type="text"
              value={form.contact}
              onChange={(event) => setForm((prev) => ({ ...prev, contact: event.target.value }))}
              placeholder="+7... или @nickname"
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-zinc-100 outline-none ring-amber-500/40 transition focus:ring"
              required
            />
          </label>

          <label className="grid gap-1 text-sm">
            <span className="font-medium text-zinc-300">Марка и модель авто</span>
            <input
              type="text"
              value={form.car}
              onChange={(event) => setForm((prev) => ({ ...prev, car: event.target.value }))}
              placeholder="BMW X5 G05"
              className="h-11 rounded-xl border border-zinc-700 bg-zinc-950 px-3 text-zinc-100 outline-none ring-amber-500/40 transition focus:ring"
            />
          </label>

          <label className="grid gap-1 text-sm sm:col-span-2">
            <span className="font-medium text-zinc-300">Комментарий</span>
            <textarea
              value={form.comment}
              onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))}
              placeholder="Опишите задачу: что сделать, когда удобно приехать"
              className="min-h-28 rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100 outline-none ring-amber-500/40 transition focus:ring"
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
            className="h-11 rounded-xl bg-amber-500 px-4 font-semibold text-zinc-950 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:bg-amber-700/80 disabled:text-zinc-100 sm:col-span-2"
          >
            {isSubmitting ? 'Отправка...' : 'Отправить в Telegram'}
          </button>
        </form>

        {requestState.type === 'success' && (
          <p className="mt-3 text-sm text-emerald-400">{requestState.message}</p>
        )}
        {requestState.type === 'error' && (
          <p className="mt-3 text-sm text-rose-400">{requestState.message}</p>
        )}
      </section>
    </main>
  );
}
