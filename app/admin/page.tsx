import Link from 'next/link';
import LogoutButton from './logout-button';
import { getDashboardData } from '@/lib/store';

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-ui-text">
      <div className="ui-card mb-6 flex items-center justify-between p-5">
        <div>
          <h1 className="ui-title text-3xl font-bold">Операторская заявок</h1>
          <p className="text-sm text-ui-muted">Заявки клиентов. Мониторинг вынесен отдельно.</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/admin/dashboard" className="rounded-xl border border-ui-accent/40 bg-ui-accent/10 px-3 py-2 text-sm text-ui-accent hover:bg-ui-accent/20">Дашборд</Link>
          <LogoutButton />
        </div>
      </div>

      <section className="ui-card p-5">
        <h2 className="mb-4 text-xl font-semibold text-ui-accent">Все заявки ({data.submissions.length})</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead><tr className="border-b border-white/10 text-ui-muted"><th className="p-2">Дата</th><th className="p-2">Имя</th><th className="p-2">Телефон</th><th className="p-2">Авто</th><th className="p-2">Услуга</th><th className="p-2">Необходимые работы</th><th className="p-2">Комментарий</th></tr></thead>
            <tbody>
              {data.submissions.map((item) => (
                <tr key={item.id} className="ui-hover-line border-b border-white/5 align-top text-ui-text"><td className="p-2 whitespace-nowrap">{new Date(item.createdAt).toLocaleString('ru-RU')}</td><td className="p-2">{item.name}</td><td className="p-2">{item.phone}</td><td className="p-2">{item.car}</td><td className="p-2">{item.service}</td><td className="p-2">{item.requiredWorks}</td><td className="p-2">{item.comment}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
