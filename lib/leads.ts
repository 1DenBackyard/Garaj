import { randomUUID } from 'crypto';
import { mkdir, readFile, writeFile } from 'fs/promises';
import path from 'path';

export type LeadStatus = 'не обработано' | 'обработано';

export type LeadRecord = {
  id: string;
  createdAt: string;
  processedAt: string;
  fullName: string;
  contact: string;
  car: string;
  comment: string;
  status: LeadStatus;
  telegramMessageId?: number;
};

type NewLeadInput = {
  fullName: string;
  contact: string;
  car: string;
  comment: string;
  status: LeadStatus;
  telegramMessageId?: number;
};

const storageDir = path.join(process.cwd(), 'storage');
const leadsPath = path.join(storageDir, 'leads.json');

async function ensureStore() {
  await mkdir(storageDir, { recursive: true });

  try {
    await readFile(leadsPath, 'utf8');
  } catch {
    await writeFile(leadsPath, '[]', 'utf8');
  }
}

async function readLeads(): Promise<LeadRecord[]> {
  await ensureStore();
  const raw = await readFile(leadsPath, 'utf8');

  try {
    const data = JSON.parse(raw) as LeadRecord[];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function writeLeads(leads: LeadRecord[]) {
  await ensureStore();
  await writeFile(leadsPath, JSON.stringify(leads, null, 2), 'utf8');
}

function toCsvField(value: string | number): string {
  const normalized = String(value).replace(/"/g, '""');
  return `"${normalized}"`;
}

export async function appendLead(input: NewLeadInput): Promise<LeadRecord> {
  const leads = await readLeads();
  const now = new Date().toISOString();

  const record: LeadRecord = {
    id: randomUUID(),
    createdAt: now,
    processedAt: '',
    fullName: input.fullName,
    contact: input.contact,
    car: input.car,
    comment: input.comment,
    status: input.status,
    telegramMessageId: input.telegramMessageId
  };

  leads.push(record);
  await writeLeads(leads);

  return record;
}

export async function markLeadProcessed(messageId: number): Promise<boolean> {
  const leads = await readLeads();
  const target = leads.find((lead) => lead.telegramMessageId === messageId);

  if (!target) {
    return false;
  }

  if (target.status !== 'обработано') {
    target.status = 'обработано';
    target.processedAt = new Date().toISOString();
    await writeLeads(leads);
  }

  return true;
}

export async function exportLeadsCsv(): Promise<string> {
  const leads = await readLeads();

  const header = [
    'id',
    'created_at',
    'status',
    'processed_at',
    'full_name',
    'contact',
    'car',
    'comment',
    'telegram_message_id'
  ];

  const rows = leads.map((lead) =>
    [
      lead.id,
      lead.createdAt,
      lead.status,
      lead.processedAt,
      lead.fullName,
      lead.contact,
      lead.car,
      lead.comment,
      lead.telegramMessageId ?? ''
    ]
      .map((value) => toCsvField(value))
      .join(',')
  );

  return [header.join(','), ...rows].join('\n');
}
