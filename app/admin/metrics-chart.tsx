'use client';

import { useMemo, useState } from 'react';
import type { MetricPoint } from '@/lib/store';

type MetricKey = 'transitions' | 'formClicks' | 'submitClicks';

const metricLabels: Record<MetricKey, string> = {
  transitions: 'Переходы',
  formClicks: 'Клики по форме',
  submitClicks: 'Клики отправки'
};

export default function MetricsChart({ points }: { points: MetricPoint[] }) {
  const [metric, setMetric] = useState<MetricKey>('transitions');
  const [days, setDays] = useState<7 | 14 | 30>(7);

  const filtered = useMemo(() => {
    return points.slice(-days);
  }, [points, days]);

  const max = useMemo(() => {
    return Math.max(...filtered.map((point) => point[metric]), 1);
  }, [filtered, metric]);

  return (
    <section className="rounded-2xl border border-amber-400/30 bg-slate-900/70 p-5 shadow-[0_0_30px_rgba(34,211,238,0.12)]">
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <h2 className="text-xl font-semibold text-amber-200">Посещаемость и действия</h2>

        <select
          value={metric}
          onChange={(event) => setMetric(event.target.value as MetricKey)}
          className="rounded-md border border-amber-400/40 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        >
          {(Object.keys(metricLabels) as MetricKey[]).map((key) => (
            <option key={key} value={key}>
              {metricLabels[key]}
            </option>
          ))}
        </select>

        <select
          value={days}
          onChange={(event) => setDays(Number(event.target.value) as 7 | 14 | 30)}
          className="rounded-md border border-amber-400/40 bg-slate-950 px-3 py-2 text-sm text-slate-100"
        >
          <option value={7}>7 дней</option>
          <option value={14}>14 дней</option>
          <option value={30}>30 дней</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-300">Пока недостаточно данных для графика.</p>
      ) : (
        <div className="space-y-2">
          {filtered.map((point) => (
            <div key={point.date}>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                <span>{point.date}</span>
                <span>{point[metric]}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-800">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-orange-500"
                  style={{ width: `${(point[metric] / max) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
