import { NextResponse } from 'next/server';
import { exportLeadsCsv } from '@/lib/leads';

export const runtime = 'nodejs';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get('token') || '';
  const expectedToken = process.env.LEADS_EXPORT_TOKEN;

  if (expectedToken && token !== expectedToken) {
    return NextResponse.json({ ok: false, error: 'Нужен корректный токен выгрузки.' }, { status: 401 });
  }

  const csv = await exportLeadsCsv();
  const filename = `leads-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(`\uFEFF${csv}`, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store'
    }
  });
}
