import { getDashboardData } from '@/lib/store';

export default async function AdminPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Админка</h1>

      <section className="mb-8 grid gap-4 md:grid-cols-4">
        <MetricCard title="Всего заявок" value={String(data.submissions.length)} />
        <MetricCard title="Переходы" value={String(data.metrics.transitions)} />
        <MetricCard title="Клики по форме" value={String(data.metrics.formClicks)} />
        <MetricCard title="Клики отправки" value={String(data.metrics.submitClicks)} />
      </section>

      <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-xl font-semibold">Все заявки</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
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
                <tr key={item.id} className="border-b border-slate-100 align-top">
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
        {data.submissions.length === 0 && <p className="p-2 text-slate-500">Пока заявок нет.</p>}
      </section>
    </main>
  );
}

function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </article>
  );
}
