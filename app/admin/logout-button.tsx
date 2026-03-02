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
    <button onClick={logout} className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm font-medium text-ui-text transition hover:border-ui-accent/40 hover:bg-ui-accent/10 hover:text-ui-accent">
      Выйти
    </button>
  );
}
