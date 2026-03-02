import MetricsChart from './metrics-chart';
import LogoutButton from './logout-button';
import { getDashboardData } from '@/lib/store';

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-slate-100">
      <div className="glass-card mb-6 flex items-center justify-between p-5">
        <div>
          <h1 className="text-3xl font-bold neon-title">Админка Garaj</h1>
          <p className="text-sm text-slate-400">Управление заявками и аналитикой</p>
        </div>
        <LogoutButton />
      </div>

      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <MetricCard title="Всего заявок" value={String(data.submissions.length)} />
        <MetricCard title="Переходы" value={String(data.metrics.transitions)} />
        <MetricCard title="Клики по форме" value={String(data.metrics.formClicks)} />
        <MetricCard title="Клики отправки" value={String(data.metrics.submitClicks)} />
      </section>

      <div className="mb-8">
        <MetricsChart points={data.metricHistory} />
      </div>

      <section className="glass-card p-5">
        <h2 className="mb-4 text-xl font-semibold text-amber-200">Все заявки</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-300">
                <th className="p-2">Дата</th>
                <th className="p-2">Имя</th>
                <th className="p-2">Телефон</th>
                <th className="p-2">Авто</th>
                <th className="p-2">Услуга</th>
                <th className="p-2">Необходимые работы</th>
                <th className="p-2">Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {data.submissions.map((item) => (
                <tr key={item.id} className="border-b border-white/5 align-top text-slate-200">
                  <td className="p-2 whitespace-nowrap">{new Date(item.createdAt).toLocaleString('ru-RU')}</td>
                  <td className="p-2">{item.name}</td>
                  <td className="p-2">{item.phone}</td>
                  <td className="p-2">{item.car}</td>
                  <td className="p-2">{item.service}</td>
                  <td className="p-2">{item.requiredWorks}</td>
                  <td className="p-2">{item.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="glass-card p-4">
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-bold text-amber-200">{value}</p>
    </article>
  );
}
