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
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedForCalc, setSelectedForCalc] = useState<string[]>([]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return services.filter((service) => {
      const categoryMatch = activeCategory === 'Все' || service.category === activeCategory;
      const queryMatch = normalizedQuery.length === 0 || service.name.toLowerCase().includes(normalizedQuery);
      return categoryMatch && queryMatch;
    });
  }, [activeCategory, query]);

  const selectedNames = useMemo(() => services.filter((s) => selectedForCalc.includes(s.id)).map((s) => s.name).join(', '), [selectedForCalc]);
  const calcTotal = useMemo(
    () =>
      selectedForCalc.reduce((sum, id) => {
        const service = services.find((item) => item.id === id);
        return !service || Array.isArray(service.price) ? sum : sum + service.price;
      }, 0),
    [selectedForCalc]
  );

  async function track(event: 'transitions' | 'formClicks' | 'submitClicks') {
    await fetch('/api/metrics', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event }) });
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заявку.');
      setForm(initialFormState);
      setStatus({ type: 'success', message: 'Заявка отправлена' });
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Неизвестная ошибка при отправке.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto max-w-7xl px-4 pb-16">
      <header className="sticky top-0 z-10 mb-8 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between py-4">
          <div>
            <p className="text-xl font-semibold neon-title">Автосервис</p>
            <p className="text-xs uppercase tracking-[0.24em] text-amber-300/80">Твоя скорость — наша точность</p>
          </div>
          <nav className="flex items-center gap-1 text-sm">
            {[
              ['#prices', 'Прайс'],
              ['#about', 'О нас'],
              ['#book', 'Записаться']
            ].map(([href, label]) => (
              <a key={href} href={href} onClick={() => track('transitions')} className="rounded-lg px-3 py-2 text-slate-200 transition hover:bg-white/10 hover:text-amber-200">
                {label}
              </a>
            ))}
            <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram" className="rounded-lg p-2 text-amber-300 transition hover:bg-white/10 hover:text-amber-100"><SocialTelegram /></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-lg p-2 text-amber-300 transition hover:bg-white/10 hover:text-amber-100"><SocialInstagram /></a>
          </nav>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.25fr,0.85fr]">
        <div className="space-y-6">
          <section className="glass-card p-7">
            <h1 className="mb-3 text-4xl font-extrabold leading-tight neon-title">Ремонт и обслуживание автомобилей</h1>
            <p className="mb-4 text-slate-300">Цены указаны за работы. Прокладки/химия/жидкости — отдельно.</p>
            <div className="grid gap-2 text-sm text-slate-400 md:grid-cols-3">
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">Работаем по предварительной записи.</p>
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">Стоимость зависит от состояния узлов.</p>
              <p className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2">Расходники согласовываем заранее.</p>
            </div>
          </section>

          <section id="prices" className="glass-card scroll-mt-24 p-7">
            <h2 className="mb-4 text-2xl font-bold neon-title">Прайс</h2>
            <div className="mb-4 grid gap-3 md:grid-cols-[2fr,1fr]">
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Поиск услуги" className="input-premium" />
              <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value as 'Все' | ServiceCategory)} className="input-premium">
                <option value="Все">Все категории</option>
                {categories.map((category) => <option key={category} value={category}>{category}</option>)}
              </select>
            </div>
            <ul className="divide-y divide-white/10">
              {filteredServices.map((service) => (
                <li key={service.id} className="py-3">
                  <div className="flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between">
                    <p className="font-medium text-slate-100">{service.name}</p>
                    <p className="font-semibold text-amber-300">{formatPrice(service.price)}</p>
                  </div>
                  <p className="text-xs text-slate-400">{service.unit ? `(${service.unit})` : ''}{service.unit && service.note ? ' — ' : ''}{service.note || ''}</p>
                </li>
              ))}
            </ul>
          </section>

          <section id="about" className="glass-card scroll-mt-24 p-7">
            <h2 className="text-2xl font-bold neon-title">О нас</h2>
            <p className="mt-2 text-slate-400">Скоро добавим историю команды, наши проекты и видео из сервиса.</p>
          </section>

          <section className="glass-card p-7">
            <h2 className="mb-3 text-2xl font-bold neon-title">Калькулятор работ</h2>
            <p className="mb-3 text-sm text-slate-400">Мультивыбор услуг. Для диапазонных цен итог не суммируется автоматически.</p>
            <div className="grid gap-2">
              {services.map((service) => (
                <label key={service.id} className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-black/20 p-3 transition hover:border-amber-300/40">
                  <span className="text-sm text-slate-200">{service.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-amber-300">{formatPrice(service.price)}</span>
                    <input type="checkbox" checked={selectedForCalc.includes(service.id)} disabled={Array.isArray(service.price)} onChange={(e) => setSelectedForCalc((prev) => e.target.checked ? [...prev, service.id] : prev.filter((id) => id !== service.id))} />
                  </span>
                </label>
              ))}
            </div>
            <p className="mt-4 text-lg font-bold text-amber-200">Итого: {new Intl.NumberFormat('ru-RU').format(calcTotal)} ₽</p>
            <button
              type="button"
              onClick={() => {
                setForm((prev) => ({ ...prev, requiredWorks: selectedNames }));
                document.getElementById('book')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="mt-4 w-full rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110"
            >
              отправить заявку на этот перечень и получить скидку
            </button>
          </section>
        </div>

        <section id="book" className="glass-card h-fit scroll-mt-24 p-7 lg:sticky lg:top-24">
          <h2 className="mb-4 text-2xl font-bold neon-title">Записаться</h2>
          <form onSubmit={handleSubmit} className="grid gap-3" onClick={() => track('formClicks')}>
            <input type="text" placeholder="Имя" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} className="input-premium" required />
            <input type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} className="input-premium" required />
            <input type="text" placeholder="Марка / модель" value={form.car} onChange={(e) => setForm((p) => ({ ...p, car: e.target.value }))} className="input-premium" />
            <select value={form.serviceId} onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))} className="input-premium">
              <option value="">Услуга (не выбрано)</option>
              {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
            </select>
            <textarea placeholder="Необходимые работы" value={form.requiredWorks} onChange={(e) => setForm((p) => ({ ...p, requiredWorks: e.target.value }))} className="input-premium min-h-20" />
            <textarea placeholder="Комментарий" value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} className="input-premium min-h-20" />

            <label className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-slate-300">
              <span className="mb-2 block text-amber-200">Загрузить фото/видео проблемы</span>
              <input type="file" accept="image/*,video/*" onChange={handleAttachment} className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-amber-400/20 file:px-3 file:py-2 file:text-amber-200 hover:file:bg-amber-400/35" />
              {form.attachmentName && <span className="mt-2 block text-xs text-amber-300">Файл: {form.attachmentName}</span>}
            </label>

            <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} aria-hidden="true" name="company" />
            <label className="flex items-start gap-2 text-sm text-slate-300">
              <input type="checkbox" checked={form.consent} onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))} className="mt-1" required />
              <span>Соглашаюсь на обработку персональных данных</span>
            </label>

            <button type="submit" disabled={isSubmitting} onClick={() => track('submitClicks')} className="rounded-xl bg-gradient-to-r from-amber-300 to-orange-500 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-110 disabled:opacity-60">
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M9.04 15.57 8.9 19.5c.49 0 .7-.21.96-.47l2.31-2.2 4.78 3.5c.88.49 1.5.23 1.74-.81l3.15-14.76c.31-1.27-.46-1.77-1.3-1.45L2.02 10.1c-1.25.49-1.24 1.18-.21 1.49l4.73 1.48 10.98-6.93c.52-.32 1-.15.6.2l-8.88 8.23Z" /></svg>
  );
}

function SocialInstagram() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" /></svg>
  );
}
