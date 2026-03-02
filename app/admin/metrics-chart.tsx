'use client';

import { useMemo, useState } from 'react';
import type { MetricHourPoint } from '@/lib/store';

type MetricKey = 'transitions' | 'formClicks' | 'submitClicks';
const metricLabels: Record<MetricKey, string> = { transitions: 'Переходы', formClicks: 'Клики по форме', submitClicks: 'Клики отправки' };

export default function MetricsChart({ points }: { points: MetricHourPoint[] }) {
  const [metric, setMetric] = useState<MetricKey>('transitions');
  const [hours, setHours] = useState<24 | 48 | 72>(24);

  const filtered = useMemo(() => points.slice(-hours), [points, hours]);
  const max = useMemo(() => Math.max(...filtered.map((point) => point[metric]), 1), [filtered, metric]);
  const lastValue = filtered.at(-1)?.[metric] || 0;

  return (
    <section className="m-card p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="m-title text-xl font-semibold">Мониторинг по часам</h2>
          <p className="text-xs text-slate-400">Наблюдение за системой в режиме операторской панели.</p>
        </div>
        <div className="rounded-lg border border-garage-mblue/30 bg-garage-mblue/10 px-3 py-1 text-xs text-garage-mblue">Текущий час: {lastValue}</div>
      </div>

      <div className="mb-4 flex gap-2">
        <select value={metric} onChange={(e) => setMetric(e.target.value as MetricKey)} className="input-premium w-auto">
          {(Object.keys(metricLabels) as MetricKey[]).map((key) => <option key={key} value={key}>{metricLabels[key]}</option>)}
        </select>
        <select value={hours} onChange={(e) => setHours(Number(e.target.value) as 24 | 48 | 72)} className="input-premium w-auto">
          <option value={24}>24 часа</option><option value={48}>48 часов</option><option value={72}>72 часа</option>
        </select>
      </div>

      <div className="space-y-2">
        {filtered.map((point) => (
          <div key={point.hour}>
            <div className="mb-1 flex items-center justify-between text-xs text-slate-400"><span>{point.hour.replace('T', ' ')}</span><span>{point[metric]}</span></div>
            <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-m-gradient" style={{ width: `${(point[metric] / max) * 100}%` }} /></div>
          </div>
        ))}
      </div>
    </section>
  );
}
