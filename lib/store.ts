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

type Metrics = {
  transitions: number;
  formClicks: number;
  submitClicks: number;
};

type EventName = keyof Metrics;

type StoreData = {
  submissions: Submission[];
  metrics: Metrics;
};

const initialData: StoreData = {
  submissions: [],
  metrics: {
    transitions: 0,
    formClicks: 0,
    submitClicks: 0
  }
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

async function readStore(): Promise<StoreData> {
  await ensureStore();
  const content = await fs.readFile(dataFile, 'utf8');

  try {
    const parsed = JSON.parse(content) as StoreData;
    return {
      submissions: parsed.submissions || [],
      metrics: {
        transitions: parsed.metrics?.transitions || 0,
        formClicks: parsed.metrics?.formClicks || 0,
        submitClicks: parsed.metrics?.submitClicks || 0
      }
    };
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
  data.submissions.unshift({
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    ...payload
  });
  await writeStore(data);
}

export async function trackMetric(event: EventName) {
  const data = await readStore();
  data.metrics[event] += 1;
  await writeStore(data);
}

export async function getDashboardData() {
  return readStore();
}
