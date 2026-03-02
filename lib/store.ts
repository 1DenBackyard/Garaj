import { promises as fs } from 'fs';
import path from 'path';

export type Submission = {
  id: string;
  createdAt: string;
  name: string;
  phone: string;
  car: string;
  service: string;
  requiredWorks: string;
  comment: string;
};

export type Metrics = {
  transitions: number;
  formClicks: number;
  submitClicks: number;
};

export type MetricPoint = {
  date: string;
  transitions: number;
  formClicks: number;
  submitClicks: number;
};

export type MetricHourPoint = {
  hour: string;
  transitions: number;
  formClicks: number;
  submitClicks: number;
};

type EventName = keyof Metrics;

export type StoreData = {
  submissions: Submission[];
  metrics: Metrics;
  metricHistory: MetricPoint[];
  metricHistoryHourly: MetricHourPoint[];
};

const initialData: StoreData = {
  submissions: [],
  metrics: { transitions: 0, formClicks: 0, submitClicks: 0 },
  metricHistory: [],
  metricHistoryHourly: []
};

const dataDir = path.join(process.cwd(), '.data');
const dataFile = path.join(dataDir, 'store.json');

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  try {
    await fs.access(dataFile);
  } catch {
    await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2), 'utf8');
  }
}

function normalizeStore(parsed: Partial<StoreData>): StoreData {
  return {
    submissions: parsed.submissions || [],
    metrics: {
      transitions: parsed.metrics?.transitions || 0,
      formClicks: parsed.metrics?.formClicks || 0,
      submitClicks: parsed.metrics?.submitClicks || 0
    },
    metricHistory: parsed.metricHistory || [],
    metricHistoryHourly: parsed.metricHistoryHourly || []
  };
}

async function readStore(): Promise<StoreData> {
  await ensureStore();
  const content = await fs.readFile(dataFile, 'utf8');
  try {
    return normalizeStore(JSON.parse(content) as Partial<StoreData>);
  } catch {
    return initialData;
  }
}

async function writeStore(data: StoreData) {
  await ensureStore();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2), 'utf8');
}

export async function addSubmission(payload: Omit<Submission, 'id' | 'createdAt'>) {
  const data = await readStore();
  data.submissions.unshift({ id: crypto.randomUUID(), createdAt: new Date().toISOString(), ...payload });
  await writeStore(data);
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}
function hourKey() {
  return new Date().toISOString().slice(0, 13) + ':00';
}

export async function trackMetric(event: EventName) {
  const data = await readStore();
  data.metrics[event] += 1;

  const date = todayKey();
  const day = data.metricHistory.find((point) => point.date === date);
  if (day) day[event] += 1;
  else data.metricHistory.push({ date, transitions: event === 'transitions' ? 1 : 0, formClicks: event === 'formClicks' ? 1 : 0, submitClicks: event === 'submitClicks' ? 1 : 0 });

  const hour = hourKey();
  const hourPoint = data.metricHistoryHourly.find((point) => point.hour === hour);
  if (hourPoint) hourPoint[event] += 1;
  else data.metricHistoryHourly.push({ hour, transitions: event === 'transitions' ? 1 : 0, formClicks: event === 'formClicks' ? 1 : 0, submitClicks: event === 'submitClicks' ? 1 : 0 });

  data.metricHistory.sort((a, b) => a.date.localeCompare(b.date));
  data.metricHistoryHourly.sort((a, b) => a.hour.localeCompare(b.hour));
  data.metricHistoryHourly = data.metricHistoryHourly.slice(-168);

  await writeStore(data);
}

export async function getDashboardData() {
  return readStore();
}
