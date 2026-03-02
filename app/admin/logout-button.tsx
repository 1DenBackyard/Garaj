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
    <button onClick={logout} className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm font-medium text-amber-200 transition hover:bg-white/10">
      Выйти
    </button>
  );
}
