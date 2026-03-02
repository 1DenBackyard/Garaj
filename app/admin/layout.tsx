import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminCookieName, isValidAdminToken } from '@/lib/admin-auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(getAdminCookieName())?.value;

  if (!isValidAdminToken(token)) {
    redirect('/admin-login');
  }

  return <>{children}</>;
}
