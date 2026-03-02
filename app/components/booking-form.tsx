'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { services } from '@/data/services';

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
  name: '', phone: '', car: '', serviceId: '', requiredWorks: '', comment: '', attachmentName: '', company: '', consent: false
};

function WheelSpinner() {
  return <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />;
}

export default function BookingForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });

  function handleAttachment(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setForm((prev) => ({ ...prev, attachmentName: file ? file.name : '' }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/telegram', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) throw new Error(data.error || 'Не удалось отправить заявку.');
      setForm(initialFormState);
      setStatus({ type: 'success', message: 'Заявка отправлена' });
    } catch (error) {
      setStatus({ type: 'error', message: error instanceof Error ? error.message : 'Ошибка отправки.' });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="ui-card p-7">
      <h1 className="ui-title mb-4 text-3xl font-bold">Запись в сервис</h1>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input className="ui-input" type="text" placeholder="Имя" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        <input className="ui-input" type="tel" placeholder="Телефон" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} required />
        <input className="ui-input" type="text" placeholder="Марка / модель" value={form.car} onChange={(e) => setForm((p) => ({ ...p, car: e.target.value }))} />
        <select className="ui-input" value={form.serviceId} onChange={(e) => setForm((p) => ({ ...p, serviceId: e.target.value }))}>
          <option value="">Услуга (не выбрано)</option>
          {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
        </select>
        <textarea className="ui-input min-h-20" placeholder="Необходимые работы" value={form.requiredWorks} onChange={(e) => setForm((p) => ({ ...p, requiredWorks: e.target.value }))} />
        <textarea className="ui-input min-h-20" placeholder="Комментарий" value={form.comment} onChange={(e) => setForm((p) => ({ ...p, comment: e.target.value }))} />

        <label className="rounded-xl border border-white/10 bg-black/20 p-3 text-sm text-ui-muted">
          <span className="mb-2 block text-ui-accent">Загрузка фото/видео</span>
          <input type="file" accept="image/*,video/*" onChange={handleAttachment} className="block w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-ui-accent/20 file:px-3 file:py-2 file:text-ui-accent hover:file:bg-ui-accent/35" />
          {form.attachmentName && <span className="mt-2 block text-xs text-ui-accent">Файл: {form.attachmentName}</span>}
        </label>

        <input type="text" tabIndex={-1} autoComplete="off" className="hidden" value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} name="company" />
        <label className="flex items-start gap-2 text-sm text-ui-muted"><input type="checkbox" checked={form.consent} onChange={(e) => setForm((p) => ({ ...p, consent: e.target.checked }))} className="mt-1 accent-ui-accent" required /><span>Соглашаюсь на обработку персональных данных</span></label>

        <button type="submit" disabled={isSubmitting} className="ui-button inline-flex items-center justify-center gap-2">
          {isSubmitting ? <><WheelSpinner /> Отправка...</> : 'Отправить в Telegram'}
        </button>
      </form>
      {status.type === 'success' && <p className="mt-3 text-sm text-ui-muted">{status.message}</p>}
      {status.type === 'error' && <p className="mt-3 text-sm text-ui-muted">{status.message}</p>}
    </section>
  );
}
