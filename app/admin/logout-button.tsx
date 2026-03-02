'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.replace('/admin-login');
    router.refresh();
  }

  return (
    <button onClick={logout} className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-garage-mred/40 hover:bg-garage-mred/10 hover:text-garage-mred">
      Выйти
    </button>
  );
}
