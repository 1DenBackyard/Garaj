'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = (await response.json()) as { ok: boolean; error?: string };
      if (!response.ok || !data.ok) return setError(data.error || 'Ошибка авторизации.');
      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Не удалось выполнить вход.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[80vh] max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="ui-card w-full p-7">
        <h1 className="ui-title mb-2 text-3xl font-bold">Вход в админку</h1>
        <p className="mb-5 text-sm text-ui-muted">Доступ только для администратора.</p>
        <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="ui-input mb-4" placeholder="Пароль" required />
        <button type="submit" disabled={loading} className="ui-button w-full">{loading ? 'Вход...' : 'Войти'}</button>
        {error && <p className="mt-3 text-sm text-ui-muted">{error}</p>}
      </form>
    </main>
  );
}
