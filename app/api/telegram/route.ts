import { NextResponse } from 'next/server';
import { services } from '@/data/services';
import { addSubmission } from '@/lib/store';

type RequestBody = {
  name?: string;
  phone?: string;
  car?: string;
  serviceId?: string;
  requiredWorks?: string;
  comment?: string;
  company?: string;
  consent?: boolean;
};

function toSafeText(value: string | undefined): string {
  const text = (value || '').trim();
  return text.length > 0 ? text : '—';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as RequestBody;

    if ((body.company || '').trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const name = (body.name || '').trim();
    const phone = (body.phone || '').trim();

    if (!name) {
      return NextResponse.json({ ok: false, error: 'Укажите имя.' }, { status: 400 });
    }

    if (!phone) {
      return NextResponse.json({ ok: false, error: 'Укажите телефон.' }, { status: 400 });
    }

    if (!body.consent) {
      return NextResponse.json(
        { ok: false, error: 'Необходимо согласие на обработку персональных данных.' },
        { status: 400 }
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;

    if (!token || !chatId) {
      return NextResponse.json(
        { ok: false, error: 'Сервер не настроен для отправки в Telegram.' },
        { status: 500 }
      );
    }

    const selectedService = services.find((service) => service.id === body.serviceId);

    const message = [
      'Новая заявка:',
      `Имя: ${toSafeText(name)}`,
      `Телефон: ${toSafeText(phone)}`,
      `Авто: ${toSafeText(body.car)}`,
      `Услуга: ${selectedService ? selectedService.name : '—'}`,
      `Необходимые работы: ${toSafeText(body.requiredWorks)}`,
      `Комментарий: ${toSafeText(body.comment)}`
    ].join('\n');

    const telegramResponse = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message
      })
    });

    if (!telegramResponse.ok) {
      return NextResponse.json(
        { ok: false, error: 'Не удалось отправить сообщение в Telegram.' },
        { status: 502 }
      );
    }

    await addSubmission({
      name,
      phone,
      car: toSafeText(body.car),
      service: selectedService ? selectedService.name : '—',
      requiredWorks: toSafeText(body.requiredWorks),
      comment: toSafeText(body.comment)
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: 'Некорректный формат запроса.' }, { status: 400 });
  }
}
