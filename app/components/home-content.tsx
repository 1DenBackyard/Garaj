'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { categories, formatPrice, services, ServiceCategory } from '@/data/services';

type FormState = {
  name: string;
  phone: string;
  car: string;
  serviceId: string;
  requiredWorks: string;
  comment: string;
  attachmentName: string;
  company: string;
  consent: boolean;
};

const initialFormState: FormState = {
  name: '',
  phone: '',
  car: '',
  serviceId: '',
  requiredWorks: '',
  comment: '',
  attachmentName: '',
  company: '',
  consent: false
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
  const [selectedForCalc, setSelectedForCalc] = useState<string[]>([]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return services.filter((service) => {
      const categoryMatch = activeCategory === 'Все' || service.category === activeCategory;
      const queryMatch =
        normalizedQuery.length === 0 || service.name.toLowerCase().includes(normalizedQuery);

      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  const selectedNames = useMemo(() => {
    return services
      .filter((service) => selectedForCalc.includes(service.id))
      .map((service) => service.name)
      .join(', ');
  }, [selectedForCalc]);

  const calcTotal = useMemo(() => {
    return selectedForCalc.reduce((sum, id) => {
      const service = services.find((item) => item.id === id);
      if (!service || Array.isArray(service.price)) {
        return sum;
      }
      return sum + service.price;
    }, 0);
  }, [selectedForCalc]);

  async function track(event: 'transitions' | 'formClicks' | 'submitClicks') {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event })
    });
  }

  function handleAttachment(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setForm((prev) => ({ ...prev, attachmentName: file ? file.name : '' }));
  }

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

  const fieldClass =
    'w-full rounded-xl border border-amber-300/30 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none ring-amber-300/50 placeholder:text-slate-500 focus:ring';

  return (
    <main className="mx-auto max-w-6xl px-4 pb-16">
      <header className="sticky top-0 z-10 mb-8 border-b border-amber-300/20 bg-slate-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between py-4">
          <div>
            <p className="text-xl font-semibold text-amber-200">Автосервис</p>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-400/80">Твоя скорость — наша точность</p>
          </div>
          <nav className="flex items-center gap-2 text-sm font-medium">
            <a className="rounded-md px-3 py-2 text-slate-200 hover:bg-amber-500/20" href="#prices" onClick={() => track('transitions')}>
              Прайс
            </a>
            <a className="rounded-md px-3 py-2 text-slate-200 hover:bg-amber-500/20" href="#about" onClick={() => track('transitions')}>
              О нас
            </a>
            <a className="rounded-md px-3 py-2 text-slate-200 hover:bg-amber-500/20" href="#book" onClick={() => track('transitions')}>
              Записаться
            </a>
            <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram" className="rounded-md p-2 text-amber-300 hover:bg-amber-500/20 hover:text-amber-100">
              <SocialTelegram />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-md p-2 text-amber-300 hover:bg-amber-500/20 hover:text-amber-100">
              <SocialInstagram />
            </a>
          </nav>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.2fr,0.9fr]">
        <div>
          <section className="mb-6 rounded-2xl border border-amber-300/30 bg-slate-900/75 p-6 shadow-[0_0_35px_rgba(251,191,36,0.16)]">
            <h1 className="mb-3 text-3xl font-bold text-amber-200">Ремонт и обслуживание автомобилей</h1>
            <p className="mb-2 text-slate-300">Цены указаны за работы. Прокладки/химия/жидкости — отдельно.</p>
            <p className="mb-4 text-sm text-amber-300/90">Слоган: «Твоя скорость — наша точность»</p>
            <div className="space-y-1 text-sm text-slate-400">
              <p>• Работаем по предварительной записи.</p>
              <p>• Финальная стоимость зависит от состояния узлов и доступа к ним.</p>
              <p>• Расходники согласовываем перед началом работ.</p>
            </div>
          </section>

          <section id="prices" className="mb-6 scroll-mt-24 rounded-2xl border border-amber-300/30 bg-slate-900/75 p-6 shadow-[0_0_35px_rgba(251,191,36,0.16)]">
            <h2 className="mb-4 text-2xl font-semibold text-amber-200">Прайс</h2>
            <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Поиск услуги" className={fieldClass} />
              <select value={activeCategory} onChange={(event) => setActiveCategory(event.target.value as 'Все' | ServiceCategory)} className={fieldClass}>
                <option value="Все">Все категории</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <ul className="divide-y divide-slate-700">
              {filteredServices.map((service) => (
                <li key={service.id} className="py-3">
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <p className="font-medium text-slate-100">{service.name}</p>
                    <p className="font-semibold text-amber-300">{formatPrice(service.price)}</p>
                  </div>
                  <p className="text-sm text-slate-400">{service.unit ? `(${service.unit})` : ''}{service.unit && service.note ? ' — ' : ''}{service.note || ''}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="about" className="mb-6 scroll-mt-24 rounded-2xl border border-dashed border-amber-300/30 bg-slate-900/50 p-6">
            <h2 className="text-2xl font-semibold text-amber-200">О нас</h2>
            <p className="mt-2 text-sm text-slate-400">Раздел готовим — добавим историю сервиса, команду механиков и проекты.</p>
          </section>

          <section className="rounded-2xl border border-amber-300/30 bg-slate-900/75 p-6 shadow-[0_0_35px_rgba(251,191,36,0.16)]">
            <h2 className="mb-3 text-2xl font-semibold text-amber-200">Калькулятор работ</h2>
            <p className="mb-3 text-sm text-slate-400">Выбирайте несколько услуг: итог по фиксированным ценам считается автоматически.</p>
            <div className="grid gap-2">
              {services.map((service) => (
                <label key={service.id} className="flex items-center justify-between gap-2 rounded-lg border border-slate-700 bg-slate-950/60 p-2">
                  <span className="text-sm text-slate-200">{service.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-amber-300">{formatPrice(service.price)}</span>
                    <input type="checkbox" checked={selectedForCalc.includes(service.id)} disabled={Array.isArray(service.price)} onChange={(event) => setSelectedForCalc((prev) => event.target.checked ? [...prev, service.id] : prev.filter((id) => id !== service.id))} />
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-lg font-semibold text-amber-200">Итого: {new Intl.NumberFormat('ru-RU').format(calcTotal)} ₽</p>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, requiredWorks: selectedNames }));
                document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 w-full rounded-lg border border-amber-400/50 bg-amber-500/20 px-4 py-2 text-sm font-medium text-amber-100 hover:bg-amber-500/30"
            >
              отправить заявку на этот перечень и получить скидку
            </button>
          </section>
        </div>

        <section id="book" className="h-fit scroll-mt-24 rounded-2xl border border-amber-300/40 bg-slate-900/80 p-6 shadow-[0_0_35px_rgba(251,191,36,0.22)] lg:sticky lg:top-24">
          <h2 className="mb-4 text-2xl font-semibold text-amber-200">Записаться</h2>
          <form onSubmit={handleSubmit} className="grid gap-3" onClick={() => track('formClicks')}>
            <input type="text" placeholder="Имя" value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} className={fieldClass} required />
            <input type="tel" placeholder="Телефон" value={form.phone} onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))} className={fieldClass} required />
            <input type="text" placeholder="Марка / модель" value={form.car} onChange={(event) => setForm((prev) => ({ ...prev, car: event.target.value }))} className={fieldClass} />
            <select value={form.serviceId} onChange={(event) => setForm((prev) => ({ ...prev, serviceId: event.target.value }))} className={fieldClass}>
              <option value="">Услуга (не выбрано)</option>
              {services.map((service) => (<option key={service.id} value={service.id}>{service.name}</option>))}
            </select>
            <textarea placeholder="Необходимые работы" value={form.requiredWorks} onChange={(event) => setForm((prev) => ({ ...prev, requiredWorks: event.target.value }))} className={`${fieldClass} min-h-20`} />
            <textarea placeholder="Комментарий" value={form.comment} onChange={(event) => setForm((prev) => ({ ...prev, comment: event.target.value }))} className={`${fieldClass} min-h-20`} />

            <label className="rounded-xl border border-amber-300/30 bg-slate-950/60 p-3 text-sm text-slate-300">
              <span className="mb-2 block font-medium text-amber-200">Загрузка фото/видео проблемы (в демо сохраняется только имя файла)</span>
              <input type="file" accept="image/*,video/*" onChange={handleAttachment} className="block w-full text-xs file:mr-3 file:rounded-md file:border-0 file:bg-amber-500/25 file:px-3 file:py-2 file:text-amber-100 hover:file:bg-amber-500/35" />
              {form.attachmentName && <span className="mt-2 block text-xs text-amber-300">Файл: {form.attachmentName}</span>}
            </label>

            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={form.company} onChange={(event) => setForm((prev) => ({ ...prev, company: event.target.value }))} aria-hidden="true" name="company" />

            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.consent} onChange={(event) => setForm((prev) => ({ ...prev, consent: event.target.checked }))} className="mt-1" required />
              <span>Соглашаюсь на обработку персональных данных</span>
            </label>

            <button type="submit" disabled={isSubmitting} onClick={() => track('submitClicks')} className="rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 font-semibold text-slate-950 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
              {isSubmitting ? 'Отправка...' : 'Отправить в Telegram'}
            </button>
          </form>
          {status.type === 'success' && <p className="mt-3 text-sm text-emerald-400">{status.message}</p>}
          {status.type === 'error' && <p className="mt-3 text-sm text-rose-400">{status.message}</p>}
        </section>
      </div>
    </main>
  );
}

function SocialTelegram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M9.04 15.57 8.9 19.5c.49 0 .7-.21.96-.47l2.31-2.2 4.78 3.5c.88.49 1.5.23 1.74-.81l3.15-14.76c.31-1.27-.46-1.77-1.3-1.45L2.02 10.1c-1.25.49-1.24 1.18-.21 1.49l4.73 1.48 10.98-6.93c.52-.32 1-.15.6.2l-8.88 8.23Z" />
    </svg>
  );
}

function SocialInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}
