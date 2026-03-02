import Link from 'next/link';
import MetricsChart from '../metrics-chart';
import LogoutButton from '../logout-button';
import { getDashboardData } from '@/lib/store';

export default async function AdminDashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10 text-ui-text">
      <div className="ui-card mb-6 flex items-center justify-between p-5">
        <div>
          <h1 className="ui-title text-3xl font-bold">Cockpit Dashboard</h1>
          <p className="text-sm text-ui-muted">Почасовой мониторинг активности системы.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin" className="rounded-xl border border-white/15 bg-white/[0.04] px-3 py-2 text-sm text-ui-text hover:bg-white/10">К заявкам</Link>
          <LogoutButton />
        </div>
      </div>

      <section className="mb-6 grid gap-4 md:grid-cols-4">
        <Kpi title="Переходы" value={data.metrics.transitions} accent="text-ui-accent" />
        <Kpi title="Клики по форме" value={data.metrics.formClicks} accent="text-ui-accent" />
        <Kpi title="Клики отправки" value={data.metrics.submitClicks} accent="text-ui-accent" />
        <Kpi title="Всего заявок" value={data.submissions.length} accent="text-ui-accent" />
      </section>

      <MetricsChart points={data.metricHistoryHourly} />
    </main>
  );
}

function Kpi({ title, value, accent }: { title: string; value: number; accent: string }) {
  return (
    <article className="ui-card p-4">
      <p className="text-sm text-ui-muted">{title}</p>
      <p className={`mt-2 text-3xl font-bold ${accent}`}>{value}</p>
    </article>
  );
}
