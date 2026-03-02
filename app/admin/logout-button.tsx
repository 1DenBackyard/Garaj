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
    <button
      onClick={logout}
      className="rounded-lg border border-amber-300/40 bg-amber-500/20 px-3 py-2 text-sm font-medium text-amber-100 hover:bg-amber-500/30"
    >
      Выйти
    </button>
  );
}
