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

      if (!response.ok || !data.ok) {
        setError(data.error || 'Ошибка авторизации.');
        return;
      }

      router.replace('/admin');
      router.refresh();
    } catch {
      setError('Не удалось выполнить вход.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md items-center px-4">
      <form onSubmit={onSubmit} className="w-full rounded-2xl border border-amber-300/40 bg-slate-900/80 p-6 shadow-[0_0_30px_rgba(251,191,36,0.22)]">
        <h1 className="mb-2 text-2xl font-bold text-amber-200">Вход в админку</h1>
        <p className="mb-4 text-sm text-slate-400">Введите пароль администратора.</p>
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mb-3 w-full rounded-lg border border-amber-300/40 bg-slate-950/80 px-3 py-2 text-slate-100 outline-none focus:ring focus:ring-amber-300/40"
          placeholder="Пароль"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2 font-medium text-slate-950 hover:brightness-110 disabled:opacity-60"
        >
          {loading ? 'Вход...' : 'Войти'}
        </button>
        {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
      </form>
    </main>
  );
}
