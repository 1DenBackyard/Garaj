import { NextResponse } from 'next/server';
import { trackMetric } from '@/lib/store';

type Body = { event?: 'transitions' | 'formClicks' | 'submitClicks' };

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Body;

    if (!body.event) {
      return NextResponse.json({ ok: false, error: 'Event is required.' }, { status: 400 });
    }

    await trackMetric(body.event);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
